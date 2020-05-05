import * as THREE from 'three';
import Projectile from "../../core/Projectile";


export default class ProjectileManager {
  constructor(scene, towers, landingAreas, world, towerEls) {
    this.scene = scene;
    this.world = world;
    this.proj;
    this.towerElements = towerEls;

    document.addEventListener('stateUpdate', e => {
      if (e.detail !== 'projectile_sequence_start') return;
      const arr = landingAreas.slice(0, 4);
      this.proj = new Projectile(towers[0], arr, this.scene, this.towerElements[0]);
      this.proj.launchSequence();
    });

    document.addEventListener('playerMoved', e => {
      const playerPosition = new THREE.Vector3().setFromMatrixPosition(e.detail.matrixWorld);
      if(!this.proj) return
      this.proj.detectLandingArea(playerPosition, this.world);
    });
  }
}
