import * as Matrix from './Matrix.js';
import * as Materials from './Materials.js';
import * as Geometry from './Geometry.js';
import { scene, camera } from './threeDView.js';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(-1000000, -1000000);

let hoveredOverPoints = [];

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
    if (object.name === 'Warp') {
      Matrix.rotateToggle(Matrix.getPointById(object.id));
      break;
    }
  }
}

export function updateTubeColors() {
  for (const point of hoveredOverPoints) {
    scene.getObjectById(point.id).material.color.set(Materials.warpColor);
  }
  hoveredOverPoints = [];

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  for (const { object } of intersects) {
    if (object.name !== 'Warp') continue;

    const point = Matrix.getPointById(object.id);
    const nextPoint = Matrix.getNextSet(point);
    if (nextPoint !== null) {
      const nextObject = scene.getObjectById(nextPoint.id);
      nextObject.material.color.set(Materials.tubeHighlightColor);
      hoveredOverPoints.push(nextPoint);
    }

    object.material.color.set(Materials.tubeHighlightColor);
    hoveredOverPoints.push(point);
    break;
  }
}
