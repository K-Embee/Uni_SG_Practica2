var gameTime = 0 //null; //cambiar por esto si se quiere usar la fecha en vez de diferencia de frames/seg
var gameTime_prev = null;
var frameRate = 1/60.0; //Velocidad de three.js

var mouse = null;
var mouse3D = null;

var color_gold = 0xffd700
var color_goldenrod = 0xdaa520;
var color_brown = 0x654321;
var color_darkpurple = 0x800080;
var color_pink = 0xff00ff;
var color_brightgreen = 0x50ff50;

//Devuelve la diff de tiempo entre este frame y el anterior
function timeSinceLastFrame(){
	return (gameTime-gameTime_prev)/1000.0;
}

class Game extends THREE.Scene {
	constructor (unRenderer) {
		super();

		this.createLights ();
		this.createCamera (unRenderer);
		this.createGround ();
		this.updatables = Array();

		this.axis = new THREE.AxesHelper (5);
		this.add (this.axis);

		/*this.model = new Player();
		this.add (this.model);
		this.updatables.push(this.model);

		this.ast = new Asteroid(4, 10, 10);
		this.add(this.ast);
		this.updatables.push(this.ast);

		this.ast2 = new Asteroid(6, -10, -10);
		this.add(this.ast2);
		this.updatables.push(this.ast2);*/

		this.gameHandler = new GameHandler();

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
		ground.geometry = new THREE.BoxGeometry (100,0.2,50);
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

	onMouseMove(event) {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = 1 - 2 * (event.clientY / window.innerHeight);
	}

	onKeyPress(event) {
		this.model.onKeyPress(event);
	}

	onKeyDown(event) {
		this.model.onKeyDown(event);
	}

	onKeyUp(event) {
		this.model.onKeyUp(event);
	}

	onMouseDown(event) {
		this.model.onMouseDown(event);
	}
	onMouseUp(event) {
		this.model.onMouseUp(event);
	}

	update () {
		if(!this.model) {
			this.gameHandler.spawnPlayer();
			//this.gameHandler.spawnAsteroids();
			//this.gameHandler.spawnAsteroids();
			//this.gameHandler.spawnHostiles();
		}
		this.gameHandler.update();
		gameTime_prev = gameTime;
		gameTime = gameTime+1000*frameRate //Date.now(); //ver linea 1

		var raycaster = new  THREE.Raycaster();
		raycaster.setFromCamera (mouse, scene.camera);
		var pickedObjects = raycaster.intersectObject(scene.ground, false);
		if(pickedObjects.length > 0) {
			mouse3D = ( pickedObjects[0].point );
		}

		for(var i = 0; i < this.updatables.length; i++) {
			this.updatables[i].update();
		}

		//Dereferencia proyectiles fuera de juego
		for(var i = this.updatables.length-1; i >= 0; i--) {
			this.updatables[i].update();
			if(this.updatables[i].OOBCheck()){
				this.remove(this.updatables[i]);
				this.updatables.splice(i,1);
			}
		}

		var objs_2_del = Array();

		//Detección de colisiones
		for(var i = 0; i < this.updatables.length; i++) {
			let del_obj = false;
			for(var j = 0; j < this.updatables.length; j++) {
				if(i == j) continue;
				del_obj = (del_obj) ? del_obj : this.updatables[i].checkCollision(this.updatables[j]);
			}
			if(del_obj) objs_2_del.push(i);
		}

		//Borrar objetos destruidos mediante colisión
		for(var i = objs_2_del.length-1; i >= 0; i--) {
			this.updatables[objs_2_del[i]].dispose();
			this.remove(this.updatables[objs_2_del[i]]);
			this.updatables.splice(objs_2_del[i],1);
		}

		//Debugging
		if(!this.debugLogGameTime) this.debugLogGameTime = 0;
		if(gameTime > 10000+this.debugLogGameTime) {
			this.debugLogGameTime = gameTime;
			console.log(this.updatables);
		}
	}
}
