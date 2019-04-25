var gameTime = null;
var gameTime_prev = null;

var mouse = null;
var mouse3D = null;

class Game extends THREE.Scene {
	constructor (unRenderer) {
		super();

		this.createLights ();
		this.createCamera (unRenderer);
		this.createGround ();
		this.projectiles = Array();

		this.axis = new THREE.AxesHelper (5);
		this.add (this.axis);

		this.model = new Player();
		this.add (this.model);

		gameTime = Date.now();
		mouse = new THREE.Vector2();
		mouse3D = new THREE.Vector3();
	}

	createCamera (unRenderer) {
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.set (0, 30, 20);
		var look = new THREE.Vector3 (0,0,0);
		this.camera.lookAt(look);
		this.add (this.camera);
  }

	createGround () {
		var ground = new THREE.Mesh ();
		ground.geometry = new THREE.BoxGeometry (50,0.2,50);
		ground.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0,-0.1,0));
		var texture = new THREE.TextureLoader().load('media/wood.jpg');
		ground.material = new THREE.MeshPhongMaterial ({map: texture, opacity: 0.4, transparent: true});
		this.ground = ground;
		this.add (ground);
	}

	createLights () {
		var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
		this.add (ambientLight);

		this.spotLight = new THREE.SpotLight( 0xffffff, 0.5 );
		this.spotLight.position.set( 60, 60, 40 );
		this.add (this.spotLight);
	}

	getCamera () {
		return this.camera;
	}

	setCameraAspect (ratio) {
		this.camera.aspect = ratio;
		this.camera.updateProjectionMatrix();
	}

	onMouseMove() {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = 1 - 2 * (event.clientY / window.innerHeight);
	}

	onKeyPress(event) {
		this.model.onKeyPress(event);
	}

	onKeyUp(event) {
		this.model.onKeyUp(event);
		if(event.key == 'z') {
			console.log("==========DEBUG INFORMATION==========");
			console.log("Projectiles:" + this.projectiles.length);
		}
	}

	onMouseDown(event) {
		this.model.onMouseDown(event);
	}
	onMouseUp(event) {
		this.model.onMouseUp(event);
	}

	update () {
		gameTime_prev = gameTime;
		gameTime = Date.now();

		var raycaster = new  THREE.Raycaster();
		raycaster.setFromCamera (mouse, scene.camera);
		var pickedObjects = raycaster.intersectObject(scene.ground, false);
		if(pickedObjects.length > 0) {
			mouse3D = ( pickedObjects[0].point );
		}

		this.model.update();

		//Dereferencia proyectiles fuera de juego
		for(var i = 0; i < this.projectiles.length; i++) {
			this.projectiles[i].update();
			while(i < this.projectiles.length && this.projectiles[i].OOBCheck()){
				this.projectiles.splice(i,1);
			}
		}
	}
}
