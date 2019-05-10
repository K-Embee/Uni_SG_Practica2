class Movable extends THREE.Mesh {
	constructor() {
		super();

		this.MAXSPEED = 20; //Velocidades en distancia/segundo
		this.MAXACCEL = 0.5; //Aceleración en distancia/segundo^2
		this.MAXHEALTH = 100; //Vida
		this.CONSTANT_SPEED = false; //Si la velocidad siempre es la máxima, solo permite que la aceleración curve los objetos, no que los pare
		this.radius = 1; // La radio del objeto, para detección de colisiones

		this.health = this.MAXHEALTH;
		this.posX = 0.0;
		this.posZ = 0.0;
		this.speed = new THREE.Vector2(0,0)
		this.accel = new THREE.Vector2(0,0);
		scene.updatables.push(this);
		this.collision_immune = Array();
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
	
	checkCollision(obj) { //Comprueba si se colisiona con un objeto o no. Devuelve TRUE si se ha de borrar debido a esa colisión, FALSE si no
		if(this.radius + obj.radius > this.position.distanceTo(obj.position)) {
			var x = this.collide(obj);
			if(this instanceof Projectile) console.log(x);
			return x;
		}
		return false;
	}
	
	collide(obj) { //Realiza la colisión con un objeto. Devuelve TRUE si se ha de borrar debido a esa colisión, FALSE si no
		return false;
	}
	
	OOBCheck() { //Comprueba si un objeto esta fuera de ambito. Devuelve TRUE si se ha de borrar
		if(Math.abs(this.posX) > 40 || Math.abs(this.posZ) > 40) {
			this.wrap();
		}
		return false;
	}
	
	wrap() { //Mueve un objeto al otro lado de la pantalla
		console.log("that's a wrap, folks");
		if(Math.abs(this.posX) > 40) {
			this.posX = (this.posX > 0) ? -40 : 40;
		}
		if(Math.abs(this.posZ) > 40) {
			this.posZ = (this.posZ > 0) ? -40 : 40;
		}
	}
}
