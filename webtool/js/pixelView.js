class PixelView extends View {
  clicked = false;
  singleColors = [0xffffff, 0x303030];
  doubleColors = [
    [0xffffdd, 0x303030],
    [0xffdddd, 0x303030],
    [0xddddff, 0x303030],
    [0xddffdd, 0x303030]
  ];
  tripleColors = [
    [0xffffdd, 0x303030],
    [0xffdddd, 0x303030],
    [0xddddff, 0x303030],
    [0xddffdd, 0x303030],
    [0xffffdd, 0x303030],
    [0xffdddd, 0x303030],
    [0xddddff, 0x303030],
    [0xffffdd, 0x303030],
    [0xffdddd, 0x303030]
  ];
  lineColor = 0x000000;
  highlightColor = 0xcc4444;
  lineWidth = 1;
  size = 10;
  camFactor = 3;
  previous = { y: 0, x: 0 };
  initCameraPos = {
    x: (this.sides[1] * this.size) / 2,
    y: -(this.sides[0] * this.size) / 2,
    z: 100
  };

  constructor(canvas, options) {
    super(canvas, options);

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
    let boxGeometry, boxMaterial;
    let lineGridGeometry, lineGridMaterial;
    let lineBorderGeometry, lineBorderMaterial;

    let cube;
    for (let i = 0; i < this.sides[0]; i++) {
      let sceneRow = [];
      for (let k = 0; k < this.sides[1]; k++) {
        sceneRow[k] = this.addPixelToSceneByCoordinates({ y: i, x: k });
      }
      this.sceneMatrix[i] = sceneRow;
    }

    let lineGrid;
    for (let i = 1; i < this.sides[0]; i++) {
      this.addLineToSceneByPosition(i, this.lineWidth);
    }
    for (let i = 1; i < this.sides[1]; i++) {
      this.addLineToSceneByPosition(i, this.lineWidth, "Vertical");
    }

    this.addLineToSceneByPosition(0, this.lineWidth * 5);
    this.addLineToSceneByPosition(this.sides[0], this.lineWidth * 5);
    this.addLineToSceneByPosition(0, this.lineWidth * 5, "Vertical");
    this.addLineToSceneByPosition(
      this.sides[1],
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
        new THREE.Vector3(this.size * this.sides[1], 0, 0)
      );
    } else if (dir == "Vertical") {
      geometry.vertices.push(
        new THREE.Vector3(0, -this.size * this.sides[0], 0)
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

  addPixelToSceneByCoordinates(coords) {
    let boxGeometry = new THREE.BoxGeometry(this.size, this.size, 1);
    let boxMaterial, color;
    boxMaterial = new THREE.MeshBasicMaterial({
      color: this.getColorByCoordinates(coords)
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
    if (changedPixel != null) {
      this.updatePixelByCoordinates(changedPixel);
      changedPixel = null;
    }

    this.updatePixelByCoordinates(this.previous);

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

  updatePixelByCoordinates(coords) {
    this.scene
      .getObjectById(this.getIdByCoordinates(coords))
      .material.color.set(this.getColorByCoordinates(coords));
  }

  getMaterial(options) {
    if (options.Material == "Mesh") {
      return new THREE.MeshBasicMaterial({ color: options.Color });
    } else if (options.Material == "Line") {
      return new THREE.LineBasicMaterial({ color: options.Color });
    }
  }

  getColorById(id) {
    return this.getColorByCoordinates(this.getCoordinatesById(id));
  }

  getColorByCoordinates(coords) {
    if (this.layers == 1) {
      return this.singleColors[this.getToggleByCoordinates(coords)];
    } else if (this.layers == 2) {
      if (coords.x % 2 == 0 && coords.y % 2 == 0) {
        return this.doubleColors[0][this.matrix[coords.y][coords.x]];
      } else if (coords.x % 2 == 1 && coords.y % 2 == 0) {
        return this.doubleColors[1][this.matrix[coords.y][coords.x]];
      } else if (coords.x % 2 == 0 && coords.y % 2 == 1) {
        return this.doubleColors[2][this.matrix[coords.y][coords.x]];
      } else if (coords.x % 2 == 1 && coords.y % 2 == 1) {
        return this.doubleColors[3][this.matrix[coords.y][coords.x]];
      }
    } else if (this.layers == 3) {
      if (coords.x % 3 == 0 && coords.y % 3 == 0) {
        return this.tripleColors[0][this.getToggleByCoordinates(coords)];
      } else if (coords.x % 3 == 1 && coords.y % 3 == 0) {
        return this.tripleColors[0][this.getToggleByCoordinates(coords)];
      } else if (coords.x % 3 == 2 && coords.y % 3 == 0) {
        return this.tripleColors[0][this.getToggleByCoordinates(coords)];
      } else if (coords.x % 3 == 0 && coords.y % 3 == 1) {
        return this.tripleColors[0][this.getToggleByCoordinates(coords)];
      } else if (coords.x % 3 == 1 && coords.y % 3 == 1) {
        return this.tripleColors[0][this.getToggleByCoordinates(coords)];
      } else if (coords.x % 3 == 2 && coords.y % 3 == 1) {
        return this.tripleColors[0][this.getToggleByCoordinates(coords)];
      } else if (coords.x % 3 == 0 && coords.y % 3 == 2) {
        return this.tripleColors[0][this.getToggleByCoordinates(coords)];
      } else if (coords.x % 3 == 1 && coords.y % 3 == 2) {
        return this.tripleColors[0][this.getToggleByCoordinates(coords)];
      } else if (coords.x % 3 == 2 && coords.y % 3 == 2) {
        return this.tripleColors[0][this.getToggleByCoordinates(coords)];
      }
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
      let square = intersects[i].object;
      if (square == this.clicked && square.type == "Mesh") {
        for (let k = 0; k < this.sides[0]; k++) {
          let index = this.sceneMatrix[k].indexOf(square.id);
          if (index > -1) {
            this.toggleByCoordinates({ y: k, x: index });
            break;
          }
        }
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

  reset() {
    this.sceneMatrix = [];
    this.clicked = false;
    this.previous = { x: 0, y: 0 };

    this.scene.dispose();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.backgroundColor);
    this.matrix = matrix;
    this.initGrid();
  }
}
