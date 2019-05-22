class Enemy extends Movable {
	constructor(posX, posZ) {
		super();

		this.geometry = new THREE.BoxGeometry (2,1,2);
		this.material = new THREE.MeshPhongMaterial({color: 0x00ff00});

		this.MAXSPEED = 15; //Velocidades en distancia/segundo
		this.MAXACCEL = 5;
		this.posX = posX;
		this.posZ = posZ;
        this.position.set(this.posX, 0, this.posZ);
		this.radius = 1;
		this.health = 35;
		this.weapon = new ProjectileGeneratorEnemy(this);

		this.speed = new THREE.Vector2(posX,posZ).normalize().multiplyScalar(this.MAXSPEED).negate();
	}

	update(){
		if(!scene.model) return;
		super.update();
		this.weapon.update(scene.model.position);
		this.lookAt(scene.model.position);
	}

	updateMove () {
		var accel3D = new THREE.Vector3(0,0,0);
		accel3D.subVectors(scene.model.position, this.position).setLength(this.MAXACCEL);
		this.accel.x = accel3D.x; this.accel.y = accel3D.z;
		super.updateMove()
	}

	collide(obj) {
		if(obj instanceof Projectile && obj.parent_object != this) {
			this.health -= obj.damage;
		}
		if(obj instanceof Asteroid) {
			super.asteroidBounce(obj);
		}
		return (this.health <= 0);
	}

	dispose() {
		score += 1000;
		super.dispose();
	}
}
