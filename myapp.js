// myapp.js


var manifestUri = null;
var licenseServer = '//cwip-shaka-proxy.appspot.com/cookie_auth';

function selectLinkByIndex(indice){
  var resultado;
  switch (indice){
    case 0:
     resultado='//storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';
     break;
    case 1:
    resultado='//storage.googleapis.com/shaka-demo-assets/sintel-widevine/dash.mpd';
    break;
    case 2:
    resultado='//storage.googleapis.com/shaka-demo-assets/tos-ttml/dash.mpd';
    break;
    case 3:
    resultado='//storage.googleapis.com/shaka-live-assets/player-source.mpd';
    break;
    case 4:
    resultado='//wowzaec2demo.streamlock.net/live/bigbuckbunny/manifest_mpm4sav_mvtime.mpd';
    break;
    default:
    console.log('Intentando reproducir un video que no existe')

  }
  manifestUri=resultado;
  console.log(resultado);
}

function initApp() {
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (shaka.Player.isBrowserSupported()) {
    // Everything looks good!
    initPlayer();
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!');
  }
}

function initPlayer() {
  // Create a Player instance.
  var video = document.getElementById('video');
  var player = new shaka.Player(video);

  // Attach player to the window to make it easy to access in the JS console.
  window.player = player;

  // Listen for error events.
  player.addEventListener('error', onErrorEvent);

  //Configuramos el servidor de licencias de DRM Widevine de Google
  player.configure({
    drm: {
      servers: { 'com.widevine.alpha': licenseServer }
    }
  });

  player.getNetworkingEngine().registerRequestFilter(function(type, request) {
    if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
      //Permite que la aplicacion envie las credenciales (cookies) a terceras partes (al servidor de licencias)
      //Es necesario que el servidor de licencias tambien acepte cookies de terceras partes (Access-Control-Allow-Credentials)
      request.allowCrossSiteCredentials = true;
    }
  });

  // Try to load a manifest.
  // This is an asynchronous process.
  player.load(manifestUri).then(function() {
    // This runs if the asynchronous load is successful.
    console.log('The video has now been loaded!');
  }).catch(onError);  // onError is executed if the asynchronous load fails.
}

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error) {
  // Log the error.
  console.error('Error code', error.code, 'object', error);
}

function loadVideo(n) {
  var indice=n;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("visor").innerHTML =
      this.responseText;
      selectLinkByIndex(indice);
      initApp();
    }
  };
  xhttp.open("GET", "video.html", true);
  xhttp.send();
}

  var slideIndex = 1;

function inicializar(){
  showDivs(slideIndex);
}

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";  
  }
  x[slideIndex-1].style.display = "block";  
}


//Llamar a initApp cuando se quiera empezar a reproducir el video
//document.addEventListener('DOMContentLoaded', initApp);

document.addEventListener('DOMContentLoaded', inicializar);
