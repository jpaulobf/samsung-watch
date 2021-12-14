function random(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

var canvas		= null;
var ctx			= null;
var ball		= null;
var ball1		= null;
var ball2		= null;
var r			= 30;

//--------------------------------------------------------------------------------//

/*
	Exemplo 1
*/
function example1() {

	//recupera o canvas e o 2d context
	canvas			= document.getElementById("gcanvas");
	ctx				= canvas.getContext("2d");
	var vector		= new VectorPointToPoint(5, 0, 0);
	var fps			= 0;
	var progress	= 0;
	var lastRender	= 0;
	var fpsArray	= new Array();

	//define o ponto de destino e realiza o cálculo de distância
	vector.setDestPosition(250, 250);
	vector.calcDistance();

	//define os dados iniciais da bola
	ball = {x:vector.getInitialX(), y:vector.getInitialY()};

	//entra no loop de animação
	window.requestAnimationFrame(loopExample1);

	/*
		calcula o tempo médio de cada quadro
	*/
	function calcFPS(timestamp) {
		//Calcula o tempo de execução do último quadro
		progress = timestamp - lastRender;
		
		//Atualiza o tempo do loop
		lastRender = timestamp;
		
		//entra no loop de animação
		window.requestAnimationFrame(calcFPS);
	}

	/*
		Inner function: loop de animação
	*/
	function loopExample1(timestamp) {

		//Calcula o FPS do jogo
		fps = Math.round((1000 / progress));
	
		//verifica se ainda há movimentos para alcançar o ponto destino
		if (vector.hasMoreMovements()) {
			ball.x += vector.stepX;
			ball.y += vector.stepY;
		}

		//pinta o canvas
		ctx.fillStyle = "#EEEEEE";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#000000";
		ctx.fillText("FPS: " + fps, 10, 10);

		//desenha a bola na posição correta
		ctx.fillStyle = "#000000";
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, r, 0, 2 * Math.PI);
		ctx.fill();

		//loop...
		window.requestAnimationFrame(loopExample1);
	}
}


/*
	Exemplo 2
*/
function example2() {
	
	function detectColision(x1, y1, x2, y2, r1, r2) {
		var colision = false;
		var dx = x1 - x2;
		var dy = y1 - y2;
		var dist = (dx * dx + dy * dy);
		if (dist <= ((r1 + r2) * (r1 + r2))) {
			colision = true;
		}

		return (colision);
	}


	//recupera o canvas e o 2d context
	canvas				= document.getElementById("gcanvas");
	ctx					= canvas.getContext("2d");
	var randomAngle1	= random(0, 360);
	var randomAngle2	= random(0, 360);
	var minXY			= 50;
	var maxXY			= 450;
	var randomX1		= random(minXY, maxXY);
	var randomX2		= random(minXY, maxXY);
	var randomY1		= random(minXY, maxXY);
	var randomY2		= random(minXY, maxXY);

	while (detectColision(randomX1, randomY1, randomX2, randomY2, r, r)) {
		randomX2 = random(minXY, maxXY);
		randomY2 = random(minXY, maxXY);
	}
	
	//cria o objeto de cálculos
	var vectorBall1	= new VectorMovementByAngle(5, randomAngle1, randomX1, randomY1);
	var vectorBall2	= new VectorMovementByAngle(5, randomAngle2, randomX2, randomY2);

	//calcula o movimento destino pelo ângulo informado
	vectorBall1.calculateMovementByAngle();
	vectorBall2.calculateMovementByAngle();

	ball1 = {x:vectorBall1.getInitialX(), y:vectorBall1.getInitialY()};
	ball2 = {x:vectorBall2.getInitialX(), y:vectorBall2.getInitialY()};

	//entra no loop de animação
	window.requestAnimationFrame(loopExample2);

	/*
		Inner function: loop de animação
	*/
	function loopExample2(timestamp) {

		//testa a colisão com as paredes
		//adiciona o valor do próximo passo, 
		//para que se possa antecipar a colisão
		vectorBall1.testWallColision("x", ball1.x + vectorBall1.stepX, 500, 500, r);
		vectorBall1.testWallColision("y", ball1.y + vectorBall1.stepY, 500, 500, r);
		vectorBall2.testWallColision("x", ball2.x + vectorBall2.stepX, 500, 500, r);
		vectorBall2.testWallColision("y", ball2.y + vectorBall2.stepY, 500, 500, r);

		//caso ocorra a colisão circular, atualiza o evento conforme 3a lei de Newton
		if (detectColision(ball1.x + vectorBall1.stepX, 
						   ball1.y + vectorBall1.stepY, 
						   ball2.x + vectorBall2.stepX, 
						   ball2.y + vectorBall2.stepY, r, r)) {
		
			vectorBall1.circleColision(ball1, ball2, vectorBall2);
		}

		//acresce as próximas posições
		vectorBall1.stepX = vectorBall1.stepX - (vectorBall1.stepX * 0.003);
		vectorBall1.stepY = vectorBall1.stepY - (vectorBall1.stepY * 0.003);
		vectorBall2.stepX = vectorBall2.stepX - (vectorBall2.stepX * 0.003);
		vectorBall2.stepY = vectorBall2.stepY - (vectorBall2.stepY * 0.003);
		
		ball1.x += vectorBall1.stepX;
		ball1.y += vectorBall1.stepY;
		ball2.x += vectorBall2.stepX;
		ball2.y += vectorBall2.stepY;
		
		//pinta o canvas
		ctx.fillStyle = "#EEEEEE";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//desenha a bola na posição correta
		ctx.fillStyle = "#000000";
		ctx.beginPath();
		ctx.arc(ball1.x, ball1.y, r, 0, 2 * Math.PI);
		ctx.fill();

		ctx.fillStyle = "#FF0000";
		ctx.beginPath();
		ctx.arc(ball2.x, ball2.y, r, 0, 2 * Math.PI);
		ctx.fill();

		//loop...
		window.requestAnimationFrame(loopExample2);
	}
}

