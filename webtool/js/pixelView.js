class PixelView extends View {
  clicked = false;
  colors = [0xffffff, 0x303030];
  lineColor = 0x000000;
  highlightColor = 0xcc4444;
  size = 10;
  camFactor = 10;
  clicked;
  previous = { y: 0, x: 0 };

  constructor(canvas) {
    super(canvas);

    this.camera = new THREE.OrthographicCamera(
      this.canvas.offsetWidth / -this.camFactor,
      this.canvas.offsetWidth / this.camFactor,
      this.canvas.offsetHeight / this.camFactor,
      this.canvas.offsetHeight / -this.camFactor,
      1,
      1000
    );
    this.camera.position.z = 100;

    this.canvas.addEventListener(
      "mousedown",
      this.onMouseDown.bind(this),
      false
    );
    this.canvas.addEventListener("click", this.onMouseClick.bind(this), false);

    this.initControls();
    this.initGrid();
  }

  initControls() {
    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.enableRotate = false;
    this.controls.screenSpacePanning = true;
    this.controls.minZoom = 0.1;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.ROTATE
    };
  }

  initGrid() {
    let boxGeometry, boxMaterial;
    let lineGridGeometry, lineGridMaterial;
    let lineBorderGeometry, lineBorderMaterial;

    let offsetX = (this.sides[1] * this.size) / 2;
    let offsetY = (this.sides[0] * this.size) / 2;

    let cube;
    for (let i = 0; i < this.sides[0]; i++) {
      let sceneRow = [];
      for (let k = 0; k < this.sides[1]; k++) {
        boxGeometry = new THREE.BoxGeometry(this.size, this.size, 1);
        boxMaterial = new THREE.MeshBasicMaterial({
          color: this.colors[this.matrix[i][k]]
        });
        cube = new THREE.Mesh(boxGeometry, boxMaterial);
        sceneRow[k] = cube.id;
        cube.position.set(
          k * this.size + this.size / 2 - offsetX,
          -i * this.size - this.size / 2 + offsetY,
          0
        );
        this.scene.add(cube);
      }
      this.sceneMatrix[i] = sceneRow;
    }

    let lineGrid;
    for (let i = 1; i < this.sides[0]; i++) {
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
    for (let i = 1; i < this.sides[1]; i++) {
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
    let lineBorder = new THREE.Line(lineBorderGeometry, lineBorderMaterial);
    lineBorder.position.set(-offsetX, offsetY, 10);
    this.scene.add(lineBorder);

    this.animate();
  }

  draw() {
    if (changedPixel != null) {
      this.scene
        .getObjectById(this.sceneMatrix[changedPixel.y][changedPixel.x])
        .material.color.set(
          this.colors[this.matrix[changedPixel.y][changedPixel.x]]
        );
      changedPixel = null;
    }

    this.scene
      .getObjectById(this.sceneMatrix[this.previous.y][this.previous.x])
      .material.color.set(
        this.colors[this.matrix[this.previous.y][this.previous.x]]
      );

    this.raycaster.setFromCamera(this.mouse, this.camera);
    let intersects = this.raycaster.intersectObjects(this.scene.children);
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object.type == "Mesh") {
        intersects[i].object.material.color.set(this.highlightColor);
        this.previous = this.getCoordinatesById(intersects[i].object.id);
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

  onMouseDown(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let intersects = this.raycaster.intersectObjects(this.scene.children);
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object.type == "Mesh") {
        this.clicked = intersects[i].object;
        break;
      }
    }
  }

  onMouseClick(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let intersects = this.raycaster.intersectObjects(this.scene.children);
    for (let i = 0; i < intersects.length; i++) {
      let square = intersects[i].object;
      if (square == this.clicked) {
        if (square.type == "Mesh") {
          for (let k = 0; k < this.sides[0]; k++) {
            let index = this.sceneMatrix[k].indexOf(square.id);
            if (index > -1) {
              this.flip(k, index);
              changed3D = { y: k, x: index };
              changedPixel = { y: k, x: index };
              break;
            }
          }
          break;
        }
      }
    }
  }

  onWindowResize() {
    this.setCamera();
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
  }
}
