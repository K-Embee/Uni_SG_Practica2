
/// La escena que tendrá todo lo que se tiene en cuenta al hacer un render
//  Lo que no esté incluido en la escena no será procesado por el renderer
scene = null;

/// La variable que referenciará al renderer
renderer = null;

/// El objeto que referencia a la interfaz gráfica de usuario
gui = null;

// El objeto de gestor de recursos
rsc = null;

/// Se crea y configura un renderer WebGL
/**
 * El renderer recorrerá el grafo de escena para procesarlo y crear la imagen resultante.
 * Debe hacer este trabajo para cada frame.
 * Si se cambia el grafo de escena después de visualizar un frame, los cambios se verán en el siguiente frame.
 *
 * @return El renderer
 */
function createRenderer () {
  var renderer = new THREE.WebGLRenderer();
  // Se establece un color de fondo en las imágenes que genera el render
  renderer.setClearColor(new THREE.Color(0x080808), 1.0);

  // Se establece el tamaño, se aprovoche la totalidad de la ventana del navegador
  renderer.setSize(window.innerWidth, window.innerHeight);

  return renderer;
}

/// Función que se encarga de renderizar un frame
/**
 * Se renderiza la escena, captada por una cámara.
 */
function render() {
  // Se solicita que La próxima vez que haya que refrescar la ventana se ejecute una determinada función, en este caso la funcion render.
  // La propia función render es la que indica que quiere ejecutarse la proxima vez
  // Por tanto, esta instrucción es la que hace posible que la función  render  se ejecute continuamente y por tanto podamos crear imágenes que tengan en cuenta los cambios que se la hayan hecho a la escena después de un render.
  requestAnimationFrame(render);

  // Se le pide a la escena que se actualice antes de ser renderizada
  scene.update();

  // Por último, se le pide al renderer que renderice la escena que capta una determinada cámara, que nos la proporciona la propia escena.
  renderer.render(scene, scene.getCamera());
}

/// Función que actualiza la razón de aspecto de la cámara y el tamaño de la imagen que genera el renderer en función del tamaño que tenga la ventana
function onWindowResize () {
  /*scene.setCameraAspect (window.innerWidth / window.innerHeight);
  renderer.setSize (window.innerWidth, window.innerHeight);*/
  var HORIZ = 21;
  var VERT = 9;
  console.log(window.innerWidth, window.innerHeight);
  scene.setCameraAspect (HORIZ / VERT);
  if(window.innerWidth > window.innerHeight*HORIZ/VERT) {
      renderer.setSize (window.innerHeight*HORIZ/VERT, window.innerHeight);
  }
  else {
      renderer.setSize (window.innerWidth, window.innerWidth*VERT/HORIZ);
  }
  renderer_width = renderer.getSize().width;
  renderer_height = renderer.getSize().height;
}

function start() {
	startTime = gameTime;
	document.getElementsByClassName("container")[0].style.display = "none";
    document.getElementById("hp").style.display = "block";
    document.getElementById("hp").style.width = "100px";
    scene.unload();
    score = 0;
    started = true;
}

function end(){
    started = false;
    scene.model = null;
    document.getElementsByClassName("container")[0].style.display = "block";
    document.getElementsByTagName("H1")[0].innerHTML = "Game Over";
    document.getElementsByTagName("H2")[0].innerHTML = "Pulse aqui para reiniciar";
    document.getElementById("hp").style.display = "none";
    console.log("end");
}

function onMouseMove(event) {
    scene.onMouseMove(event);
}

function onKeyPress(event) {
    scene.onKeyPress(event);
}

function onKeyDown(event) {
    scene.onKeyDown(event)
}

function onKeyUp(event) {
    scene.onKeyUp(event)
}

function onMouseDown(event) {
    scene.onMouseDown(event);
}

function onMouseUp(event) {
    scene.onMouseUp(event);
}

function gamePadConnected(event) {
    gamepad = event.gamepad.index;
    gamepadinfo = navigator.getGamepads()[gamepad];
}

function gamePadDisconnected(event) {
    gamepad = null;
    gamepadinfo = null;
}

function unload() {
    scene.unload();
    rsc.unload();
}

/// La función principal
$(function () {
  // Se crea el renderer
  renderer = createRenderer();

  // La salida del renderer se muestra en un DIV de la página index.html
  $("#WebGL-output").append(renderer.domElement);

  // listeners
  // Cada vez que el usuario cambie el tamaño de la ventana se llama a la función que actualiza la cámara y el renderer
  window.addEventListener ("resize", onWindowResize);
  window.addEventListener ("mousemove", onMouseMove);
  window.addEventListener ("keypress", onKeyPress);
  window.addEventListener ("keydown", onKeyDown);
  window.addEventListener ("keyup", onKeyUp);
  window.addEventListener ("mousedown", onMouseDown);
  window.addEventListener ("mouseup", onMouseUp);
  window.addEventListener("gamepadconnected", gamePadConnected);
  window.addEventListener("gamepaddisconnected", gamePadDisconnected);

  if(navigator.getGamepads) {
      let gp = navigator.getGamepads()[0];
      console.log(gp);
      if(gp != null) gamepad = gp.id;
      else gamepad = null
  }
  else gamepad = null;
  // Se crea una interfaz gráfica de usuario vacia
  //gui = new dat.GUI();

  // Se crea la escena. La escena es una instancia de nuestra propia clase encargada de crear y gestionar todos los elementos que intervienen en la escena.
  rsc = new ResourceHandler();
  scene = new Game (renderer.domElement);
  onWindowResize ();
  // Finalmente, realizamos el primer renderizado.
  render();
});