/*
	Exemplo 3
*/
function example3() {

	//recupera o canvas e o 2d context
	canvas	= document.getElementById("gcanvas");
	ctx	= canvas.getContext("2d");

	//cria o objeto de cálculos
	var vector3	= new VectorMultiPoint(5, 0, 0);
	
	//adiciona os pontos de destino
	vector3.addDestinationPoint(150, 150);
	vector3.addDestinationPoint(350, 150);
	vector3.addDestinationPoint(350, 350);
	vector3.addDestinationPoint(150, 350);
	vector3.addDestinationPoint(150, 150);

	//calcula todos os movimentos
	vector3.calcMovements();
	
	//posição inicial
	ball = {x:vector3.getInitialX(), y:vector3.getInitialY()};

	//entra no loop de animação
	window.requestAnimationFrame(loopExample3);

	/*
		Inner function: loop de animação
	*/
	function loopExample3(timestamp) {
		
		//verifica se ainda há movimentos para alcançar o ponto destino
		if (vector3.hasMoreMovements()) {
			ball.x += vector3.getStepX();
			ball.y += vector3.getStepY();
		}
		
		//pinta o canvas
		ctx.fillStyle = "#EEEEEE";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//desenha a bola na posição correta
		ctx.fillStyle = "#000000";
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, r, 0, 2 * Math.PI);
		ctx.fill();

		//loop...
		window.requestAnimationFrame(loopExample3);
	}
}


