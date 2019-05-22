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
			return this.collide(obj);
		}
		return false;
	}

	collide(obj) { //Realiza la colisión con un objeto. Devuelve TRUE si se ha de borrar debido a esa colisión, FALSE si no
		return false;
	}

	asteroidBounce(obj) {
		var tangent = this.position.clone().sub(obj.position);
		var speed3D = new THREE.Vector3(this.speed.x,0,this.speed.y);
		var angle = speed3D.negate().angleTo(tangent);
		var axis = new THREE.Vector3(0,1,0);

		if(this instanceof Asteroid && this.radius > obj.radius) {
			return ; //Para dar un cierto peso a los asteroides mas grandes
		}

		if(angle && angle < Math.PI/4) {
			speed3D.applyAxisAngle(axis, angle*2);
		}
		else {
			speed3D = tangent.clone().setLength(Math.max(obj.speed.length()+2.5,this.speed.length()));
		}
		this.speed.x = speed3D.x; this.speed.y = speed3D.z;
	}

	OOBCheck() { //Comprueba si un objeto esta fuera de ambito. Devuelve TRUE si se ha de borrar
		if(Math.abs(this.posX) > scene_size_x + this.radius || Math.abs(this.posZ) > scene_size_z + this.radius) {
			this.wrap();
		}
		return false;
	}

	wrap() { //Mueve un objeto al otro lado de la pantalla
		if(Math.abs(this.posX) > scene_size_x + this.radius) {
			this.posX = (this.posX > 0) ? -scene_size_x  - this.radius : scene_size_x + this.radius;
		}
		if(Math.abs(this.posZ) > scene_size_z + this.radius) { //-22 a  10 con esta camara
			this.posZ = (this.posZ > 0) ? -scene_size_z  - this.radius : scene_size_z  + this.radius;
		}
	}

	dispose() { //Elimina un objeto
		if(this.geometry) this.geometry.dispose();
		if(this.material) this.material.dispose();
		this.collision_immune = Array();
	}
}
