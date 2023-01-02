import { layerOffset } from './Geometry.js';
import { getMatrix } from './Matrix.js';

export function addAxesHelpers(scene) {
  const matrix = getMatrix();
  const axesHelper = new THREE.AxesHelper(5);
  axesHelper.translateY(matrix.layers * layerOffset + 10);
  scene.add(axesHelper);
}