/*
	Exemplo 4
*/
function sample4() {

	//recupera o canvas e o 2d context
	canvas			= document.getElementById("gcanvas");
	ctx				= canvas.getContext("2d");
	
	//recupera a data do sistema e distribui
	var lastRender	= 0;
	var progress	= 0;
	var date		= new Date();
	var seconds		= date.getSeconds();
	var minutes		= date.getMinutes();
	var hours		= date.getHours();
	var imageFace	= new Image();

	//cria os objetos de cálculos
	var vectorSeconds	= new VectorMovementByAngle(90, 0, 250, 250);
	var vectorMinutes	= new VectorMovementByAngle(70, 0, 250, 250);
	var vectorHours		= new VectorMovementByAngle(50, 0, 250, 250);

	//multiplica os segundos por 6 para obter o ângulo (1 segundo = 6 graus)
	vectorSeconds.setAngle(seconds * 6);

	//calcula os movimentos do ponteiro do segundo
	vectorSeconds.calculateMovementByAngle();

	//multiplica os minutos por 6 para obter o ângulo (1 minuto = 6 graus)
	vectorMinutes.setAngle(minutes * 6);

	//calcula os movimentos do ponteiro do minuto
	vectorMinutes.calculateMovementByAngle();

	//verifica se a hora está no formato 24, se sim, transforma no formato 12
	hours = (hours > 12)?hours-12:hours;

	//multiplica as horas por 30 para obter o ângulo (1 hora = 30 graus)
	vectorHours.setAngle(hours * 30);

	//calcula os movimentos do ponteiro da hora
	vectorHours.calculateMovementByAngle();

	console.log("2");

	imageFace.addEventListener("load", faceloaded, false);
	imageFace.src = "./images/relogio.png";
	
	function faceloaded() {
		//entra no loop de animação
		window.requestAnimationFrame(loopExample4);
	}

	/*
		Inner function: loop de animação
	*/
	function loopExample4(timestamp) {

		//Calcula o tempo de execução do último quadro
		progress += timestamp - lastRender;

		//pinta o canvas
		ctx.fillStyle = "#EEEEEE";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		//pinta o faceplate do relógio
		ctx.drawImage(imageFace, 153, 153);

		//desenha o contorno do relógio
		ctx.strokeStyle = "#000000";
		ctx.beginPath();
		ctx.arc(vectorSeconds.getInitialX(), vectorSeconds.getInitialY(), 99, 0, 2 * Math.PI);
		ctx.stroke();

		//desenha o miolo do relógio
		ctx.fillStyle = "#444444";
		ctx.beginPath();
		ctx.arc(vectorSeconds.getInitialX(), vectorSeconds.getInitialY(), 3, 0, 2 * Math.PI);
		ctx.fill();		

		//desenha o ponteiro do segundo
		ctx.strokeStyle = "#FF0000";
		ctx.beginPath();
		ctx.moveTo(vectorSeconds.getInitialX(), vectorSeconds.getInitialY());
		ctx.lineTo(vectorSeconds.getInitialX() + vectorSeconds.stepX, vectorSeconds.getInitialY() + vectorSeconds.stepY);
		ctx.stroke();

		//desenha o ponteiro do minuto
		ctx.strokeStyle = "#000000";
		ctx.beginPath();
		ctx.moveTo(vectorMinutes.getInitialX(), vectorMinutes.getInitialY());
		ctx.lineTo(vectorMinutes.getInitialX() + vectorMinutes.stepX, vectorMinutes.getInitialY() + vectorMinutes.stepY);
		ctx.stroke();

		//desenha o ponteiro da hora
		ctx.strokeStyle = "#000000";
		ctx.beginPath();
		ctx.moveTo(vectorHours.getInitialX(), vectorHours.getInitialY());
		ctx.lineTo(vectorHours.getInitialX() + vectorHours.stepX, vectorHours.getInitialY() + vectorHours.stepY);
		ctx.stroke();

		//atualiza uma vez a cada 1000 milisegundos
		if (progress >= 1000) {
			seconds++;
			vectorSeconds.addAngle();
			vectorSeconds.calculateMovementByAngle();
			progress = 0;
		}

		//atualiza os segundos/minutos
		if (seconds >= 60) {
			seconds = 0;
			minutes++;
			vectorMinutes.addAngle();
			vectorMinutes.calculateMovementByAngle();
		}

		//atualiza os minutos/hora
		if (minutes >= 60) {
			minutes = 0;
			hours++;
			vectorHours.addCustomAngle(30);
			vectorHours.calculateMovementByAngle();
		}

		//atualiza a hora
		if (hours >= 12) {
			hours = 0;
		}

		//recalcula o tempo de execução
		lastRender = timestamp;

		//loop...
		window.requestAnimationFrame(loopExample4);
	}
}

