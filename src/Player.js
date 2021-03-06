class Player extends Movable {
	constructor() {
		super();

		this.geometry = new THREE.BoxGeometry (1,1,1);
		this.material = new THREE.MeshPhongMaterial({color: 0xff0000});
		this.weapons = [
			new ProjectileGenerator_CHARGE(this),
			new ProjectileGenerator_SPREAD(this),
			new ProjectileGenerator_RAPIDFIRE(this),
			new ProjectileGenerator_HOMING(this)
		];
		this.active_weapon = this.weapons[0];
		this.last_weapon_switch = 0;
		this.thrust = Array(4).fill(false);

		this.last_health = this.health;

		this.WEAPON_SWITCH_COOLDOWN = 500 //Tiempo en milisegundos entre poder cambiar de arma

		this.MAXSPEED = 20; //Velocidades en distancia/segundo
		this.MAXACCEL = 30; //Aceleración en distancia/segundo^2
		this.FRICTION = 300; //Velocidad que se resta por segundo mientras no se acelera
		this.radius = 0.5;
	}

	onKeyDown(event) {
		if(gameTime < this.last_weapon_switch + 500) return;
		if(event.key == 1) {
			this.last_weapon_switch = gameTime;
			this.active_weapon = this.weapons[Player.KEYPRESS_1];
			this.active_weapon.chargeStart = gameTime;
		}
		else if(event.key == 2) {
			this.last_weapon_switch = gameTime;
			this.active_weapon = this.weapons[Player.KEYPRESS_2];
		}
		else if(event.key == 3) {
			this.last_weapon_switch = gameTime;
			this.active_weapon = this.weapons[Player.KEYPRESS_3];
		}
		else if(event.key == 4) {
			this.last_weapon_switch = gameTime;
			this.active_weapon = this.weapons[Player.KEYPRESS_4];
		}
	}
	onKeyPress(event) {
		if(event.key == 'S' || event.key == 's') {
			this.thrust[Player.KEYPRESS_DOWN] = true;
		}
		else if(event.key == 'W' || event.key == 'w') {
			this.thrust[Player.KEYPRESS_UP] = true;
		}
		else if(event.key == 'A' || event.key == 'a') {
			this.thrust[Player.KEYPRESS_LEFT] = true;
		}
		else if(event.key == 'D' || event.key == 'd') {
			this.thrust[Player.KEYPRESS_RIGHT] = true;
		}
	}
	onKeyUp(event) {
		if(event.key == 'S' || event.key == 's') {
			this.thrust[Player.KEYPRESS_DOWN] = false;
		}
		else if(event.key == 'W' || event.key == 'w') {
			this.thrust[Player.KEYPRESS_UP] = false;
		}
		else if(event.key == 'A' || event.key == 'a') {
			this.thrust[Player.KEYPRESS_LEFT] = false;
		}
		else if(event.key == 'D' || event.key == 'd') {
			this.thrust[Player.KEYPRESS_RIGHT] = false;
		}
	}
	onMouseDown(event) {
		this.active_weapon.onMouseDown(event);
	}
	onMouseUp(event) {
		this.active_weapon.onMouseUp(event);
	}

	update () {
		super.update();
		this.lookAt(mouse3D);
		this.active_weapon.update(mouse3D);
	}


	updateMove(){

		var thrusting = false;

		if(gamepad == null) {
			this.accel = new THREE.Vector2(	(this.thrust[Player.KEYPRESS_LEFT])?-this.MAXACCEL:0 + (this.thrust[Player.KEYPRESS_RIGHT])?this.MAXACCEL:0,
				(this.thrust[Player.KEYPRESS_UP])?-this.MAXACCEL:0 + (this.thrust[Player.KEYPRESS_DOWN])?this.MAXACCEL:0 );

			for(let i = 0; i < this.thrust.length; i++) {
				if(this.thrust[i] == true) { thrusting = true; break; }
			}
		}
		else {
			this.accel = new THREE.Vector2( (gamepadinfo.axes[0] - this.speed.x/this.MAXSPEED)*this.MAXACCEL,
				(gamepadinfo.axes[1] - this.speed.y/this.MAXSPEED)*this.MAXACCEL );
			thrusting = (Math.abs(gamepadinfo.axes[0]) > 0.2 || Math.abs(gamepadinfo.axes[1]) > 0.2);
		}

		if(!thrusting && (Math.abs(this.speed.x) > 1 || Math.abs(this.speed.y) > 1)){
			this.accel.copy(this.speed.clone().normalize().multiplyScalar(this.FRICTION*timeSinceLastFrame()).negate());
		}
		else if(!thrusting && Math.abs(this.speed.x) <= 1 && Math.abs(this.speed.y) <= 1) { this.speed.x = 0; this.speed.y = 0; this.accel.x = 0; this.accel.y = 0; }

		super.updateMove();
	}

	collide(obj) {
		if(obj instanceof Projectile && obj.parent_object != this) {
			this.health -= obj.damage;
		}

		if(obj instanceof Asteroid) {
			this.health -= 10;
			super.asteroidBounce(obj);
		}

		return (this.health <= 0);
	}

}

Player.KEYPRESS_UP		= Player.KEYPRESS_1	= 0;
Player.KEYPRESS_DOWN	= Player.KEYPRESS_2 = 1;
Player.KEYPRESS_LEFT	= Player.KEYPRESS_3 = 2;
Player.KEYPRESS_RIGHT	= Player.KEYPRESS_4 = 3;
