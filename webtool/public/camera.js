import { getMatrix } from './Matrix.js';
import { warpOffset, warpLength } from './Geometry.js';

export const camFactor = 3;

export function initPerspectiveCamera(canvas, center) {
  const matrix = getMatrix();
  const cameraPosition = {
    x: center.x,
    y: center.y + warpOffset * matrix.layers * 10,
    z: center.z + warpLength * matrix.height,
  };

  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.offsetWidth / canvas.offsetHeight,
    1,
    10000
  );

  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

  return camera;
}

export function initOrthographicCamera(canvas, center) {
  const camera = new THREE.OrthographicCamera(
    canvas.offsetWidth / -camFactor,
    canvas.offsetWidth / camFactor,
    canvas.offsetHeight / camFactor,
    canvas.offsetHeight / -camFactor,
    1,
    10000
  );
  camera.position.set(center.x, center.y, center.z);

  return camera;
}
