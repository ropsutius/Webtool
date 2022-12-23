let backgroundColor,
  highlightColor,
  okList,
  previous,
  sceneMatrix,
  clicked,
  app,
  matrix,
  canvas,
  scene,
  renderer,
  raycaster,
  mouse;

export function init(app, canvas) {
  backgroundColor = 0xf5f5f5;
  highlightColor = [0xee9999, 0xcc4444];
  okList = [
    ['0', '1'],
    ['00', '10', '11'],
    ['000', '100', '110', '111'],
    ['0000', '1000', '1100', '1110', '1111'],
  ];
  previous = [];
  sceneMatrix = [];
  clicked = false;

  app = app;
  matrix = app.matrix;

  canvas = canvas;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(backgroundColor);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  canvas.appendChild(renderer.domElement);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  canvas.addEventListener('mousemove', onMouseMove.bind(this), false);

  canvas.addEventListener('mousedown', onMouseDown.bind(this), false);
  canvas.addEventListener('click', onMouseClick.bind(this), false);
}

export function constructor(app, canvas) {}

export function animate() {
  requestAnimationFrame(animate.bind(this));
  draw();
  updateControls();
  renderer.render(scene, camera);
}

export function getSetByMouse() {
  raycaster.setFromCamera(mouse, camera);
  return raycaster.intersectObjects(scene.children);
}

export function onMouseMove(event) {
  mouse.x = ((event.clientX - canvas.offsetLeft) / canvas.offsetWidth) * 2 - 1;
  mouse.y = -((event.clientY - canvas.offsetTop) / canvas.offsetHeight) * 2 + 1;
}

export function getToggle(coords) {
  return matrix.matrix[coords.y][coords.x];
}

export function getToggleById(id) {
  return getToggle(getCoordinatesById(id));
}

export function getId(coords) {
  return sceneMatrix[coords.y][coords.x] === undefined
    ? null
    : sceneMatrix[coords.y][coords.x];
}

export function getCoordinatesById(id) {
  for (let i = 0; i < matrix.y; i++) {
    let index = sceneMatrix[i].indexOf(id);
    if (index > -1) {
      return { y: i, x: index };
    }
  }
  return null;
}

export function getPreviousSet(coords) {
  return coords.y < app.layers
    ? null
    : { y: coords.y - app.layers, x: coords.x };
}

export function getNextSet(coords) {
  return coords.y > matrix.y - app.layers - 1
    ? null
    : { y: coords.y + app.layers, x: coords.x };
}

export function getPrimePoint(coords) {
  while (!isPrimePoint(coords)) {
    coords = getNextPointInSet(coords);
  }
  return coords;
}

export function getNextPointInSet(coords) {
  return !isLastPoint(coords)
    ? { x: coords.x, y: coords.y + 1 }
    : { x: coords.x, y: coords.y - app.layers + 1 };
}

export function getPreviousPointInSet(coords) {
  return !isStartPoint(coords)
    ? { x: coords.x, y: coords.y - 1 }
    : { x: coords.x, y: coords.y + app.layers - 1 };
}

export function getStartPoint(coords) {
  if (isStartPoint(coords)) {
    return coords;
  } else {
    let point = coords;
    for (let i = 1; i < app.layers; i++) {
      point = getNextPointInSet(point);
      if (isStartPoint(point)) {
        return point;
      }
    }
  }
}

export function getLastPoint(coords) {
  if (isLastPoint(coords)) {
    return coords;
  } else {
    let point = coords;
    for (let i = 1; i < app.layers; i++) {
      point = getPreviousPointInSet(point);
      if (isLastPoint(point)) {
        return point;
      }
    }
  }
}

export function getSetString(coords) {
  let point = getStartPoint(coords);
  let string = getToggle(point).toString();
  for (let i = 1; i < app.layers; i++) {
    point = getNextPointInSet(point);
    string += getToggle(point).toString();
  }
  return string;
}

