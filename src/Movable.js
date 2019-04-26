class Movable extends THREE.Mesh {
	constructor() {
		super();

		this.MAXSPEED = 20; //Velocidades en distancia/segundo
		this.MAXACCEL = 0.5; //Aceleración en distancia/segundo^2
		this.MAXHEALTH = 100; //Vida
		this.CONSTANT_SPEED = false; //Si la velocidad siempre es la máxima, solo permite que la aceleración curve los objetos, no que los pare
		//this.hitbox =  new Hitbox(0.1, this);

		this.health = this.MAXHEALTH;
		this.posX = 0.0;
		this.posZ = 0.0;
		this.speed = new THREE.Vector2(0,0)
		this.accel = new THREE.Vector2(0,0);
	}

	update () { //Actualiza la posición, sobrecargado en hijos
		this.updateMove();
		this.position.set(this.posX, 0, this.posZ);
	}

	updateMove() { //Acelera de una forma independiente al framerate
		if(this.accel.x != 0 || this.accel.y != 0) {
			this.speed.add(this.accel.multiplyScalar(timeSinceLastFrame()));
		}
		if(this.speed.length() > this.MAXSPEED ||  this.CONSTANT_SPEED == true)
		{
			this.speed.normalize();
			this.speed.multiplyScalar(this.MAXSPEED);
		}

		this.posX += (this.speed.x*timeSinceLastFrame());
		this.posZ += (this.speed.y*timeSinceLastFrame());
	}
}
