let scene, camera, renderer, raycaster, mouse, canvas;
let matrix = [
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
];
let sides = [matrix.length, matrix[0].length];
let activeColor = 0x303030;
let inactiveColor = 0xffffff;
let lineColor = 0x000000;
let size = 10;
let camFactor = 10;
let ySpeed,
  xSpeed = 0.01;
let zoomFactor = 0.01;
let cameraOffset = [0, 0, 0, 0];
let sceneMatrix = [];

function init() {
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(
    window.innerWidth / -camFactor,
    window.innerWidth / camFactor,
    window.innerHeight / camFactor,
    window.innerHeight / -camFactor,
    1,
    1000
  );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(inactiveColor, 1);
  document.getElementById("pixel-view").appendChild(renderer.domElement);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  camera.position.z = 100;
  initGrid();
}

function initGrid() {
  var lineGridGeometry,
    boxGeometry,
    lineBorderGeometry,
    activeMaterial,
    inactiveMaterial,
    lineGridMaterial,
    lineBorderMaterial;

  var offsetX = (sides[1] * size) / 2;
  var offsetY = (sides[0] * size) / 2;

  var cube;
  for (var i = 0; i < sides[0]; i++) {
    sceneRow = [];
    for (var k = 0; k < sides[1]; k++) {
      boxGeometry = new THREE.BoxGeometry(size, size, 1);
      if (matrix[i] == 0) {
        inactiveMaterial = new THREE.MeshBasicMaterial({
          color: inactiveColor
        });
        cube = new THREE.Mesh(boxGeometry, inactiveMaterial);
        sceneRow[k] = cube.id;
      } else {
        activeMaterial = new THREE.MeshBasicMaterial({ color: activeColor });
        cube = new THREE.Mesh(boxGeometry, activeMaterial);
        sceneRow[k] = cube.id;
      }
      cube.position.set(
        k * size + size / 2 - offsetX,
        -i * size - size / 2 + offsetY,
        0
      );
      scene.add(cube);
    }
    sceneMatrix[i] = sceneRow;
  }

  var lineGrid;
  for (var i = 1; i < sides[0]; i++) {
    lineGridGeometry = new THREE.Geometry();
    lineGridGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    lineGridGeometry.vertices.push(new THREE.Vector3(size * sides[1], 0, 0));
    lineGridMaterial = new THREE.LineBasicMaterial({ color: lineColor });
    lineGrid = new THREE.Line(lineGridGeometry, lineGridMaterial);
    lineGrid.position.set(-offsetX, -i * size + offsetY, 10);
    scene.add(lineGrid);
  }
  for (var i = 1; i < sides[1]; i++) {
    lineGridGeometry = new THREE.Geometry();
    lineGridGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    lineGridGeometry.vertices.push(new THREE.Vector3(0, -size * sides[0], 0));
    lineGridMaterial = new THREE.LineBasicMaterial({ color: lineColor });
    lineGrid = new THREE.Line(lineGridGeometry, lineGridMaterial);
    lineGrid.position.set(i * size - offsetX, offsetY, 10);
    scene.add(lineGrid);
  }

  lineBorderGeometry = new THREE.Geometry();
  lineBorderGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
  lineBorderGeometry.vertices.push(new THREE.Vector3(size * sides[1], 0, 0));
  lineBorderGeometry.vertices.push(
    new THREE.Vector3(size * sides[1], -size * sides[0], 0)
  );
  lineBorderGeometry.vertices.push(new THREE.Vector3(0, -size * sides[0], 0));
  lineBorderGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
  lineBorderMaterial = new THREE.LineBasicMaterial({
    color: lineColor,
    linewidth: 2
  });
  var lineBorder = new THREE.Line(lineBorderGeometry, lineBorderMaterial);
  lineBorder.position.set(-offsetX, offsetY, 10);
  scene.add(lineBorder);
}

function draw() {
  for (var i = 0; i < sides[0]; i++) {
    for (var k = 0; k < sides[1]; k++) {
      if (matrix[i][k] == 1) {
        scene.getObjectById(sceneMatrix[i][k]).material.color.set(activeColor);
      } else {
        scene
          .getObjectById(sceneMatrix[i][k])
          .material.color.set(inactiveColor);
      }
    }
  }
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children);
  for (var i = 0; i < intersects.length; i++) {
    if (intersects[i].object.type == "Mesh") {
      intersects[i].object.material.color.set(0xff0000);
      break;
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  draw();
  renderer.render(scene, camera);
}

function flip(i, k) {
  if (i < sides[0] && k < sides[1]) {
    if (matrix[i][k] == 0) {
      matrix[i][k] = 1;
    } else {
      matrix[i][k] = 0;
    }
  }
}

function onWindowResize() {
  setCamera();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setCamera() {
  if (camFactor > 20) {
    camFactor = 20;
  } else if (camFactor < 2) {
    camFactor = 2;
  }
  camera.left = -window.innerWidth / camFactor + cameraOffset[0];
  camera.right = window.innerWidth / camFactor + cameraOffset[1];
  camera.top = window.innerHeight / camFactor + cameraOffset[2];
  camera.bottom = -window.innerHeight / camFactor + cameraOffset[3];
  camera.updateProjectionMatrix();
}

function onMouseClick(event) {
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children);
  for (var i = 0; i < intersects.length; i++) {
    var square = intersects[i].object;
    if (square.type == "Mesh") {
      for (var k = 0; k < sides[0]; k++) {
        var index = sceneMatrix[k].indexOf(square.id);
        if (index > -1) {
          flip(k, index);
          break;
        }
      }
      break;
    }
  }
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function zoom(event) {
  var direction = event.deltaY;
  camFactor += direction * zoomFactor;
  setCamera();
}

function setupKeyControls(event) {
  var key = event.keyCode;
  if (key == 119) {
    cameraOffset[2] += 1;
    cameraOffset[3] += 1;
    setCamera();
  }
  if (key == 115) {
    cameraOffset[2] -= 1;
    cameraOffset[3] -= 1;
    setCamera();
  }
  if (key == 97) {
    cameraOffset[0] -= 1;
    cameraOffset[1] -= 1;
    setCamera();
  }
  if (key == 100) {
    cameraOffset[0] += 1;
    cameraOffset[1] += 1;
    setCamera();
    console.log(sceneMatrix);
  }
}

window.onload = function() {
  canvas = document.querySelector("#pixel-view");
  document.querySelector("#pixel-view").onwheel = zoom;
  // document.querySelector("#pixel-view").ondrag = onMouseMove;
  window.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("click", onMouseClick, false);
  document.onkeypress = setupKeyControls;
  window.onresize = onWindowResize;
  init();
  animate();
};
