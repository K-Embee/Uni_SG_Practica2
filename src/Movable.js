class Movable extends THREE.Mesh {
	constructor() {
		super();

		this.MAXSPEED = 20; //Velocidades en distancia/segundo
		this.MAXACCEL = 0.5;
		this.FRICTION = 0.1;

		this.posX = 0.0;
		this.posZ = 0.0;
		this.speedX = 0;
		this.speedZ = 0;
		this.accelX = 0;
		this.accelZ = 0;
	}
}
