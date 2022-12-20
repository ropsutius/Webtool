class ThreeDView extends View {
  warpColor = 0x4444ff;
  weftColor = 0x77cc77;
  lightColor = 0x404040;
  warpLength = 4;
  weftLength = 2;
  warpHeight = 3;
  warp = [
    0,
    this.warpLength / 4,
    this.warpLength / 2,
    (3 * this.warpLength) / 4,
    this.warpLength
  ];
  r = 1;
  tubeSegments = 32;
  radialSegments = 8;
  layerOffset = 5;

  constructor(app, canvas) {
    super(app, canvas);

    this.initControls();
    this.initWeave();
  }

  initControls() {
    this.initCameraPos = {
      x: (this.matrix.x * this.weftLength) / 2 / this.app.layers,
      y: 0,
      z: (this.matrix.y * this.warpLength) / 2 / this.app.layers
    };
    this.cameraOffset = {
      x: 0,
      y: this.warpHeight * this.app.layers * 10,
      z: this.matrix.y * this.warpLength
    };

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.canvas.offsetWidth / this.canvas.offsetHeight,
      1,
      10000
    );
    this.camera.position.set(
      this.initCameraPos.x + this.cameraOffset.x,
      this.initCameraPos.y + this.cameraOffset.y,
      this.initCameraPos.z + this.cameraOffset.z
    );

    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.minDistance = 25;
    this.controls.maxDistance = 1000;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.ROTATE
    };
    this.controls.zoomSpeed = 0.6;
    this.controls.target = new THREE.Vector3(
      this.initCameraPos.x,
      this.initCameraPos.y,
      this.initCameraPos.z
    );
  }

  initWeave() {
    let light = new THREE.HemisphereLight(this.lightColor);
    light.position.y = -10;
    this.scene.add(light);

    let curve;
    for (let i = 0; i < this.matrix.x; i++) {
      for (let k = 0; k < this.matrix.y; k++) {
        if (i == 0) {
          this.sceneMatrix[k] = [];
        }
        if (!this.isPrimePoint({ y: k, x: i })) {
          continue;
        }
        curve = this.getWarpPoints({ y: k, x: i });
        let id = this.addTubeToScene(curve, "Warp");
        this.sceneMatrix[k][i] = id;
      }
    }

    for (curve of this.getWeftPoints()) {
      this.addTubeToScene(curve, "Weft");
    }

    let axesHelper = new THREE.AxesHelper(5);
    axesHelper.translateY(this.app.layers * this.layerOffset + 10);
    this.scene.add(axesHelper);

    this.animate();
  }

  *getWeftPoints() {
    let x, y, z;
    for (let i = 0; i < this.matrix.y; i++) {
      x = [
        -this.r * 2,
        ((this.matrix.x - 1) * this.weftLength) / this.app.layers + this.r
      ];
      y =
        this.warpHeight * (i % this.app.layers) +
        this.warpHeight / 2 +
        (i % this.app.layers) * this.layerOffset;
      z =
        ((i - (i % this.app.layers)) / this.app.layers) * this.warpLength +
        this.warpLength;
      yield [new THREE.Vector3(x[0], y, z), new THREE.Vector3(x[1], y, z)];
    }
  }

  addTubeToScene(curve, type) {
    let color;
    if (type == "Weft") {
      color = this.weftColor;
    } else if (type == "Warp") {
      color = this.warpColor;
    }
    if (curve == null) {
      curve = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
      type = "Warp";
    }
    let tube = new THREE.TubeBufferGeometry(
      new THREE.CatmullRomCurve3(curve),
      this.tubeSegments,
      this.r,
      this.radialSegments,
      false
    );
    let material = new THREE.MeshLambertMaterial({ color: color });
    let mesh = new THREE.Mesh(tube, material);
    if (curve == null) {
      mesh.visible = false;
    }
    mesh.name = type;
    this.scene.add(mesh);
    return mesh.id;
  }

  updateTube(coords) {
    coords = this.getPrimePoint(coords);
    let object = this.scene.getObjectById(this.getId(coords));
    let curve = this.getWarpPoints(coords);
    if (curve != null) {
      object.geometry.copy(
        new THREE.TubeBufferGeometry(
          new THREE.CatmullRomCurve3(curve),
          this.tubeSegments,
          this.r,
          this.radialSegments,
          false
        )
      );
      object.geometry.needsUpdate = true;
    }
  }

  resetTubeColor(coords) {
    this.scene
      .getObjectById(this.getId(coords))
      .material.color.set(this.warpColor);
  }

  draw() {
    for (let i = 0; i < this.app.changed3D.length; i++) {
      this.updateTube(this.app.changed3D[i]);

      let next = this.getNextSet(this.app.changed3D[i]);
      if (next != null) {
        this.updateTube(next);
      }
    }
    this.app.changed3D = [];

    for (let i = 0; i < this.previous.length; i++) {
      this.resetTubeColor(this.previous[i]);
    }
    this.previous = [];

    let intersects = this.getSetByMouse();
    for (let i = 0; i < intersects.length; i++) {
      let curr = intersects[i].object;
      if (curr.name == "Warp") {
        let currC = this.getCoordinatesById(curr.id);
        let nextC = this.getNextSet(currC);
        if (nextC != null) {
          let next = this.scene.getObjectById(this.getId(nextC));
          next.material.color.set(this.highlightColor[1]);
          this.previous.push(nextC);
        }

        curr.material.color.set(this.highlightColor[1]);
        this.previous.push(currC);
        break;
      }
    }
  }

  getWarpPoints(curr) {
    let prevA;
    let currA = this.getHeight(curr);
    if (currA == null) {
      return null;
    }

    let prev = this.getPreviousSet(curr);
    if (prev != null) {
      prevA = this.getHeight(prev);
    } else {
      prevA = this.app.layers - (curr.x % this.app.layers) - 1;
    }
    let warp = this.app.layers - (curr.x % this.app.layers) - 1;
    let prevY = this.warpHeight * prevA + warp * this.layerOffset;
    let currY = this.warpHeight * currA + warp * this.layerOffset;

    if (currA < warp) {
      currY -= (warp - currA) * this.layerOffset;
    } else if (currA > warp + 1) {
      currY += (currA - warp - 1) * this.layerOffset;
    }

    if (prevA < warp) {
      prevY -= (warp - prevA) * this.layerOffset;
    } else if (prevA > warp + 1) {
      prevY += (prevA - warp - 1) * this.layerOffset;
    }

    let midY = Math.abs(currY - prevY) / 2 + Math.min(prevY, currY);
    let x =
      ((curr.x - (curr.x % this.app.layers)) / this.app.layers) *
      this.weftLength;
    let z =
      ((curr.y - (curr.y % this.app.layers)) / this.app.layers) *
      this.warpLength;

    return [
      new THREE.Vector3(x, prevY, this.warp[0] + z),
      new THREE.Vector3(x, prevY, this.warp[1] + z),
      new THREE.Vector3(x, midY, this.warp[2] + z),
      new THREE.Vector3(x, currY, this.warp[3] + z),
      new THREE.Vector3(x, currY, this.warp[4] + z)
    ];
  }

  onMouseDown(event) {
    let intersects = this.getSetByMouse();
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object.type == "Mesh") {
        this.clicked = intersects[i].object;
        break;
      }
    }
  }

  onMouseClick(event) {
    let intersects = this.getSetByMouse();
    for (let i = 0; i < intersects.length; i++) {
      let curr = intersects[i].object;
      if (curr == this.clicked && curr.type == "Mesh") {
        this.rotateToggle(this.getCoordinatesById(curr.id));
        break;
      }
    }
  }

  updateControls() {
    this.controls.update();
  }

  onWindowResize() {
    this.camera.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
  }

  reset(options, matrix = []) {
    this.previous = [];

    this.disposeHierarchy(this.scene);
    this.scene.dispose();
    this.renderer.renderLists.dispose();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.backgroundColor);

    this.initControls();
    this.initWeave();
  }
}
