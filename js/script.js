//instanciamos el canvas y los elementos html
const canvas = document.getElementById('canvas');
canvas.width = '1200';
canvas.height = '500';
const ctx = canvas.getContext('2d');

const buttonStart = document.getElementById('start');
const puntuaje = document.getElementById('puntos');

//variables guardado de datos
let elementos = [];
let time = Date.now();
let fail = 0;
let stage = {};
let marcador = 0;
let puntos = [];

//variables id de interval timeout
let niveles, agregar;

//Funciones que pintan en el lienzo-------------------------

//Función que pinta y controla los elementos moviles
const draw = () => {
	let stop = false;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBackground();
	elementos.forEach((elemento) => {
		elemento.draw();
		elemento.x += elemento.vx;
		elemento.y += elemento.vy;

		if (elemento.y + elemento.vy > canvas.height - 70 || elemento.y + elemento.vy < 10) {
			elemento.vy = -elemento.vy;
		}
		if (elemento.x + elemento.vx > canvas.width - 51) {
			stop = true;
		}
	});
	puntos.forEach((punto, index) => {
		if (punto.o > 0) {
			punto.draw();
			punto.o -= 0.01;
		} else {
			puntos.splice(index, 1);
		}
	});
	if (!stop) {
		requestAnimationFrame(draw);
	} else {
		gameOver();
	}
};

//Función que pinta el background del lienzo

const drawBackground = () => {
	const linearGradient = ctx.createLinearGradient(
		canvas.width / 2,
		0,
		canvas.width / 2,
		canvas.height
	);
	linearGradient.addColorStop(0, 'rgb(254, 254, 254)');
	//linearGradient.addColorStop(0.5, 'rgb(95, 0, 0)');
	linearGradient.addColorStop(1, 'rgb(253, 246, 231)');
	ctx.fillStyle = linearGradient;
	ctx.lineWidth = 15;
	ctx.lineJoin = 'round';
	ctx.strokeStyle = 'rgb(10, 1, 90)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
};

//----------------------- Funciones de lógica del juego y gestión de datos -----------------

//Función que construye los datos de los elementos del juego
const getCosas = ({ x = 5, y = 100, vx = 10, vy = 0, letra = 'b' }) => ({
	x,
	y,
	vx,
	vy,
	letra,
	draw() {
		ctx.drawImage(document.images[this.letra], this.x, this.y);
	},
});

//Función que construye los datos de las puntuaciones a pintar
const getPuntos = ({ x, y, p }) => ({
	x,
	y,
	p,
	o: 1,
	draw() {
		ctx.font = '20px serif';
		ctx.fillStyle = 'rgba(0,0,0,' + this.o + ')';
		ctx.fillText(this.p, this.x, this.y + 25);
	},
});

//Función que agrega elementos al array para pintarlos
const agregarElementos = () => {
	if (elementos.length < stage.max) {
		let cosa = getCosas({
			y: getRandomNumber(10, canvas.height - 80),
			vx: stage.vx,
			vy: getRandomNumber(0, 4),
			letra: getRandomChar(),
		});
		elementos.push(cosa);
	}
	agregar = setTimeout(agregarElementos, getRandomNumber(stage.minA, stage.maxA));
};

//Función que agrega elementos al array para pintarlos
const agregarPuntos = ({ x, y, p }) => {
	let punto = getPuntos({
		x,
		y,
		p,
	});
	puntos.push(punto);
	console.log(puntos);
};

//Función que setea la dificultad y devuelve los datos referentes a ella
const setDifficult = () => {
	const timestamp = Date.now();
	const stages = [
		{ level: 1, vx: 1, max: 2, minA: 1500, maxA: 2000, puntos: 1000 },
		{ level: 2, vx: 2, max: 3, minA: 1200, maxA: 1600, puntos: 2000 },
		{ level: 3, vx: 3, max: 4, minA: 1000, maxA: 1500, puntos: 4000 },
		{ level: 4, vx: 5, max: 6, minA: 800, maxA: 1200, puntos: 6000 },
		{ level: 5, vx: 6, max: 8, minA: 600, maxA: 1000, puntos: 8000 },
		{ level: 6, vx: 8, max: 10, minA: 500, maxA: 800, puntos: 10000 },
	];

	if (timestamp - time < 60000) {
		stage = stages[0];
		return;
	} else if (timestamp - time < 120000) {
		stage = stages[1];
		return;
	} else if (timestamp - time < 180000) {
		stage = stages[2];
		return;
	} else if (timestamp - time < 240000) {
		stage = stages[3];
		return;
	} else if (timestamp - time < 300000) {
		stage = stages[4];
		return;
	} else if (timestamp - time > 360000) {
		stage = stages[5];
		return;
	}
};

