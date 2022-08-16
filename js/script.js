const canvas = document.getElementById('canvas');
canvas.width = '1200';
canvas.height = '600';
const ctx = canvas.getContext('2d');
canvas.classList.add('canvas');

const buttonStart = document.getElementById('start');

const elementos = [];
let maxElements;
let time = new Date();
let fail = 0;

const draw = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.lineWidth = 10;
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
	elementos.forEach((elemento) => {
		elemento.draw();
		elemento.x += elemento.vx;
		elemento.y += elemento.vy;

		if (elemento.y + elemento.vy > canvas.height - 70 || elemento.y + elemento.vy < 10) {
			elemento.vy = -elemento.vy;
		}
		if (elemento.x + elemento.vx > canvas.width - 51 || elemento.x + elemento.vx < 5) {
			elemento.vx = -elemento.vx;
		}
	});

	window.requestAnimationFrame(draw);
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
		{ level: 1, vx: 1, max: 2 },
		{ level: 2, vx: 2, max: 3 },
		{ level: 3, vx: 3, max: 4 },
		{ level: 4, vx: 5, max: 6 },
		{ level: 5, vx: 7, max: 8 },
		{ level: 6, vx: 10, max: 10 },
	];

	if (timestamp - time < 60000) {
		return stages[0];
	} else if (timestamp - time < 120000) {
		return stages[1];
	} else if (timestamp - time < 180000) {
		return stages[2];
	} else if (timestamp - time < 240000) {
		return stages[3];
	} else if (timestamp - time < 300000) {
		return stages[4];
	} else {
		return stages[5];
	}
};

const agregarElementos = () => {
	const stage = setDifficult();
	if (elementos.length < stage.max) {
		let cosa = getCosas({
			y: getRandomNumber(10, canvas.height - 80),
			vx: stage.vx,
			vy: getRandomNumber(0, 4),
			letra: getRandomChar(),
		});
		elementos.push(cosa);
	}
	setTimeout(agregarElementos, getRandomNumber(1000, 2000));
};

const capturar = (key) => {
	console.log(elementos.find((element) => element.letra == key));
	let eliminar = [];
	let guardar = [];
	for (let i = 0; i < elementos.length; i++) {
		if (key == elementos[i].letra) {
			console.log(elementos.splice(i, 1));
			i--;
		} else {
			fail++;
		}
	}
};

//events

buttonStart.addEventListener('click', (e) => {
	e.preventDefault();
	time = Date.now();
	setDifficult(time);
	agregarElementos();
	draw();
	addEventListener('keydown', (e) => {
		e.preventDefault();
		let keyCode = e.key.length == 1 ? e.key.toLowerCase().charCodeAt(0) : 10;
		if (keyCode < 123 && keyCode > 96) {
			capturar(e.key.toLowerCase());
			console.log('es una tecla');
		}
	});
});