/*
	Exemplo 5
*/
function example5() {

	//recupera o canvas e o 2d context
	canvas		= document.getElementById("gcanvas");
	ctx		= canvas.getContext("2d");
	var balls	= new Array();
	var ball	= { centerX:0, centerY:0, radius:0, mass:0, angle:0, positionX:0, positionY: 0, speed:0.01 };
	var index	= 1;
	
	//recupera a data do sistema e distribui
	var lastRender	= 0;
	var progress	= 0;

	//cria os objetos de cálculos
	var vector = new VectorMovementByAngle(50, 0, 250, 250);

	for (i = 0; i < 5; i++) {
		ball.centerX	= 250;
		ball.centerY	= 250;
		ball.radius		= 10;
		balls.push(ball);
	}

	//entra no loop de animação
	window.requestAnimationFrame(loopExample5);

	/*
		Inner function: loop de animação
	*/
	function loopExample5(timestamp) {

		//Calcula o tempo de execução do último quadro
		progress += timestamp - lastRender;

		//pinta o canvas
		ctx.fillStyle = "#EEEEEE";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		var tempBall;

		//desenha a bola na posição correta
		for (j = 0; j < index; j++) {
			
			tempBall = balls[j];
			tempBall.positionX	= tempBall.centerX + Math.cos(tempBall.angle) * tempBall.radius;
			tempBall.positionY	= tempBall.centerY + Math.sin(tempBall.angle) * tempBall.radius;
			tempBall.angle		+= tempBall.speed;
			tempBall.radius		+= .2;

			ctx.fillStyle = "#000000";
			ctx.beginPath();
			ctx.arc(tempBall.positionX, tempBall.positionY, 10, 0, 2 * Math.PI);
			ctx.fill();
		}
		

		//atualiza uma vez a cada 1000 milisegundos
		if (progress >= 1000 && index < balls.length) {
			
			//vector.addAngle();
			//vector.addSpeed(radiusRate);
			//vector.calculateMovementByAngle();
			progress = 0;
			index++;
		}
		
		//recalcula o tempo de execução
		lastRender = timestamp;

		//loop...
		window.requestAnimationFrame(loopExample5);
	}
}



/*
	Exemplo 6
*/
function example6() {

	//recupera o canvas e o 2d context
	canvas		= document.getElementById("gcanvas");
	ctx		= canvas.getContext("2d");

	//recupera a data do sistema e distribui
	var lastRender	= 0;
	var progress	= 0;

	var p0 = {x:150, y:440};
	var p1 = {x:450, y:10};
	var p2 = {x:50, y:10};
	var p3 = {x:325, y:450};

	var ball	= {x:0, y:0, speed:0.01, t:0};
	var car		= new Image();
	car.src		= "carro.gif";
	car.onload	= loop;
	
	function loop() {
		//entra no loop de animação
		window.requestAnimationFrame(loopExample6);
	}

	/*
		Inner function: loop de animação
	*/
	function loopExample6(timestamp) {

		//Calcula o tempo de execução do último quadro
		progress += timestamp - lastRender;

		//pinta o canvas
		ctx.fillStyle = "#EEEEEE";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		//Bezier
		var t = ball.t;
		var cx = 3 * (p1.x - p0.x)
		var bx = 3 * (p2.x - p1.x) - cx;
		var ax = p3.x - p0.x - cx - bx;
		var cy = 3 * (p1.y - p0.y);
		var by = 3 * (p2.y - p1.y) - cy;
		var ay = p3.y - p0.y - cy - by;
		var xt = ax*(t*t*t) + bx*(t*t) + cx*t + p0.x;
		var yt = ay*(t*t*t) + by*(t*t) + cy*t + p0.y;
		ball.t += ball.speed;

		
		if (ball.t > 1) {
			ball.t = 1;
		}
		
		/*					
		ctx.font ="10px sans";
		ctx.fillStyle = "#FF0000";
		ctx.beginPath();
		ctx.arc(p0.x,p0.y,8,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText("0",p0.x-2,p0.y+2);

		ctx.fillStyle = "#FF0000";
		ctx.beginPath();
		ctx.arc(p1.x,p1.y,8,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText("1",p1.x-2,p1.y+2);

		ctx.fillStyle = "#FF0000";
		ctx.beginPath();
		ctx.arc(p2.x,p2.y,8,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();			
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText("2",p2.x-2, p2.y+2);

		ctx.fillStyle = "#FF0000";
		ctx.beginPath();
		ctx.arc(p3.x,p3.y,8,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText("3",p3.x-2, p3.y+2);
		*/

		ball.x = xt-car.width/2;
		ball.y = yt-car.height/2;
		ctx.drawImage(car, ball.x, ball.y);
		
		
		//recalcula o tempo de execução
		lastRender = timestamp;

		//loop...
		window.requestAnimationFrame(loopExample6);
	}
}