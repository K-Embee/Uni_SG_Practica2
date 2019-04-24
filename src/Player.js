class Player extends Movable {
	constructor() {
		super();

		this.geometry = new THREE.BoxGeometry (1,1,1);
		this.material = new THREE.MeshPhongMaterial({color: 0xff0000});
		this.active_weapon = new ProjectleGenerator(this);
		this.thrust = Array(4).fill(false);

		this.MAXSPEED = 20; //Velocidades en distancia/segundo
		this.MAXACCEL = 0.5;
		this.FRICTION = 0.1;
		this.posX = 0.0;
		this.posZ = 0.0;
		this.speedX = 0;
		this.speedZ = 0;
		this.accelX = 0;
		this.accelZ = 0;
	}

	onKeyPress(event) {
		if(event.key == 'S' || event.key == 's') {
			this.accelZ = this.MAXACCEL;
			this.thrust[Player.KEYPRESS_DOWN] = true;
		}
		else if(event.key == 'W' || event.key == 'w') {
			this.accelZ = -this.MAXACCEL;
			this.thrust[Player.KEYPRESS_UP] = true;
		}
		else if(event.key == 'A' || event.key == 'a') {
			this.accelX = -this.MAXACCEL;
			this.thrust[Player.KEYPRESS_LEFT] = true;
		}
		else if(event.key == 'D' || event.key == 'd') {
			this.accelX = this.MAXACCEL;
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

	update () {

		this.updateMove();
		this.position.set(this.posX, 0, this.posZ);
		this.lookAt(mouse3D);
	}


	updateMove(){

		//Prevenir el bug de la aceleración diagonal
		/*var accelVector = new THREE.Vector2(this.accelX, this.accelZ);
		if(accelVector.length() > this.MAXACCEL){
			accelVector.normalize();
			accelVector.multiplyScalar(this.MAXACCEL);
		}
		this.accelX = accelVector.x;
		this.accelZ = accelVector.y;*/

		//Si hay velocidad pero no se esta manteniendo una tecla pulsada...
		if(!this.thrust[Player.KEYPRESS_LEFT] && !this.thrust[Player.KEYPRESS_RIGHT] && this.speedX != 0){
			this.accelX = (this.speedX < 0) ? (this.FRICTION) : (-this.FRICTION);
		}
		if(!this.thrust[Player.KEYPRESS_UP] && !this.thrust[Player.KEYPRESS_DOWN] && this.speedZ != 0){
			this.accelZ = (this.speedZ < 0) ? (this.FRICTION) : (-this.FRICTION);
		}

		//Acelerar
		this.speedX += this.accelX;
		this.speedZ += this.accelZ;

		this.speedX = clamp (-this.MAXSPEED, this.speedX, this.MAXSPEED);
		this.speedZ = clamp (-this.MAXSPEED, this.speedZ, this.MAXSPEED);

		//Prevenir el bug de la aceleración diagonal
/*		var speedVector = new THREE.Vector2(this.speedX, this.speedZ);
		if(speedVector.length() > this.MAXSPEED){
			speedVector.normalize();
			speedVector.multiplyScalar(this.MAXSPEED);
		}
		this.speedX = speedVector.x;
		this.speedZ = speedVector.y;*/

		this.posX += (this.speedX*(gameTime-gameTime_prev))/1000;
		this.posZ += (this.speedZ*(gameTime-gameTime_prev))/1000;
	}

}

Player.KEYPRESS_UP = 0;
Player.KEYPRESS_DOWN = 1;
Player.KEYPRESS_LEFT = 2;
Player.KEYPRESS_RIGHT = 3;
