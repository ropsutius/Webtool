class PixelView {
  matrix = [
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
  clicked = false;
  sides = [this.matrix.length, this.matrix[0].length];
  activeColor = 0x303030;
  inactiveColor = 0xffffff;
  lineColor = 0x000000;
  highlightColor = 0xff0000;
  size = 10;
  camFactor = 10;
  ySpeed = 0.01;
  xSpeed = 0.01;
  zoomFactor = 0.01;
  cameraOffset = [0, 0, 0, 0];
  sceneMatrix = [];

  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(
      this.canvas.offsetWidth / -this.camFactor,
      this.canvas.offsetWidth / this.camFactor,
      this.canvas.offsetHeight / this.camFactor,
      this.canvas.offsetHeight / -this.camFactor,
      1,
      1000
    );
    this.camera.position.z = 100;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    this.renderer.setClearColor(this.inactiveColor, 1);

    this.canvas.appendChild(this.renderer.domElement);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.canvas.addEventListener("wheel", this.zoom.bind(this), false);
    this.canvas.addEventListener("mousedown", function() {
      this.clicked = true;
    });
    this.canvas.addEventListener("mouseup", function() {
      this.clicked = false;
    });
    this.canvas.addEventListener(
      "mousemove",
      this.onMouseMove.bind(this),
      false
    );
    this.canvas.addEventListener("click", this.onMouseClick.bind(this), false);

    this.initGrid();
  }

  initGrid() {
    var lineGridGeometry,
      boxGeometry,
      lineBorderGeometry,
      activeMaterial,
      inactiveMaterial,
      lineGridMaterial,
      lineBorderMaterial;

    var offsetX = (this.sides[1] * this.size) / 2;
    var offsetY = (this.sides[0] * this.size) / 2;

    var cube;
    for (var i = 0; i < this.sides[0]; i++) {
      var sceneRow = [];
      for (var k = 0; k < this.sides[1]; k++) {
        boxGeometry = new THREE.BoxGeometry(this.size, this.size, 1);
        if (this.matrix[i] == 0) {
          inactiveMaterial = new THREE.MeshBasicMaterial({
            color: this.inactiveColor
          });
          cube = new THREE.Mesh(boxGeometry, inactiveMaterial);
          sceneRow[k] = cube.id;
        } else {
          activeMaterial = new THREE.MeshBasicMaterial({
            color: this.activeColor
          });
          cube = new THREE.Mesh(boxGeometry, activeMaterial);
          sceneRow[k] = cube.id;
        }
        cube.position.set(
          k * this.size + this.size / 2 - offsetX,
          -i * this.size - this.size / 2 + offsetY,
          0
        );
        this.scene.add(cube);
      }
      this.sceneMatrix[i] = sceneRow;
    }

    var lineGrid;
    for (var i = 1; i < this.sides[0]; i++) {
      lineGridGeometry = new THREE.Geometry();
      lineGridGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
      lineGridGeometry.vertices.push(
        new THREE.Vector3(this.size * this.sides[1], 0, 0)
      );
      lineGridMaterial = new THREE.LineBasicMaterial({ color: this.lineColor });
      lineGrid = new THREE.Line(lineGridGeometry, lineGridMaterial);
      lineGrid.position.set(-offsetX, -i * this.size + offsetY, 10);
      this.scene.add(lineGrid);
    }
    for (var i = 1; i < this.sides[1]; i++) {
      lineGridGeometry = new THREE.Geometry();
      lineGridGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
      lineGridGeometry.vertices.push(
        new THREE.Vector3(0, -this.size * this.sides[0], 0)
      );
      lineGridMaterial = new THREE.LineBasicMaterial({ color: this.lineColor });
      lineGrid = new THREE.Line(lineGridGeometry, lineGridMaterial);
      lineGrid.position.set(i * this.size - offsetX, offsetY, 10);
      this.scene.add(lineGrid);
    }

    lineBorderGeometry = new THREE.Geometry();
    lineBorderGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    lineBorderGeometry.vertices.push(
      new THREE.Vector3(this.size * this.sides[1], 0, 0)
    );
    lineBorderGeometry.vertices.push(
      new THREE.Vector3(
        this.size * this.sides[1],
        -this.size * this.sides[0],
        0
      )
    );
    lineBorderGeometry.vertices.push(
      new THREE.Vector3(0, -this.size * this.sides[0], 0)
    );
    lineBorderGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    lineBorderMaterial = new THREE.LineBasicMaterial({
      color: this.lineColor,
      linewidth: 5
    });
    var lineBorder = new THREE.Line(lineBorderGeometry, lineBorderMaterial);
    lineBorder.position.set(-offsetX, offsetY, 10);
    this.scene.add(lineBorder);

    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.draw();
    this.renderer.render(this.scene, this.camera);
  }

  draw() {
    for (var i = 0; i < this.sides[0]; i++) {
      for (var k = 0; k < this.sides[1]; k++) {
        if (this.matrix[i][k] == 1) {
          this.scene
            .getObjectById(this.sceneMatrix[i][k])
            .material.color.set(this.activeColor);
        } else {
          this.scene
            .getObjectById(this.sceneMatrix[i][k])
            .material.color.set(this.inactiveColor);
        }
      }
    }
    this.raycaster.setFromCamera(this.mouse, this.camera);
    var intersects = this.raycaster.intersectObjects(this.scene.children);
    for (var i = 0; i < intersects.length; i++) {
      if (intersects[i].object.type == "Mesh") {
        intersects[i].object.material.color.set(this.highlightColor);
        break;
      }
    }
  }

  flip(i, k) {
    if (i < this.sides[0] && k < this.sides[1]) {
      if (this.matrix[i][k] == 0) {
        this.matrix[i][k] = 1;
      } else {
        this.matrix[i][k] = 0;
      }
    }
  }

  onWindowResize() {
    this.setCamera();
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
  }

  setCamera() {
    if (this.camFactor > 20) {
      this.camFactor = 20;
    } else if (this.camFactor < 2) {
      this.camFactor = 2;
    }
    this.camera.left =
      -this.canvas.offsetWidth / this.camFactor + this.cameraOffset[0];
    this.camera.right =
      this.canvas.offsetWidth / this.camFactor + this.cameraOffset[1];
    this.camera.top =
      this.canvas.offsetHeight / this.camFactor + this.cameraOffset[2];
    this.camera.bottom =
      -this.canvas.offsetHeight / this.camFactor + this.cameraOffset[3];
    this.camera.updateProjectionMatrix();
  }

  onMouseClick(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    var intersects = this.raycaster.intersectObjects(this.scene.children);
    for (var i = 0; i < intersects.length; i++) {
      var square = intersects[i].object;
      if (square.type == "Mesh") {
        for (var k = 0; k < this.sides[0]; k++) {
          var index = this.sceneMatrix[k].indexOf(square.id);
          if (index > -1) {
            this.flip(k, index);
            break;
          }
        }
        break;
      }
    }
  }

  onMouseMove(event) {
    this.mouse.x =
      ((event.clientX - this.canvas.offsetLeft) / this.canvas.offsetWidth) * 2 -
      1;
    this.mouse.y =
      -((event.clientY - this.canvas.offsetTop) / this.canvas.offsetHeight) *
        2 +
      1;
  }

  zoom(event) {
    var direction = event.deltaY;
    this.camFactor -= direction * this.zoomFactor;
    this.setCamera();
  }

  setupKeyControls(event) {
    var key = event.keyCode;
    if (key == 119) {
      this.cameraOffset[2] += 1;
      this.cameraOffset[3] += 1;
      this.setCamera();
    }
    if (key == 115) {
      this.cameraOffset[2] -= 1;
      this.cameraOffset[3] -= 1;
      this.setCamera();
    }
    if (key == 97) {
      this.cameraOffset[0] -= 1;
      this.cameraOffset[1] -= 1;
      this.setCamera();
    }
    if (key == 100) {
      this.cameraOffset[0] += 1;
      this.cameraOffset[1] += 1;
      this.setCamera();
    }
  }
}

window.onload = function() {
  canvasP = document.querySelector("#pixel-view");
  canvas3d = document.getElementById("3d-view");
  pv = new PixelView(canvasP);
  tv = new ThreeDView(canvas3d);
  window.onkeypress = pv.setupKeyControls.bind(pv);
  window.onresize = pv.onWindowResize.bind(pv);
};
