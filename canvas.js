/*eslint no-undef: "error"*/
/*eslint-env browser*/
/*eslint-env commonjs*/
/*eslint-env es6*/
/*eslint-env jquery*/
/* eslint-disable no-console*/


/*
JET #333
MEDIUM CANDY APPLE RED D90429
QUEEN BLUE 406E8E
AERO BLUE CBF7ED
*/

var colors = {
	candyApple: "#D90429",
	queenBlue: "#406E8E",
	aereoBlue: "#CBF7Ed"

};
var score = {
	p1: 0,
	p2: 0
};
var decelCounter = 5;
var lastBounce = 0;
var delay = 300;

var main = function () {
	function clamp(val, min, max) {
		return Math.max(min, Math.min(max, val));
	}

	function updateScore(id, player) {
		let text = document.getElementById(id);
		if (text === null) {
			console.log("errore")
			return;
		}
		if (player == 1) {
			score.p1++;
			text.innerHTML = "Player1:" + score.p1;
		}
		if (player == 2) {
			score.p2++;
			text.innerHTML = "Player2:" + score.p2;
		}
	}

	class Shape {
		constructor(x, y) {
			this.x = x;
			this.y = y;
		}
		move(vx, vy, delta) {
			this.x += vx * delta;
			this.y += vy * delta;
		}

	}
	class Rectangle extends Shape {
		constructor(x, y, width, height) {
			super(x, y);
			this.width = width;
			this.height = height;
			this.movingLeft = false;
			this.movingRight = false;
		}
		getWidth() {
			return this.width;
		}
		getHeight() {
			return this.height;
		}
		checkboundings(canvas) {
			if (this.x + this.width > canvas.getWidth()) {
				if (this.x < canvas.getWidth()) {
					let dx = this.x + this.width - canvas.getWidth();
					this.x -= dx;
					console.log(this);
				}

				//this.x -= this.width;
			} else if (this.x < 0) {

				let dx = this.x;
				this.x -= dx;
			}
		}
	}
	class Circle extends Shape {
		constructor(x, y, radius, startAngle, endAngle) {
			super(x, y);
			this.radius = radius;
			this.startAngle = startAngle;
			this.endAngle = endAngle;
			this.velocity = {
				vx: 2,
				vy: 2
			};
			this.initialVelocity = {
				vx: 2,
				vy: 2
			};
			this.accelerating = false;
			this.decelerating = false;
			this.acceleration = 0.75;
			this.deceleration = -0.15;
			this.direction = 1;
		}
		intersects(rectangle) {
			//check if center is within the rectangle
			let nearX = clamp(this.x, rectangle.x, rectangle.x + rectangle.getWidth());
			let nearY = clamp(this.y, rectangle.y, rectangle.y + rectangle.getHeight());
			let dx = this.x - nearX;
			let dy = this.y - nearY;
			if ((dx * dx + dy * dy) < (this.radius * this.radius)) {
				return true;
			}
			return false;
		}
		accelerate(delta) {
			console.log("accel");
			this.velocity.vx += this.acceleration * this.direction * delta;
		}
		decelerate(delta) {
			console.log("decel");
			this.velocity.vx -= this.deceleration * this.direction * delta;
		}
		solveCollision(rectangle, delta) {
			//check if center is within the rectangle
			//let nearX = clamp(this.x, rectangle.x, rectangle.x + rectangle.getWidth());
			let nearY = clamp(this.y, rectangle.y, rectangle.y + rectangle.getHeight());
			//let dx = this.x - nearX;
			let dy = this.y - nearY;
			if (this.y < 300) {
				this.y += dy;
			}
			if (this.y > 300) {
				this.y -= dy + this.radius;
			}
			if (rectangle.movingLeft) {
				this.direction = -1;
				this.accelerating = true;
			}
			if (rectangle.movingRight) {
				this.direction = 1;
				this.accelerating = true;
			}
			this.velocity.vy = -this.velocity.vy;
		}
		checkBoundings(canvas) {

			if (lastBounce >= (Date.now() - delay)) {
				return;
			}
			lastBounce = Date.now();
			if (this.x >= canvas.getWidth() - this.radius) {
				console.log("bounce");
				this.velocity.vx = -this.velocity.vx;

				this.x -= this.x - canvas.getWidth() + this.radius;
			}
			if (this.x <= 0 + this.radius) {
				console.log("bounce");
				this.velocity.vx = -this.velocity.vx;

				this.x += (-this.x) + this.radius;
			}
		}
		reset(canvas) {
			this.x = canvas.getWidth() / 2;
			this.y = canvas.getHeight() / 2;
			let directionX;
			let directionY;
			if (Math.random() > 0.49) {
				directionX = -1;
			} else {
				directionX = 1;
			}
			if (Math.random() > 0.49) {
				directionY = -1;
			} else {
				directionY = 1;
			}
			this.velocity.vx = this.initialVelocity.vx * 2 * directionX * Math.random();
			do {
				this.velocity.vy = this.initialVelocity.vy * 3 * directionY * Math.random();
			} while (Math.abs(this.velocity.vy) <= 2.5);

		}
		checkScored(canvas) {
			if (this.y <= 0) {
				updateScore("p2score", 2);
				this.reset(canvas);
			} else if (this.y >= canvas.getHeight()) {
				updateScore("p1score", 1);
				this.reset(canvas);
			}


		}

	}
	let gameController = [];

	class Canvas {
		constructor(id) {
			this.canvas = document.getElementById(id);
			this.context = this.canvas.getContext("2d");
		}
		start() {

			window.addEventListener("keydown", function (e) {
				e.preventDefault();
				switch (e.which || e.keyCode) {
					case 65:
						//console.log("a");
						gameController[e.which || e.keyCode] = true;
						player2.movingLeft = true;
						//c1.move(-dx,0);
						break;
					case 68:
						//console.log("d");
						gameController[e.which || e.keyCode] = true;
						player2.movingRight = true;
						//c1.move(-dx,0);
						break;
					case 37:
						//console.log("left arrow");
						gameController[e.which || e.keyCode] = true;
						player1.movingLeft = true;
						//c1.move(-dx,0);
						break;
					case 38:
						//console.log("up arrow");
						gameController[e.which || e.keyCode] = true;

						//c1.move(-dx,0);
						break;
					case 39:
						//console.log("right arrow");
						gameController[e.which || e.keyCode] = true;

						player1.movingRight = true;
						//c1.move(dx,0);
						break;
					case 40:
						//console.log("down arrow");
						gameController[e.which || e.keyCode] = true;
						//c1.move(-dx,0);
						break;
				}
			});
			window.addEventListener("keyup", function (e) {
				e.preventDefault();
				switch (e.which || e.keyCode) {
					case 65:
						//console.log("a");
						gameController[e.which || e.keyCode] = false;
						player2.movingLeft = false;
						//c1.move(-dx,0);
						break;
					case 68:
						//console.log("d");
						gameController[e.which || e.keyCode] = false;
						player2.movingRight = false;
						//c1.move(-dx,0);
						break;
					case 37:
						//console.log("left arrow");
						gameController[e.which || e.keyCode] = false;
						player1.movingLeft = false;
						//c1.move(-dx,0);
						break;
					case 38:
						//console.log("up arrow");
						gameController[e.which || e.keyCode] = false;
						//c1.move(-dx,0);
						break;
					case 39:
						//console.log("right arrow");
						gameController[e.which || e.keyCode] = false;
						player1.movingRight = false;
						//c1.move(dx,0);
						break;
					case 40:
						//console.log("down arrow");
						gameController[e.which || e.keyCode] = false;
						//c1.move(-dx,0);
						break;
				}
			});
		}
		getContext() {
			return this.context;
		}
		getWidth() {
			return this.canvas.width;
		}
		getHeight() {
			return this.canvas.height;
		}
		drawRectangle(rect, color) {
			this.context.fillStyle = color;
			this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
			this.context.fillStyle = "black";
		}
		drawCircle(circle, color) {
			this.context.beginPath();
			this.context.fillStyle = color;
			this.context.arc(circle.x, circle.y, circle.radius, circle.startAngle, circle.endAngle);
			this.context.fill();
		}

	}

	//actual game code

	let canvas = new Canvas("myCanvas");
	canvas.start();

	let playerVelocity = 5;
	let player1 = new Rectangle(canvas.getWidth() / 2 - 50, 0, 100, 20);
	let player2 = new Rectangle(canvas.getWidth() / 2 - 50, canvas.getHeight() - 20, 100, 20);
	let ball = new Circle(canvas.getWidth() / 2, canvas.getHeight() / 2, 18, 0, 2 * Math.PI);
	ball.reset(canvas);

	function update(dtime) {

		if (ball.intersects(player1)) {
			console.log("intersecato");
			console.log(player1);
			ball.solveCollision(player1, dtime);
		} else if (ball.intersects(player2)) {
			console.log("intersecato");
			console.log(player2);
			ball.solveCollision(player2, dtime);
		}
		player1.checkboundings(canvas);
		player2.checkboundings(canvas);
		if (gameController[37]) {
			player1.move(-playerVelocity, 0, dtime / 10);

		}
		if (gameController[65]) {
			player2.move(-playerVelocity, 0, dtime / 10);

		}
		if (gameController[39]) {

			player1.move(playerVelocity, 0, dtime / 10);
		}
		if (gameController[68]) {
			player2.move(playerVelocity, 0, dtime / 10);
		}
		if (ball.accelerating) {
			ball.accelerate(dtime / 10);
			ball.decelerating = true;
			ball.accelerating = false;
		} else if (ball.decelerating) {
			if (decelCounter === 0) {
				ball.decelerating = false;
				decelCounter = 5;

			} else if (Math.abs(ball.velocity.vx) > Math.abs(ball.initialVelocity.vx)) {
				ball.decelerate(dtime / 10);
				decelCounter--;
			}

		}
		ball.move(ball.velocity.vx, -ball.velocity.vy, dtime / 10);
		ball.checkBoundings(canvas);
		ball.checkScored(canvas);

	}



	function draw() {
		canvas.drawRectangle(player1, colors.candyApple);
		canvas.drawRectangle(player2, colors.queenBlue);
		canvas.drawCircle(ball, "white");
	}

	function gameLoop() {
		let delta = Date.now() - clock;

		clock = Date.now();
		//console.log(delta);
		//console.log(ball);
		//console.log(player1);
		update(delta);
		canvas.getContext().clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
		draw();
		requestAnimationFrame(gameLoop);
	}
	requestAnimationFrame(gameLoop);
	let clock = Date.now();

}
