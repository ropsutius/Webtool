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
    canvas.clientWidth / canvas.clientHeight,
    1,
    1000
  );

  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

  return camera;
}

export function initOrthographicCamera(canvas, center) {
  const camera = new THREE.OrthographicCamera(
    canvas.clientWidth / -camFactor,
    canvas.clientWidth / camFactor,
    canvas.clientHeight / camFactor,
    canvas.clientHeight / -camFactor,
    1,
    1000
  );
  camera.position.set(center.x, center.y, center.z);

  return camera;
}