export function getHeight(coords) {
  let string = getSetString(coords);
  return okList[app.layers - 1].includes(string)
    ? okList[app.layers - 1].indexOf(string)
    : null;
}

export function isStartPoint(coords) {
  return coords.y % app.layers == 0 ? true : false;
}

export function isLastPoint(coords) {
  return coords.y % app.layers == app.layers - 1 ? true : false;
}

export function isPrimePoint(coords) {
  return (coords.y % app.layers) + (coords.x % app.layers) == app.layers - 1
    ? true
    : false;
}

export function isEqualToPair(coords) {
  return getToggle(coords) == getToggle(getNextPointInSet(coords))
    ? true
    : false;
}

export function toggle(coords) {
  if (getToggle(coords) == 0) {
    matrix.matrix[coords.y][coords.x] = 1;
  } else {
    matrix.matrix[coords.y][coords.x] = 0;
  }
}

export function tryToggle(coords) {
  toggle(coords);
  let string = getSetString(coords);
  if (!okList[app.layers - 1].includes(string)) {
    toggle(coords);
  } else {
    app.changed3D.push(coords);
    app.changedPixel.push(coords);
  }
}

export function rotateToggle(coords) {
  let point = getStartPoint(coords);
  for (let i = 0; i < app.layers; i++) {
    if (getToggle(point) == 0) {
      tryToggle(point);
      return;
    }
    point = getNextPointInSet(point);
  }
  point = getPreviousPointInSet(point);
  for (let i = 0; i < app.layers; i++) {
    if (getToggle(point) == 1) {
      tryToggle(point);
    }
    point = getPreviousPointInSet(point);
  }
}

export function disposeNode(node) {
  if (node instanceof THREE.Mesh) {
    if (node.geometry) {
      node.geometry.dispose();
    }

    if (node.material) {
      if (node.material instanceof THREE.MeshFaceMaterial) {
        $.each(node.material.materials, function (idx, mtrl) {
          if (mtrl.map) mtrl.map.dispose();
          if (mtrl.lightMap) mtrl.lightMap.dispose();
          if (mtrl.bumpMap) mtrl.bumpMap.dispose();
          if (mtrl.normalMap) mtrl.normalMap.dispose();
          if (mtrl.specularMap) mtrl.specularMap.dispose();
          if (mtrl.envMap) mtrl.envMap.dispose();
          if (mtrl.alphaMap) mtrl.alphaMap.dispose();
          if (mtrl.aoMap) mtrl.aoMap.dispose();
          if (mtrl.displacementMap) mtrl.displacementMap.dispose();
          if (mtrl.emissiveMap) mtrl.emissiveMap.dispose();
          if (mtrl.gradientMap) mtrl.gradientMap.dispose();
          if (mtrl.metalnessMap) mtrl.metalnessMap.dispose();
          if (mtrl.roughnessMap) mtrl.roughnessMap.dispose();

          mtrl.dispose();
        });
      } else {
        if (node.material.map) node.material.map.dispose();
        if (node.material.lightMap) node.material.lightMap.dispose();
        if (node.material.bumpMap) node.material.bumpMap.dispose();
        if (node.material.normalMap) node.material.normalMap.dispose();
        if (node.material.specularMap) node.material.specularMap.dispose();
        if (node.material.envMap) node.material.envMap.dispose();
        if (node.material.alphaMap) node.material.alphaMap.dispose();
        if (node.material.aoMap) node.material.aoMap.dispose();
        if (node.material.displacementMap)
          node.material.displacementMap.dispose();
        if (node.material.emissiveMap) node.material.emissiveMap.dispose();
        if (node.material.gradientMap) node.material.gradientMap.dispose();
        if (node.material.metalnessMap) node.material.metalnessMap.dispose();
        if (node.material.roughnessMap) node.material.roughnessMap.dispose();

        node.material.dispose();
      }
    }
  }
}

export function disposeHierarchy(node) {
  for (var i = node.children.length - 1; i >= 0; i--) {
    var child = node.children[i];
    disposeHierarchy(child);
    disposeNode(child);
  }
}
