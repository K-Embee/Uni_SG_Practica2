class Enemy extends Movable {
	constructor(posX, posZ) {
		super();

		this.geometry = new THREE.BoxGeometry (1,1,1);
		this.material = new THREE.MeshPhongMaterial({color: 0x00ff00});

		this.MAXSPEED = 15; //Velocidades en distancia/segundo
		this.MAXACCEL = 10;
		this.posX = posX;
		this.posZ = posZ;
        this.position.set(this.posX, 0, this.posZ);
		this.radius = 0.5;
		this.health = 75;
		this.weapon = new ProjectileGeneratorEnemy(this);
		
		this.speed = new THREE.Vector2(posX,posZ).normalize().multiplyScalar(this.MAXSPEED).negate();
	}

	update(){
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
		console.log("health: " + this.health);
		return (this.health <= 0);
	}

}
