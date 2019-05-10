class Asteroid extends Movable {
	constructor(radius, posX, posZ, oldSpeed) {
		super();

		this.geometry = new THREE.SphereGeometry (radius,8,8);
		this.material = new THREE.MeshToonMaterial({color: color_brown});

		this.MAXSPEED = 20/radius; //Velocidades en distancia/segundo
		this.MAXACCEL = 2/radius;
		this.posX = posX;
		this.posZ = posZ;
        this.position.set(this.posX, 0, this.posZ);
		this.radius = radius;
		this.health = 20*radius;
		this.variance = THREE.Math.degToRad(90); //Varianza en el angulo con el que aparece
		this.collision_immune = Array(); //Ignores asteroids that it spawns alongside

		if(!oldSpeed) this.speed = new THREE.Vector2(posX,posZ).normalize().multiplyScalar(this.MAXSPEED).negate();
		else this.speed = oldSpeed.clone();

		this.speed.rotateAround(new THREE.Vector2(0,0),Math.random()*this.variance-this.variance/2);
	}

	checkCollision(obj){ //Ignores asteroids that it spawns alongside
		if(this.collision_immune) {
			for(var i = 0; i < this.collision_immune.length; i++) {
				if(this.collision_immune[i] == obj) {
					if(this.radius + obj.radius <= this.position.distanceTo(obj.position)) {
						this.collision_immune.splice(i,1);
						break;
					}
					return false;
				}
			}
		}
		return super.checkCollision(obj);
	}

	collide(obj) {
		if(obj instanceof Projectile) {
			this.health -= obj.damage;
		}
		if(obj instanceof Asteroid) {
			super.asteroidBounce(obj);
		}
		return (this.health <= 0);
	}

	dispose(force) {
		if(!force && this.health <= 0 && this.radius >= 3 && Math.random() < this.radius*0.2 ) {
			let loops = Math.random();
			loops = (loops < 0.10) ? 3 : ((loops < 0.70) ? 2 : 1); //Si se subdivide, 30% => 1 60% => 2 10% => 3
			let ast = Array();
			for(var i = 0; i < loops; i++) {
				ast[i] = new Asteroid(this.radius/2+Math.random(), this.posX, this.posZ, this.speed);
				scene.add(ast[i]);
			}
			for(var i = 0; i < loops; i++) {
				for(var j = 0; j < loops; j++) {
					ast[i].collision_immune.push(ast[j]);
				}
			}
		}
		super.dispose();
	}

}
