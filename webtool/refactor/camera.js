import * as App from './app.js';
import * as Matrix from './Matrix.js';
import * as Geometry from './Geometry.js';

export function initCamera(canvas, center) {
  const matrix = Matrix.getMatrix();
  const cameraPosition = {
    x: center.x,
    y: center.y + Geometry.warpHeight * matrix.layers * 10,
    z: center.z + Geometry.warpLength * matrix.height,
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
