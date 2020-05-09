import * as THREE from "three";
import Stats from 'stats.js'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { toRadian } from "../../utils";

export default class {
  constructor(canvas, quality) {
    this.mesh;
    this.statsEnabled = true;
    this.spotLight = new THREE.SpotLight( new THREE.Color(113, 113, 255), 0.01, 0, Math.PI/10);
    this.mouseX = 0;
    this.mouseY = 0;

    this.targetX = 0;
    this.targetY = 0;

    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;

    this.canvas = canvas;
    this.quality = quality;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x060708 );

    this.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 100 );
    this.camera.position.set(1.925, -0.52, 6.932);
    this.camera.rotation.y = toRadian(33);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadows = true;

    this.mouseListener = window.addEventListener( 'mousemove', (e) => this.onDocumentMouseMove(e), false );
    this.resizeListener = window.addEventListener('resize', () => this.resize(), { passive: true });
    this.init();
    this.setQuality();
  }

  init() {
    // LIGHTS
    this.scene.add( new THREE.AmbientLight( 0xfefefe, .1));
    this.spotLight.position.set( 5, 10, 7.5 );
    // this.spotLight.castShadow = true;
    this.spotLight.penumbra = 1;
    this.spotLight.decay = 1;
    this.scene.add( this.spotLight );

    /*const mapHeight = new THREE.TextureLoader().load( "./assets/models/characters/Infinite-Level_02_Disp_NoSmoothUV-4096.jpg" );

    const material = new THREE.MeshPhongMaterial( {
      color: 0x552811,
      specular: 0x222222,
      shininess: 25,
      bumpMap: mapHeight,
      bumpScale: 12
    } );*/

    new GLTFLoader().load( "./assets/models/characters/artwork.glb", ( gltf ) => {
      this.createScene(gltf.scene);
    });


    if ( this.statsEnabled ) {
      this.stats = new Stats();
      document.body.appendChild( this.stats.dom );
    }
    this.render()
  }

  setQuality() {

  }

  createScene( scene ) {
    /*
    this.mesh = new THREE.Mesh( geometry, material );
    this.mesh.position.y = - 50;
    this.mesh.scale.set( scale, scale, scale );
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add( this.mesh );
    */
    // this.spotLight.lookAt(scene);
    this.scene.add(scene);
  }

  onDocumentMouseMove( event ) {
    this.mouseX = ( event.clientX - this.windowHalfX );
    this.mouseY = ( event.clientY - this.windowHalfY );
  }

  render() {
    this.stats.begin();

    this.targetX = this.mouseX * .0001;
    this.targetY = this.mouseY * .0001;

    if ( this.scene ) {
      this.scene.rotation.y += 0.05 * ( this.targetX - this.scene.rotation.y );
      this.scene.rotation.x += 0.05 * ( this.targetY - this.scene.rotation.x );
      // console.log(this.scene.rotation);
    }

    this.renderer.render( this.scene, this.camera );
    this.loop = requestAnimationFrame(() => this.render());
    this.stats.end();
  }

  destroy() {
    cancelAnimationFrame(this.loop);
    this.scene = null;
    this.spotLight = null;
    this.camera = null;
    this.canvas.remove();
    // window.removeListener('mousemove', this.mouseListener, { passive: true });
    // window.removeListener('resize', this.resizeListener, { passive: true });
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
  }
}