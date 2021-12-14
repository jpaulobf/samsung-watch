/*
	Calcula o movimento de um objeto de um ponto ao outro
*/
class VectorPointToPoint {

	speed				= 0;
	initialPosition		= { x:0, y:0 }
	destinationPosition = { x:0, y:0 }
	moves				= 0;
	stepX				= 0.0;
	stepY				= 0.0;

	constructor(speed, initialPositionX, initialPositionY) {
		this.speed				= speed;
		this.initialPosition.x	= initialPositionX;
		this.initialPosition.y	= initialPositionY;
	}

	setInitialPosition(x, y) {
		this.initialPosition.x = x;
		this.initialPosition.y = y;
	}

	setDestPosition(x, y) {
		this.destinationPosition.x = x;
		this.destinationPosition.y = y;
	}

	getInitialX() {
		return (this.initialPosition.x);
	}

	getInitialY() {
		return (this.initialPosition.y);
	}

	hasMoreMovements() {
		return (this.moves-- > 0);
	}

	calcDistance() {
		var tempx		= this.destinationPosition.x - this.initialPosition.x;
		var tempy		= this.destinationPosition.y - this.initialPosition.y;

		var distance	= Math.sqrt((tempx * tempx) + (tempy * tempy));
		this.moves		= Math.floor(distance / this.speed);

		this.stepX		= (tempx / this.moves);
		this.stepY		= (tempy / this.moves);
	}
}

/*
	Calcula o movimento de um objeto em direção a um ângulo (clockwise)
*/
class VectorMovementByAngle {

	speed				= 0;
	angle				= 0;
	initialPosition		= { x:0, y:0 }
	stepX				= 0.0;
	stepY				= 0.0;

	constructor(speed, angle, initialPositionX, initialPositionY) {
		this.speed				= speed;
		this.angle				= angle;
		this.initialPosition.x	= initialPositionX;
		this.initialPosition.y	= initialPositionY;
	}

	addAngle() {
		this.angle += 6;

		if (this.angle >= 360) {
			this.angle = 0;
		}
	}

	addSpeed(incSpeed) {
		this.speed += incSpeed;
	}

	addCustomAngle(value) {
		this.angle += value;

		if (this.angle >= 360) {
			this.angle = 0;
		}
	}

	setAngle(angle) {
		this.angle = angle;
	}

	circleColision(ball1, ball2, vector2) {
		var dx = ball1.x + this.stepX - ball2.x + vector2.stepX;
		var dy = ball1.y + this.stepY - ball2.y + vector2.stepY;
		var collisionAngle = Math.atan2(dy, dx);

		var speed1 = Math.sqrt((this.stepX * this.stepX) + (this.stepY * this.stepY));
		var speed2 = Math.sqrt((vector2.stepX * vector2.stepX) + (vector2.stepY * vector2.stepY));

		var direction1 = Math.atan2(this.stepY, this.stepX);
		var direction2 = Math.atan2(vector2.stepY, vector2.stepX);

		var stepX_1 = speed1 * Math.cos(direction1 - collisionAngle);
		var stepY_1 = speed1 * Math.sin(direction1 - collisionAngle);
		var stepX_2 = speed2 * Math.cos(direction2 - collisionAngle);
		var stepY_2 = speed2 * Math.sin(direction2 - collisionAngle);

		var final_stepX_1 = (((r - r) * stepX_1) + (2 * r * stepX_2)) / (2 * r);
		var final_stepX_2 = ((2 * r * stepX_1) + ((r - r) * stepX_2)) / (2 * r);
		var final_stepY_1 = stepY_1;
		var final_stepY_2 = stepY_2;

		this.stepX = Math.cos(collisionAngle) * final_stepX_1 + Math.cos(collisionAngle + Math.PI/2) * final_stepY_1;
		this.stepY = Math.sin(collisionAngle) * final_stepX_1 + Math.sin(collisionAngle + Math.PI/2) * final_stepY_1;
		vector2.stepX = Math.cos(collisionAngle) * final_stepX_2 + Math.cos(collisionAngle + Math.PI/2) * final_stepY_2;
		vector2.stepY = Math.sin(collisionAngle) * final_stepX_2 + Math.sin(collisionAngle + Math.PI/2) * final_stepY_2;
	}

	testWallColision(axis, position, width, lenght, radius) {
		if (axis == "y") {
			if (position - radius <= 0 || position + radius >= lenght) {
				this.stepY *= -1;
			}
		} else { //"x"
			if (position - radius <= 0 || position + radius >= width) {
				this.stepX *= -1;
			}
		}
	}

	setInitialPosition(x, y) {
		this.initialPosition.x = x;
		this.initialPosition.y = y;
	}

	getInitialX() {
		return (this.initialPosition.x);
	}

	getInitialY() {
		return (this.initialPosition.y);
	}

	calculateMovementByAngle() {
		var radians = (this.angle - 90) * Math.PI / 180;
		this.stepX	= Math.cos(radians) * this.speed;
		this.stepY	= Math.sin(radians) * this.speed;
	}
}


/*
	Calcula o movimento de um objeto em direção a multiplos pontos interligados
*/
class VectorMultiPoint {

	speed					= 0;
	initialPosition			= { x:0, y:0 }
	stepX					= 0.0;
	stepY					= 0.0;
	distance				= 0;
	destinationPoints		= new Array();
	
	totalDestinations		= 0;
	totalMoves				= 0;
	destinationMovements	= new Array();


	constructor(speed, initialPositionX, initialPositionY) {
		this.speed				= speed;
		this.initialPosition.x	= initialPositionX;
		this.initialPosition.y	= initialPositionY;
	}

	addDestinationPoint(x, y) {
		this.destinationPoints.push({x, y});
		this.totalDestinations++;
	}

	setInitialPosition(x, y) {
		this.initialPosition.x = x;
		this.initialPosition.y = y;
	}

	getInitialX() {
		return (this.initialPosition.x);
	}

	getInitialY() {
		return (this.initialPosition.y);
	}

	getStepX() {
		return(this.destinationMovements[this.destinationMovements.length-this.totalMoves].x);
	}
		
	getStepY() {
		return(this.destinationMovements[this.destinationMovements.length-this.totalMoves].y);
	}

	hasMoreMovements() {
		return (this.totalMoves-- > 0);
	}

	calcMovements() {

		var tempx		= 0;
		var tempy		= 0;
		var tempStepX	= 0;
		var tempStepY	= 0;
		var distance	= 0;
		var moves		= 0;
		var tempIpX		= this.initialPosition.x;
		var tempIpY		= this.initialPosition.y;

		for (var i = 0; i < this.totalDestinations; i++) {
			
			tempx			= this.destinationPoints[i].x - tempIpX;
			tempy			= this.destinationPoints[i].y - tempIpY;
			distance		= Math.sqrt((tempx * tempx) + (tempy * tempy));

			//Calcula as variáveis de cada movimento.
			moves			= Math.floor(distance / this.speed);
			tempStepX		= (tempx / moves);
			tempStepY		= (tempy / moves);

			//Armazena para posterior devolução
			for (var j = 0; j < moves; j++) {
				this.destinationMovements.push({x:tempStepX, y:tempStepY});
			}
			
			//soma o total de movimentos para controlar o total de passos a executar
			this.totalMoves	+= moves;				
			
			//realoca o ponto inicial
			tempIpX = this.destinationPoints[i].x;
			tempIpY = this.destinationPoints[i].y;
		}
	}		
}