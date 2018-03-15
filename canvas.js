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

var colors={
	candyApple : "#D90429",
	queenBlue : "#406E8E",
	aereoBlue : "#CBF7Ed"

};




var main=function(){
	function clamp(val, min, max) {
		return Math.max(min, Math.min(max, val));
	}
	var circleVelocity={
		vx:2,
		vy:2
	};
	/*
	function solveCollision(circle, rectangle){
		let nearX = clamp(circle.x, rectangle.x, rectangle.x +rectangle.getWidth());
		let nearY = clamp(circle.y, rectangle.y, rectangle.y +rectangle.getHeight());
		
		//let dx=circle.x - nearX;
		let dy=circle.y - nearY;
		
		circle.y+=circle.radius+dy;
		circleVelocity=-circleVelocity;
	}*/
	
	class Shape{
		constructor(x,y){
			this.x=x;
			this.y=y;
		}
		move(vx,vy,delta){
			this.x+=vx*delta;
			this.y+=vy*delta;
		}
		
	}
	class Rectangle extends Shape{
		constructor(x,y,width,height){
			super(x,y);
			this.width=width;
			this.height=height;
			this.movingLeft=false;
			this.movingRight=false;
		}
		getWidth(){
			return this.width;
		}
		getHeight(){
			return this.height;
		}
	}
	class Circle extends Shape{
		constructor(x,y,radius, startAngle, endAngle){
			super(x,y);
			this.radius=radius;
			this.startAngle=startAngle;
			this.endAngle=endAngle;
		}
		intersects(rectangle){
			//check if center is within the rectangle
			let nearX = clamp(this.x, rectangle.x, rectangle.x +rectangle.getWidth());
			let nearY = clamp(this.y, rectangle.y, rectangle.y +rectangle.getHeight());
			let dx=this.x - nearX;
			let dy=this.y - nearY;
			if((dx*dx+dy*dy)<(this.radius*this.radius)){
				return true;
			}
			return false;
		}
		solveCollision(rectangle){
			//check if center is within the rectangle
			let nearX = clamp(this.x, rectangle.x, rectangle.x +rectangle.getWidth());
			let nearY = clamp(this.y, rectangle.y, rectangle.y +rectangle.getHeight());
			let dx=this.x - nearX;
			let dy=this.y - nearY;
			if(this.y<300){
				this.y+=dy;
			}
			if(this.y>300){
				this.y-=dy+this.radius;
			}	
			circleVelocity.vy=-circleVelocity.vy;
		}
		checkBoundings(){
		
		}
	}
	let gameController=[];
	
	class Canvas{
		constructor(id){
			this.canvas =document.getElementById(id);
			this.context=this.canvas.getContext("2d");
		}
		start(){
			
			window.addEventListener("keydown", function (e){
				e.preventDefault();
				switch(e.which){
					case 37:
						//console.log("left arrow");
						gameController[e.which || e.keyCode]=true;
						player1.movingLeft=true;
						//c1.move(-dx,0);
						break;
					case 38:
						//console.log("up arrow");
						gameController[e.which || e.keyCode]=true;
						
						//c1.move(-dx,0);
						break;
					case 39:
						//console.log("right arrow");
						gameController[e.which || e.keyCode]=true;
						
						player1.movingRight=true;
						//c1.move(dx,0);
						break;
					case 40:
						//console.log("down arrow");
						gameController[e.which || e.keyCode]=true;
						//c1.move(-dx,0);
						break;
				}
			});
			window.addEventListener("keyup", function (e){
				e.preventDefault();
				switch(e.which){
					case 37:
						//console.log("left arrow");
						gameController[e.which || e.keyCode]=false;
						player1.movingLeft=false;
						//c1.move(-dx,0);
						break;
					case 38:
						//console.log("up arrow");
						gameController[e.which || e.keyCode]=false;
						//c1.move(-dx,0);
						break;
					case 39:
						//console.log("right arrow");
						gameController[e.which || e.keyCode]=false;
						player1.movingRight=false;
						//c1.move(dx,0);
						break;
					case 40:
						//console.log("down arrow");
						gameController[e.which || e.keyCode]=false;
						//c1.move(-dx,0);
						break;
				}
			});
		}
		getContext(){
			return this.context;
		}
		getWidth(){
			return this.canvas.width;
		}
		getHeight(){
			return this.canvas.height;
		}
		drawRectangle(rect, color){
			this.context.fillStyle=color;
			this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
			this.context.fillStyle="black";
		}
		drawCircle(circle, color){
			this.context.beginPath();
			this.context.fillStyle=color;
			this.context.arc(circle.x, circle.y, circle.radius, circle.startAngle, circle.endAngle);
			this.context.fill();
		}
	
	}
	
	//actual game code
	
	let canvas = new Canvas("myCanvas");
	canvas.start();
	console.log(canvas.getWidth());
	let playerVelocity=5;
	
	let player1=new Rectangle(canvas.getWidth()/2-50,0,100,20);
	let player2=new Rectangle(canvas.getWidth()/2-50,canvas.getHeight()-20,100,20);
	let ball=new Circle(canvas.getWidth()/2,canvas.getHeight()/2,18,0,2*Math.PI);
	
	function update(dtime){
		//c1.translate(dx,dy);
		//console.log(gameController[37]);
		//console.log(gameController[39]);
		if(ball.intersects(player1)){
			console.log("intersecato");
			ball.solveCollision(player1);
		}else if(ball.intersects(player2)){
			console.log("intersecato");
			ball.solveCollision(player2);
		}
		
		if(gameController[37]){
			//rect1.move(-dx, 0);
			player1.move(-playerVelocity,0,dtime/10);
			
			//ball.move(-playerVelocity,0,dtime/10);
		}
		if(gameController[38]){
			
		}
		if(gameController[39]){
			//rect1.move(dx, 0);
			player1.move(playerVelocity,0,dtime/10);
		}
		if(gameController[40]){
		}
		ball.move(0,-circleVelocity.vy,dtime/10);
	}
	function draw(){
		canvas.drawRectangle(player1, colors.candyApple);
		canvas.drawRectangle(player2, colors.queenBlue);
		canvas.drawCircle(ball, "white");
		//canvas.drawCircle(c1, "red");
	}
	
	function gameLoop(){
		let delta=Date.now()-clock;
		
		clock=Date.now();
		//console.log(delta);
		//console.log(ball);
		console.log(player1);
		update(delta);
		canvas.getContext().clearRect(0,0, canvas.getWidth(), canvas.getHeight());
		draw();
		requestAnimationFrame(gameLoop);
	}
	requestAnimationFrame(gameLoop);
	let clock=Date.now();
}

