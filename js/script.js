//inicializamos el canvas
const canvas = document.getElementById('canvas');
canvas.width = '1200';
canvas.height = '600';
const ctx = canvas.getContext('2d');
canvas.classList.add('canvas');

const buttonStart = document.getElementById('start');

let elementos = [];
let maxElements;
let time = Date.now();
let fail = 0;
let stage = {};
let niveles;
let raf;

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
	if (!stop) {
		raf = window.requestAnimationFrame(draw);
	} else {
		gameOver();
	}
	console.log(raf);
};

const gameOver = () => {
	cancelAnimationFrame(requestAnimationFrame(draw));
	elementos = [];
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBackground();
};

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

const getRandomChar = () => {
	min = Math.ceil(97);
	max = Math.floor(122);
	return String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));
};

const getRandomNumber = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
};

const setDifficult = () => {
	const timestamp = Date.now();
	const stages = [
		{ level: 1, vx: 10, max: 2, minA: 1500, maxA: 2000 },
		{ level: 2, vx: 2, max: 3, minA: 1200, maxA: 1600 },
		{ level: 3, vx: 3, max: 4, minA: 1000, maxA: 1500 },
		{ level: 4, vx: 5, max: 6, minA: 800, maxA: 1200 },
		{ level: 5, vx: 6, max: 8, minA: 600, maxA: 1000 },
		{ level: 6, vx: 8, max: 10, minA: 500, maxA: 800 },
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
	setTimeout(agregarElementos, getRandomNumber(stage.minA, stage.maxA));
};

const capturar = (key) => {
	console.log(elementos.find((element) => element.letra == key));
	for (let i = 0; i < elementos.length; i++) {
		if (key == elementos[i].letra) {
			console.log(elementos.splice(i, 1));
			i--;
		} else {
			fail++;
		}
	}
};

window.onload = () => {
	drawBackground();
};
//eventos

buttonStart.addEventListener('click', (e) => {
	e.preventDefault();
	time = Date.now();
	setDifficult();
	niveles = setInterval(setDifficult, 61000);
	drawBackground();
	agregarElementos();
	raf = window.requestAnimationFrame(draw);
	addEventListener('keydown', (e) => {
		e.preventDefault();
		let keyCode = e.key.length == 1 ? e.key.toLowerCase().charCodeAt(0) : 10;
		if (keyCode < 123 && keyCode > 96) {
			capturar(e.key.toLowerCase());
			console.log('es una tecla');
		}
	});
});
