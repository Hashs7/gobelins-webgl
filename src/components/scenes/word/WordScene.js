import WordFactory from "./WordFactory";
import Scene from "../Scene";
import { Vec3 } from "cannon-es";
import * as THREE from "three";
import State from "../../core/State";
import AudioManager from "../../core/AudioManager";
import { Raycaster } from "three";
import { GAME_STATES } from "../../../constantes";
import TestimonyManager from "../../core/TestimonyManager";

const wordsDef = [{
  text: 'Kitchen',
  mass: 25,
  position: new Vec3(125, 10, -3),
  collide: false,
}, {
  text: 'Sandwich',
  mass: 30,
  position: new Vec3(135, 25, -5),
  collide: true,
}, {
  text: 'Bitch',
  mass: 20,
  position: new Vec3(150, 70, -3),
  collide: true,
}];

export default class extends Scene {
  constructor(world, camera, manager, material, sections) {
    super();
    this.world = world;
    this.sections = sections;
    this.scene.name = "WordScene";
    this.wordIndex = 0;
    // this.scene.fog = new THREE.Fog(0x202533, -1, 100);
    //console.log(this.scene);
    this.factory = new WordFactory(this.scene, this.world, camera, manager, material);
    this.ray = new Raycaster(
      new THREE.Vector3(0,0,0),
      new THREE.Vector3(0,0,0),
      0,
      0.5,
    );
    this.ray.firstHitOnly = true;

    //TODO enable after player enter section
    document.addEventListener('playerMoved', (e) => this.detectWall(e));

    return {
      instance: this,
      scene: this.scene,
    };
  }

  detectWall(e) {
    const playerPosition = new THREE.Vector3().setFromMatrixPosition(e.detail.matrixWorld);
    const direction = new THREE.Vector3( 0, 0, -1 ).applyQuaternion( e.detail.quaternion );
    this.ray.set(playerPosition, direction);
    const objs = this.ray.intersectObjects(this.sections, false);
    if(objs.length === 0) return;
    // TODO refacto
    if (objs[0].object.name === "m1") {
      this.dropWord();
      objs[0].object.name += 'Passed';
      this.sections = this.sections.filter(s => s.name !== 'm1');
      TestimonyManager.speak('first_badword.mp3', 'first_badword');
    }
    if (objs[0].object.name === "m2") {
      this.dropWord();
      objs[0].object.name += 'Passed';
      this.sections = this.sections.filter(s => s.name !== 'm2');
      TestimonyManager.speak('second_badword.mp3', 'second_badword');
    }
    if (objs[0].object.name === "m3") {
      this.dropWord();
      objs[0].object.name += 'Passed';
      this.sections = this.sections.filter(s => s.name !== 'm3');
      TestimonyManager.speak('ending.mp3', 'ending');
    }
  }

  dropWord() {
    this.factory.addWord(wordsDef[this.wordIndex]);
    this.wordIndex++;
  }

  update() {
    this.factory.update();
  }
}
