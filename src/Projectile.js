
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

    update() {
        if(this.firing && this.last_shot + this.cooldown < gameTime ) {
            this.generate();
            this.last_shot = gameTime;
        }
    }

    generate() {
        new Projectile(this.parent_object.position,mouse3D,this.projectile_speed,this.color);
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

    generate() {
        for(var i = 0; i < this.pellets; i++){
            var angle = this.spread_angle*(i/(this.pellets-1))-this.spread_angle/2.0;
            new Projectile_SPREAD(this.parent_object.position,mouse3D,this.projectile_speed,this.color,angle);
        }
    }
}

class ProjectileGenerator_RAPIDFIRE extends ProjectileGenerator {
    constructor(parent){
        super(parent);
        this.cooldown = 150;
        this.projectile_speed = 70;
        this.damage = this.damage/3
    }

    generate() {
        new Projectile_RAPIDFIRE(this.parent_object.position,mouse3D,this.projectile_speed,this.color);
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

    generate() {
        new Projectile_HOMING(this.parent_object.position,mouse3D,this.projectile_speed,this.color);
    }
}

class Projectile extends Movable {
    constructor(origin, destination, scalar_speed, color) {
        super();
        //this.light = new THREE.PointLight(color, 10, 1, 1);
        this.geometry = new THREE.SphereGeometry(0.5, 5, 5);
        this.material = new THREE.MeshLambertMaterial({ color: color, emissive: color });
        this.position.copy(origin);
        this.posX = origin.x;
        this.posZ = origin.z;
        this.speed = new THREE.Vector2(destination.x,destination.z).sub(new THREE.Vector2(origin.x,origin.z));
        this.speed.normalize().multiplyScalar(scalar_speed);

        this.MAXSPEED = scalar_speed;
        //this.hitbox = new Hitbox(0.5, this);

        //this.light.position.copy(this.position);
        //this.add(this.light);
        scene.add(this);
        scene.projectiles.push(this);
    }

    update() {
        super.update();
    }

    OOBCheck() {
        if(Math.abs(this.position.x) > 200 || Math.abs(this.position.z) > 200) {
            this.dispose();
            return true;
        }
        return false;
    }

    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

class Projectile_SPREAD extends Projectile {
    constructor(origin, destination, scalar_speed, color, spread_angle) {
        super(origin, destination, scalar_speed, color);
        var axis = new THREE.Vector3(0,1,0);
        var speed3D = new THREE.Vector3(this.speed.x,0,this.speed.y);
        speed3D.applyAxisAngle(axis, THREE.Math.degToRad(spread_angle));
        this.speed.set(speed3D.x,speed3D.z);
    }
}
class Projectile_RAPIDFIRE extends Projectile {
    constructor(origin, destination, scalar_speed, color, spread_angle) {
        super(origin, destination, scalar_speed, color);
        this.inaccuracy = 10;
        var axis = new THREE.Vector3(0,1,0);
        var speed3D = new THREE.Vector3(this.speed.x,0,this.speed.y);
        speed3D.applyAxisAngle(axis, THREE.Math.degToRad(Math.random()*this.inaccuracy-this.inaccuracy/2));
        this.speed.set(speed3D.x,speed3D.z);
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