//Función que captura los elementos o suma fallos
const capturar = (key) => {
	if (elementos.find((element) => element.letra == key)) {
		for (let i = 0; i < elementos.length; i++) {
			if (key == elementos[i].letra) {
				let captura = elementos.splice(i, 1);
				i--;
				let punto = sumarPuntos(captura[0]);
				console.log(punto);
				agregarPuntos(punto);
			}
		}
	} else {
		fail++;
	}
};

//Función que suma puntos al marcador
const sumarPuntos = (captura) => {
	let disX = (captura.x * 100) / canvas.width;
	const divisores = [1, 0.9, 0.8, 0.7, 0.6, 0.5];
	let puntos = stage.puntos;

	switch (true) {
		case disX >= 75:
			puntos = puntos * divisores[3];
			break;
		case disX < 75 && disX >= 50:
			puntos = puntos * divisores[2];
			break;
		case disX < 50 && disX >= 25:
			puntos = puntos * divisores[1];
			break;
		case disX < 25:
			puntos = puntos * divisores[0];
			break;
	}
	switch (fail) {
		case 0:
			puntos = puntos * divisores[0];
			break;
		case 1:
			puntos = puntos * divisores[1];
			break;
		case 2:
			puntos = puntos * divisores[2];
			break;
		case 3:
			puntos = puntos * divisores[3];
			break;
		case 4:
			puntos = puntos * divisores[4];
			break;
		default:
			puntos = puntos * divisores[5];
			break;
	}
	fail = 0;
	marcador += puntos;
	puntuaje.innerHTML = marcador;
	return { p: puntos, x: captura.x, y: captura.y };
};

//Función que termina el juego, cancela eventos, intervalos, timeouts y animaciones
const gameOver = () => {
	cancelAnimationFrame(requestAnimationFrame(draw));
	clearInterval(niveles);
	clearTimeout(agregar);
	removeEventListener('keydown', () => {});
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBackground();
	ctx.font = '36px serif';
	ctx.fillStyle = 'red';
	ctx.fillText('GAME OVER', canvas.width / 2 - 110, 100);
};

//----------------- Funciones auxiliares-------------------------

//Función que devuelve una letra random
const getRandomChar = () => {
	min = Math.ceil(97);
	max = Math.floor(122);
	return String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));
};

//Función que devuelve un número random
const getRandomNumber = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
};

//-------------------- Funciones que resetean variables y estados -----------------------

//Función que inicia el juego
const start = () => {
	reset();
	time = Date.now();
	setDifficult();
	niveles = setInterval(setDifficult, 61000);
	drawBackground();
	agregarElementos();
	requestAnimationFrame(draw);
};

//función que resetea variables globales
const reset = () => {
	elementos = [];
	stage = {};
	fail = 0;
	marcador = 0;
};

//------------------- Funciones relativas a los eventos --------------------------

//Función relativa el evento keydown que controla las teclas que se tocan
const keyPresionada = (e) => {
	e.preventDefault();
	let keyCode = e.key.length == 1 ? e.key.toLowerCase().charCodeAt(0) : 10;
	if (keyCode < 123 && keyCode > 96) {
		capturar(e.key.toLowerCase());
	}
};

//-------------------------------------------------- Eventos --------------------------------------------

//Evento que pinta el lienzo al cargar la página
window.onload = () => {
	drawBackground();
};

//Evento que inicia el juego
buttonStart.addEventListener('click', (e) => {
	e.preventDefault();
	reset;
	start();

	addEventListener('keydown', keyPresionada); //evento que contro las keys que tecleamos
});
