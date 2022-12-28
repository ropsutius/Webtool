import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import * as App from './app.js';
import * as Matrix from './matrix.js';

let warpColor,
  weftColor,
  lightColor,
  warpLength,
  weftLength,
  warpHeight,
  warp,
  r,
  tubeSegments,
  radialSegments,
  layerOffset,
  canvas;

export function init() {
  canvas = document.getElementById('threeD-view');
  warpColor = 0x4444ff;
  weftColor = 0x77cc77;
  lightColor = 0x404040;
  warpLength = 4;
  weftLength = 2;
  warpHeight = 3;
  warp = [0, warpLength / 4, warpLength / 2, (3 * warpLength) / 4, warpLength];
  r = 1;
  tubeSegments = 32;
  radialSegments = 8;
  layerOffset = 5;

  initControls();
  initWeave();
}

export function initControls() {
  let initCameraPos = {
    x: (Matrix.width * weftLength) / 2 / App.layers,
    y: 0,
    z: (Matrix.height * warpLength) / 2 / App.layers,
  };
  let cameraOffset = {
    x: 0,
    y: warpHeight * App.layers * 10,
    z: Matrix.height * warpLength,
  };

  let camera = new THREE.PerspectiveCamera(
    45,
    canvas.offsetWidth / canvas.offsetHeight,
    1,
    10000
  );
  camera.position.set(
    initCameraPos.x + cameraOffset.x,
    initCameraPos.y + cameraOffset.y,
    initCameraPos.z + cameraOffset.z
  );

  let controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 25;
  controls.maxDistance = 1000;
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.ROTATE,
  };
  controls.zoomSpeed = 0.6;
  controls.target = new THREE.Vector3(
    initCameraPos.x,
    initCameraPos.y,
    initCameraPos.z
  );
}

export function initWeave() {
  let light = new THREE.HemisphereLight(lightColor);
  light.position.y = -10;
  scene.add(light);

  let curve;
  for (let i = 0; i < matrix.x; i++) {
    for (let k = 0; k < matrix.y; k++) {
      if (i == 0) {
        sceneMatrix[k] = [];
      }
      if (!isPrimePoint({ y: k, x: i })) {
        continue;
      }
      curve = getWarpPoints({ y: k, x: i });
      let id = addTubeToScene(curve, 'Warp');
      sceneMatrix[k][i] = id;
    }
  }

  for (curve of getWeftPoints()) {
    addTubeToScene(curve, 'Weft');
  }

  let axesHelper = new THREE.AxesHelper(5);
  axesHelper.translateY(App.layers * layerOffset + 10);
  scene.add(axesHelper);

  animate();
}

export function* getWeftPoints() {
  let x, y, z;
  for (let i = 0; i < matrix.y; i++) {
    x = [-r * 2, ((matrix.x - 1) * weftLength) / App.layers + r];
    y =
      warpHeight * (i % App.layers) +
      warpHeight / 2 +
      (i % App.layers) * layerOffset;
    z = ((i - (i % App.layers)) / App.layers) * warpLength + warpLength;
    yield [new THREE.Vector3(x[0], y, z), new THREE.Vector3(x[1], y, z)];
  }
}

export function addTubeToScene(curve, type) {
  let color;
  if (type == 'Weft') {
    color = weftColor;
  } else if (type == 'Warp') {
    color = warpColor;
  }
  if (curve == null) {
    curve = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
    type = 'Warp';
  }
  let tube = new THREE.TubeBufferGeometry(
    new THREE.CatmullRomCurve3(curve),
    tubeSegments,
    r,
    radialSegments,
    false
  );
  let material = new THREE.MeshLambertMaterial({ color: color });
  let mesh = new THREE.Mesh(tube, material);
  if (curve == null) {
    mesh.visible = false;
  }
  mesh.name = type;
  scene.add(mesh);
  return mesh.id;
}

export function updateTube(coords) {
  coords = getPrimePoint(coords);
  let object = scene.getObjectById(getId(coords));
  let curve = getWarpPoints(coords);
  if (curve != null) {
    object.geometry.copy(
      new THREE.TubeBufferGeometry(
        new THREE.CatmullRomCurve3(curve),
        tubeSegments,
        r,
        radialSegments,
        false
      )
    );
    object.geometry.needsUpdate = true;
  }
}

export function resetTubeColor(coords) {
  scene.getObjectById(getId(coords)).material.color.set(warpColor);
}

export function draw() {
  for (let i = 0; i < App.changed3D.length; i++) {
    updateTube(App.changed3D[i]);

    let next = getNextSet(App.changed3D[i]);
    if (next != null) {
      updateTube(next);
    }
  }
  App.changed3D = [];

  for (let i = 0; i < previous.length; i++) {
    resetTubeColor(previous[i]);
  }
  previous = [];

  let intersects = getSetByMouse();
  for (let i = 0; i < intersects.length; i++) {
    let curr = intersects[i].object;
    if (curr.name == 'Warp') {
      let currC = getCoordinatesById(curr.id);
      let nextC = getNextSet(currC);
      if (nextC != null) {
        let next = scene.getObjectById(getId(nextC));
        next.material.color.set(highlightColor[1]);
        previous.push(nextC);
      }

      curr.material.color.set(highlightColor[1]);
      previous.push(currC);
      break;
    }
  }
}

export function getWarpPoints(curr) {
  let prevA;
  let currA = getHeight(curr);
  if (currA == null) {
    return null;
  }

  let prev = getPreviousSet(curr);
  if (prev != null) {
    prevA = getHeight(prev);
  } else {
    prevA = App.layers - (curr.x % App.layers) - 1;
  }
  let warp = App.layers - (curr.x % App.layers) - 1;
  let prevY = warpHeight * prevA + warp * layerOffset;
  let currY = warpHeight * currA + warp * layerOffset;

  if (currA < warp) {
    currY -= (warp - currA) * layerOffset;
  } else if (currA > warp + 1) {
    currY += (currA - warp - 1) * layerOffset;
  }

  if (prevA < warp) {
    prevY -= (warp - prevA) * layerOffset;
  } else if (prevA > warp + 1) {
    prevY += (prevA - warp - 1) * layerOffset;
  }

  let midY = Math.abs(currY - prevY) / 2 + Math.min(prevY, currY);
  let x = ((curr.x - (curr.x % App.layers)) / App.layers) * weftLength;
  let z = ((curr.y - (curr.y % App.layers)) / App.layers) * warpLength;

  return [
    new THREE.Vector3(x, prevY, warp[0] + z),
    new THREE.Vector3(x, prevY, warp[1] + z),
    new THREE.Vector3(x, midY, warp[2] + z),
    new THREE.Vector3(x, currY, warp[3] + z),
    new THREE.Vector3(x, currY, warp[4] + z),
  ];
}

export function onMouseDown(event) {
  let intersects = getSetByMouse();
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.type == 'Mesh') {
      clicked = intersects[i].object;
      break;
    }
  }
}

export function onMouseClick(event) {
  let intersects = getSetByMouse();
  for (let i = 0; i < intersects.length; i++) {
    let curr = intersects[i].object;
    if (curr == clicked && curr.type == 'Mesh') {
      rotateToggle(getCoordinatesById(curr.id));
      break;
    }
  }
}

export function updateControls() {
  controls.update();
}

export function onWindowResize(canvas) {
  camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
}

export function reset(options, matrix = []) {
  previous = [];

  disposeHierarchy(scene);
  scene.dispose();
  renderer.renderLists.dispose();
  scene = new THREE.Scene();
  scene.background = new THREE.Color(backgroundColor);

  initControls();
  initWeave();
}
