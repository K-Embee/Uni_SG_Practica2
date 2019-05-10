class Asteroid extends Movable {
	constructor(radius, posX, posZ) {
		super();

		this.geometry = new THREE.SphereGeometry (radius,8,8);
		this.material = new THREE.MeshPhongMaterial({color: color_brown});

		this.MAXSPEED = 20/radius; //Velocidades en distancia/segundo
		this.MAXACCEL = 2/radius;
		this.posX = posX;
		this.posZ = posZ;
        this.position.set(this.posX, 0, this.posZ);
		this.radius = radius;
		
		this.speed = new THREE.Vector2(posX,posZ).normalize().multiplyScalar(this.MAXSPEED).negate();
	}

	update () {
		super.update()
	}
	
	collide(obj) { //Realiza la colisión con un objeto. Devuelve TRUE si se ha de borrar debido a esa colisión, FALSE si no
		console.log("collided " + this.health);
		if(obj instanceof Projectile) {
			this.health -= obj.damage;
		}
		return (this.health <= 0);
	}

}
