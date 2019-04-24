var gameTime = null;
var gameTime_prev = null;

var mouse = null;

class Game extends THREE.Scene {
	constructor (unRenderer) {
		super();
		// Construimos los distinos elementos que tendremos en la escena

		// Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
		// Tras crear cada elemento se añadirá a la escena con   this.add(variable)
		this.createLights ();

		// Tendremos una cámara con un control de movimiento con el ratón
		this.createCamera (unRenderer);

		// Un suelo
		this.createGround ();

		// Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
		this.axis = new THREE.AxesHelper (5);
		this.add (this.axis);

		// Por último creamos la caja del ejemplo, como una instancia de una clase propia, que gestionará su creación y la interacción con la misma
		this.model = new Player();
		this.add (this.model);
		gameTime = Date.now();
		mouse = new THREE.Vector2();
	}

	createCamera (unRenderer) {
		// Para crear una cámara le indicamos
		//   El ángulo del campo de visión en grados sexagesimales
		//   La razón de aspecto ancho/alto
		//   Los planos de recorte cercano y lejano
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		// También se indica dónde se coloca
		this.camera.position.set (0, 30, 20);
		// Y hacia dónde mira
		var look = new THREE.Vector3 (0,0,0);
		this.camera.lookAt(look);
		this.add (this.camera);

		// Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
		//BORRADO
  }

	createGround () {
		// Una figura es un Mesh
		var ground = new THREE.Mesh ();
		// Un Mesh se compone de geometría y material
		ground.geometry = new THREE.BoxGeometry (50,0.2,50);
		// Las primitivas básicas se crean centradas en el origen
		// Se puede modificar su posición con respecto al sistema de coordenadas local con una transformación aplicada directamente a la geometría.
		ground.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0,-0.1,0));
		// Como material se crea uno a partir de una textura
		var texture = new THREE.TextureLoader().load('media/wood.jpg');
		ground.material = new THREE.MeshPhongMaterial ({map: texture, opacity: 0.4, transparent: true});
		// Por último se añade el suelo a la escena
		this.ground = ground;
		this.add (ground);
	}

	createLights () {
		// Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
		// La luz ambiental solo tiene un color y una intensidad
		// Se declara como   var   y va a ser una variable local a este método
		//    se hace así puesto que no va a ser accedida desde otros métodos
		var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
		// La añadimos a la escena
		this.add (ambientLight);

		// Se crea una luz focal que va a ser la luz principal de la escena
		// La luz focal, además tiene una posición, y un punto de mira
		// Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
		// En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
		this.spotLight = new THREE.SpotLight( 0xffffff, 1 );
		this.spotLight.position.set( 60, 60, 40 );
		this.add (this.spotLight);
	}

	getCamera () {
		// En principio se devuelve la única cámara que tenemos
		// Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
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
	}

	update () {
		// Se actualiza el resto del modelo
		gameTime_prev = gameTime;
		gameTime = Date.now();

		this.model.update(this.camera, this.ground)
	}
}
