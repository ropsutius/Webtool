class PixelView extends View {
  canvasColors = [
    0xffffdd,
    0xffdddd,
    0xddddff,
    0xddffdd,
    0xddffff,
    0xffddff,
    0x303030
  ];
  pixelColors = [];
  lineColor = 0x000000;
  lineWidth = 1;
  size = 10;
  camFactor = 3;

  constructor(canvas, options) {
    super(canvas, options);

    this.canvas.addEventListener(
      "mousedown",
      this.onMouseDown.bind(this),
      false
    );
    this.canvas.addEventListener("click", this.onMouseClick.bind(this), false);

    this.initPixelColors();
    this.initControls();
    this.initGrid();
  }

  initPixelColors() {
    if (this.layers == 1) {
      this.pixelColors = [
        [[0xffffff, 0x303030], [0xffffff, 0x303030]],
        [[0xffffff, 0x303030], [0xffffff, 0x303030]]
      ];
      return;
    }
    this.pixelColors = [[], []];
    for (let i = 0; i < (this.layers - (this.layers % 2)) / 2; i++) {
      this.pixelColors[0].push([this.canvasColors[0], this.canvasColors[6]]);
      this.pixelColors[0].push([this.canvasColors[1], this.canvasColors[6]]);
      this.pixelColors[1].push([this.canvasColors[2], this.canvasColors[6]]);
      this.pixelColors[1].push([this.canvasColors[3], this.canvasColors[6]]);
    }
    if (this.layers % 2 == 1) {
      this.pixelColors[0].push([this.canvasColors[4], this.canvasColors[6]]);
      this.pixelColors[1].push([this.canvasColors[5], this.canvasColors[6]]);
    }
  }

  initControls() {
    this.initCameraPos = {
      x: (this.matrix.x * this.size) / 2,
      y: -(this.matrix.y * this.size) / 2,
      z: 100
    };
    this.camera = new THREE.OrthographicCamera(
      this.canvas.offsetWidth / -this.camFactor,
      this.canvas.offsetWidth / this.camFactor,
      this.canvas.offsetHeight / this.camFactor,
      this.canvas.offsetHeight / -this.camFactor,
      1,
      10000
    );
    this.camera.position.set(
      this.initCameraPos.x,
      this.initCameraPos.y,
      this.initCameraPos.z
    );

    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.enableRotate = false;
    this.controls.screenSpacePanning = true;
    this.controls.minZoom = 0.2;
    this.controls.maxZoom = 2;
    this.controls.mouseButtons = {
      RIGHT: THREE.MOUSE.PAN
    };
    this.controls.target = new THREE.Vector3(
      this.initCameraPos.x,
      this.initCameraPos.y,
      0
    );
  }

  initGrid() {
    let cube, id, point;
    for (let i = 0; i < this.matrix.y; i++) {
      let sceneRow = [];
      for (let k = 0; k < this.matrix.x; k++) {
        point = { y: i, x: k };
        id = this.addPixelToScene(point);
        this.matrix.addIdToSceneMatrix(point, id);
      }
    }

    let lineGrid;
    for (let i = 1; i < this.matrix.y; i++) {
      this.addLineToSceneByPosition(i, this.lineWidth);
    }
    for (let i = 1; i < this.matrix.x; i++) {
      this.addLineToSceneByPosition(i, this.lineWidth, "Vertical");
    }

    this.addLineToSceneByPosition(0, this.lineWidth * 5);
    this.addLineToSceneByPosition(this.matrix.y, this.lineWidth * 5);
    this.addLineToSceneByPosition(0, this.lineWidth * 5, "Vertical");
    this.addLineToSceneByPosition(
      this.matrix.x,
      this.lineWidth * 5,
      "Vertical"
    );

    this.animate();
  }

  addLineToSceneByPosition(pos, thickness, dir = "Horizontal") {
    let geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    if (dir == "Horizontal") {
      geometry.vertices.push(
        new THREE.Vector3(this.size * this.matrix.x, 0, 0)
      );
    } else if (dir == "Vertical") {
      geometry.vertices.push(
        new THREE.Vector3(0, -this.size * this.matrix.y, 0)
      );
    }

    let material = new THREE.LineBasicMaterial({
      color: this.lineColor,
      linewidth: thickness
    });
    let line = new THREE.Line(geometry, material);
    if (dir == "Horizontal") {
      line.position.set(0, -pos * this.size, 10);
    } else if (dir == "Vertical") {
      line.position.set(pos * this.size, 0, 10);
    }
    this.scene.add(line);
  }

  addPixelToScene(coords) {
    let boxGeometry = new THREE.BoxGeometry(this.size, this.size, 1);
    let boxMaterial, color;
    boxMaterial = new THREE.MeshBasicMaterial({
      color: this.getPixelColor(coords)
    });
    let cube = new THREE.Mesh(boxGeometry, boxMaterial);
    cube.position.set(
      coords.x * this.size + this.size / 2,
      -coords.y * this.size - this.size / 2,
      0
    );
    this.scene.add(cube);
    return cube.id;
  }

  draw() {
    for (let i = 0; i < changedPixel.length; i++) {
      this.updatePixel(changedPixel[i]);
    }
    changedPixel = [];
    for (let i = 0; i < this.previous.length; i++) {
      this.updatePixel(this.previous[i]);
    }
    this.previous = [];

    let intersects = this.getSetByMouse();

    for (let i = 0; i < intersects.length; i++) {
      let curr = intersects[i].object;
      if (curr.type == "Mesh") {
        curr.material.color.set(
          this.highlightColor[this.matrix.getToggleById(curr.id)]
        );
        this.previous.push(this.matrix.getCoordinatesById(curr.id));
        break;
      }
    }
  }

  updatePixel(coords) {
    this.scene
      .getObjectById(this.matrix.getId(coords))
      .material.color.set(this.getPixelColor(coords));
  }

  getMaterial(options) {
    if (options.Material == "Mesh") {
      return new THREE.MeshBasicMaterial({ color: options.Color });
    } else if (options.Material == "Line") {
      return new THREE.LineBasicMaterial({ color: options.Color });
    }
  }

  getPixelColorById(id) {
    return this.getPixelColor(this.matrix.getCoordinatesById(id));
  }

  getPixelColor(coords) {
    if (coords.y % this.layers < coords.y % (this.layers * 2)) {
      return this.pixelColors[1][coords.x % this.layers][
        this.matrix.getToggle(coords)
      ];
    } else {
      return this.pixelColors[0][coords.x % this.layers][
        this.matrix.getToggle(coords)
      ];
    }
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
      let curr = intersects[i].object;
      if (curr == this.clicked && curr.type == "Mesh") {
        this.rotateToggle(this.matrix.getCoordinatesById(curr.id));
        break;
      }
    }
  }

  onWindowResize() {
    this.camera.left = -this.canvas.offsetWidth / this.camFactor;
    this.camera.right = this.canvas.offsetWidth / this.camFactor;
    this.camera.top = this.canvas.offsetHeight / this.camFactor;
    this.camera.bottom = -this.canvas.offsetHeight / this.camFactor;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
  }

  reset(options, matrix) {
    this.layers = options.Layers;
    this.previous = [];

    this.disposeHierarchy(this.scene);
    this.scene.dispose();
    this.renderer.renderLists.dispose();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.backgroundColor);

    this.matrix.reset(options, matrix);

    this.initPixelColors();
    this.initControls();
    this.initGrid();
  }
}
