class PowerUp extends Movable {
	constructor(posX, posZ) {
		super();

		//this.geometry = new THREE.SphereGeometry (radius,8,8);
		//this.material = new THREE.MeshToonMaterial({color: color_brown});

		this.MAXSPEED = 5; //Velocidades en distancia/segundo
		this.MAXACCEL = 2;
		this.posX = posX;
		this.posZ = posZ;
        this.position.set(this.posX, 0, this.posZ);
		this.radius = 0.5;
		this.variance = THREE.Math.degToRad(90); //Varianza en el angulo con el que aparece
		rsc.getProjectile(this, radius, color_lightblue);

        this.speed = new THREE.Vector2(posX,posZ).normalize().multiplyScalar(this.MAXSPEED).negate();
		this.speed.rotateAround(new THREE.Vector2(0,0),Math.random()*this.variance-this.variance/2);
	}

	collide(obj) {
		if(obj instanceof Player) {
			obj.health = obj.MAXHEALTH;
		}
		return (obj instanceof Player);
	}
}
