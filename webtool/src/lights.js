import { lightColor } from './Materials.js';

export function addLights(scene) {
  const light = new THREE.HemisphereLight(lightColor);
  light.position.y = -10;
  scene.add(light);
}
