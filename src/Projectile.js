var color_gold = 0xffd700
var color_goldenrod = 0xdaa520;

class ProjectleGenerator {
    constructor(parent){
        this.cooldown = 500;
        this.last_shot = gameTime;
        this.parent_object = parent;
        this.projectile_speed = 40;
        this.color = color_goldenrod;
    }

    onMouseDown(event) {
        if(event.button == 0 && this.last_shot + this.cooldown < gameTime ) {
            this.generate();
            this.last_shot = gameTime;
        }
    }

    generate() {
        var worldpos = new THREE.Vector3();
        new Projectile(this.parent_object.position,mouse3D,this.projectile_speed,this.color);
    }
}

class Projectile extends THREE.Mesh {
    constructor(origin, destination, speed, color) {
        super();
        //this.light = new THREE.PointLight(color, 10, 1, 1);
        this.geometry = new THREE.SphereGeometry(0.5, 5, 5);
        this.material = new THREE.MeshLambertMaterial({ color: color, emissive: color });
        this.position.copy(origin);
        this.vector = destination.sub(origin);
        this.vector.normalize();
        this.speed = speed;

        //this.light.position.copy(this.position);
        //this.add(this.light);
        scene.add(this);
        scene.projectiles.push(this);
    }

    update() {
        var x = this.position.x + (this.vector.x * this.speed * (gameTime-gameTime_prev)/1000);
        var z = this.position.z + (this.vector.z * this.speed * (gameTime-gameTime_prev)/1000);
        this.position.set(x,0,z);
    }

    OOBCheck() {
        if(Math.abs(this.position.x) > 200 || Math.abs(this.position.z) > 200) {
            this.geometry.dispose();
            this.material.dispose();
            return true;
        }
        return false;
    }
}
