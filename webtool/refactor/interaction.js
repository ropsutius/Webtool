import * as Matrix from './Matrix.js';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(-1000000, -1000000);

export function onPointerMove(event, canvas) {
  pointer.x =
    ((event.clientX - canvas.offsetLeft) / canvas.offsetWidth) * 2 - 1;
  pointer.y =
    -((event.clientY - canvas.offsetTop) / canvas.offsetHeight) * 2 + 1;
}

export function onMouseClick(scene, camera) {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  for (const { object } of intersects) {
    Matrix.rotateToggle(Matrix.getCoordinatesById(object.id));
    break;
  }
}
