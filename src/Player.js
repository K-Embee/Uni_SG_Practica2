class Player extends Movable {
	constructor() {
		super();

		this.geometry = new THREE.BoxGeometry (1,1,1);
		this.material = new THREE.MeshPhongMaterial({color: 0xff0000});
		this.active_weapon = new ProjectileGenerator_HOMING(this);
		this.thrust = Array(4).fill(false);

		this.MAXSPEED = 20; //Velocidades en distancia/segundo
		this.MAXACCEL = 30; //Aceleración en distancia/segundo^2
		this.FRICTION = 300; //Velocidad que se resta por segundo mientras no se acelera
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
		this.active_weapon.update();
	}


	updateMove(){

		this.accel = new THREE.Vector2(	(this.thrust[Player.KEYPRESS_LEFT])?-this.MAXACCEL:0 + (this.thrust[Player.KEYPRESS_RIGHT])?this.MAXACCEL:0,
				(this.thrust[Player.KEYPRESS_UP])?-this.MAXACCEL:0 + (this.thrust[Player.KEYPRESS_DOWN])?this.MAXACCEL:0 );

		var thrusting = false;
		for(let i = 0; i < this.thrust.length; i++) {
			if(this.thrust[i] == true) { thrusting = true; break; }
		}
		if(!thrusting && this.speed.x != 0 && this.speed.y != 0){
			this.accel.copy(this.speed.clone().normalize().multiplyScalar(this.FRICTION*timeSinceLastFrame()).negate());
		}

		super.updateMove();
	}

}

Player.KEYPRESS_UP = 0;
Player.KEYPRESS_DOWN = 1;
Player.KEYPRESS_LEFT = 2;
Player.KEYPRESS_RIGHT = 3;
