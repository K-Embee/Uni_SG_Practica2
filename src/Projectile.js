
class ProjectileGenerator {
    constructor(parent){
        this.cooldown = 500;
        this.last_shot = gameTime;
        this.parent_object = parent;
        this.projectile_speed = 40;
        this.color = color_goldenrod;
        this.firing = false;
        this.damage = 30
    }

    onMouseDown(event) {
        if(event.button == 0) {
            this.firing = true;
        }
    }

    onMouseUp(event) {
        if(event.button == 0) {
            this.firing = false;
        }
    }

    update(target) {
        if(this.firing && this.last_shot + this.cooldown < gameTime ) {
            this.generate(target);
            this.last_shot = gameTime;
        }
    }

    generate(target) {
        var projectile = new Projectile(this.parent_object, this.parent_object.position,target,this.projectile_speed,this.color);
		projectile.damage = this.damage;
		return projectile;
    }
}

class ProjectileGenerator_SPREAD extends ProjectileGenerator {
    constructor(parent){
        super(parent);
        this.cooldown = 750;
        this.projectile_speed = 40;
        this.pellets = 5
        this.spread_angle = 45;
    }

    generate(target) {
        for(var i = 0; i < this.pellets; i++){
            var projectile = super.generate(target);
            var angle = this.spread_angle*(i/(this.pellets-1))-this.spread_angle/2.0;
            var axis = new THREE.Vector3(0,1,0);
		    var speed3D = new THREE.Vector3(projectile.speed.x,0,projectile.speed.y);
		    speed3D.applyAxisAngle(axis, THREE.Math.degToRad(angle));
		    projectile.speed.set(speed3D.x,speed3D.z);
        }
    }
}

class ProjectileGenerator_RAPIDFIRE extends ProjectileGenerator {
    constructor(parent){
        super(parent);
        this.cooldown = 150;
        this.projectile_speed = 70;
        this.damage = this.damage/3
        this.inaccuracy = 10;
    }

    generate(target) {
        var projectile = super.generate(target);
        var axis = new THREE.Vector3(0,1,0);
        var speed3D = new THREE.Vector3(projectile.speed.x,0,projectile.speed.y);
        speed3D.applyAxisAngle(axis, THREE.Math.degToRad(Math.random()*this.inaccuracy-this.inaccuracy/2));
        projectile.speed.set(speed3D.x,speed3D.z);
    }
}

class ProjectileGenerator_HOMING extends ProjectileGenerator {
    constructor(parent){
        super(parent);
        this.color = color_darkpurple;
        this.cooldown = 800;
        this.projectile_speed = 20;
        this.damage = this.damage*3
    }

    generate(target) {
        new Projectile_HOMING(this.parent_object, this.parent_object.position,target,this.projectile_speed,this.color);
    }
}

class ProjectileGeneratorEnemy extends ProjectileGenerator {
    constructor(parent){
		super(parent);
		this.firing = true;
        this.color = color_brightgreen;
    }

    onMouseDown(event) {
    }

    onMouseUp(event) {
    }

	
}

class Projectile extends Movable {
    constructor(parent, origin, destination, scalar_speed, color) {
        super();
        //this.light = new THREE.PointLight(color, 10, 1, 1);
		this.parent_object = parent;
        this.geometry = new THREE.SphereGeometry(0.5, 5, 5);
        this.material = new THREE.MeshLambertMaterial({ color: color, emissive: color });
        this.position.copy(origin);
        this.posX = origin.x;
        this.posZ = origin.z;
        this.speed = new THREE.Vector2(destination.x,destination.z).sub(new THREE.Vector2(origin.x,origin.z));
        this.speed.normalize().multiplyScalar(scalar_speed);
        this.damage = 0;

        this.MAXSPEED = scalar_speed;
        //this.hitbox = new Hitbox(0.5, this);

        //this.light.position.copy(this.position);
        //this.add(this.light);
        scene.add(this);
    }

    update() {
        super.update();
    }

    OOBCheck() {
        if(Math.abs(this.position.x) > 40 || Math.abs(this.position.z) > 40) {
            this.dispose();
            return true;
        }
        return false;
    }

    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }


	collide(obj) {
		if(obj instanceof Asteroid) {
			return true;
		}
		if((obj instanceof Player || obj instanceof Enemy) && this.parent_object != obj) {
			return true;
		}
		return false;
	}
}

class Projectile_HOMING extends Projectile {
    constructor(origin, destination, scalar_speed, color, spread_angle) {
        super(origin, destination, scalar_speed, color);
        this.spawn_time = gameTime;
        this.MAXACCEL = 30;
        this.CONSTANT_SPEED = true;
    }

    update() {
        var accel3D = new THREE.Vector3(0,0,0);
        accel3D.subVectors(mouse3D,this.position);
        this.accel = new THREE.Vector2(accel3D.x,accel3D.z).normalize().multiplyScalar(this.MAXACCEL);
        super.update();
    }

    OOBCheck() {
        if(gameTime > 5000 + this.spawn_time) {
            this.dispose();
            return true;
        }
        super.OOBCheck();
    }
}
