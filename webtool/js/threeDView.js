class ThreeDView extends View {
  warpColor = 0x4444ff;
  weftColor = 0x77cc77;
  highlightColor = 0xcc4444;
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
  initCameraPos = {
    x: (this.sides[1] * this.weftLength) / 2 / this.layers,
    y: 0,
    z: (this.sides[0] * this.warpLength) / 2 / this.layers
  };
  cameraOffset = {
    x: 0,
    y: this.warpHeight * this.layers * 10,
    z: this.sides[0] * this.warpLength
  };
  defaultLayerOffset = 5;

  constructor(canvas, options) {
    super(canvas, options);

    if (options.Layers == 1) {
      this.layerOffset = 0;
    } else {
      this.layerOffset = this.defaultLayerOffset;
    }

    this.initControls();
    this.initWeave();
  }

  initControls() {
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
    for (let i = 0; i < this.sides[1]; i++) {
      for (let k = 0; k < this.sides[0]; k++) {
        if (i == 0) {
          this.sceneMatrix[k] = [];
        }
        if (!this.isPrimePoint({ y: k, x: i })) {
          continue;
        }
        curve = this.getWarpPointsByCoordinates({ y: k, x: i });
        let id = this.addTubeToScene(curve, "Warp");
        this.sceneMatrix[k][i] = id;
      }
    }

    for (curve of this.getWeftPoints()) {
      this.addTubeToScene(curve, "Weft");
    }

    let axesHelper = new THREE.AxesHelper(5);
    axesHelper.translateY(10 + this.layerOffset);
    this.scene.add(axesHelper);

    this.animate();
  }

  *getWeftPoints() {
    let x, y, z;
    for (let i = 0; i < this.sides[0]; i++) {
      x = [
        -this.r * 2,
        ((this.sides[1] - 1) * this.weftLength) / this.layers + this.r
      ];
      y =
        this.warpHeight * (i % this.layers) +
        this.warpHeight / 2 +
        (i % this.layers) * this.layerOffset;
      z =
        ((i - (i % this.layers)) / this.layers) * this.warpLength +
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
    } else return null;

    let tube = new THREE.TubeBufferGeometry(
      new THREE.CatmullRomCurve3(curve),
      this.tubeSegments,
      this.r,
      this.radialSegments,
      false
    );
    let material = new THREE.MeshLambertMaterial({ color: color });
    let mesh = new THREE.Mesh(tube, material);
    this.scene.add(mesh);
    return mesh.id;
  }

  updateTubeByCoordinates(coords) {
    let object = this.scene.getObjectById(
      this.getIdByCoordinates(this.getPrimePoint(coords))
    );
    let curve = this.getWarpPointsByCoordinates(coords);
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

  draw() {
    if (changed3D != null) {
      this.updateTubeByCoordinates(changed3D);

      let next = this.getNextPointByCoordinates(changed3D);
      if (next != null) {
        this.updateTubeByCoordinates(next);
      }
      changed3D = null;
    }
  }

  getWarpPointsByCoordinates(curr) {
    let prevA;
    let currA = this.getHeightByCoordinates(curr);
    if (currA == null) {
      return null;
    }

    let prev = this.getPreviousPointByCoordinates(curr);
    if (prev != null) {
      prevA = this.getHeightByCoordinates(prev);
    } else {
      prevA = this.layers - (curr.x % this.layers) - 1;
    }

    // let prevY, currY;
    // if (curr.x % 2 == 1) {
    //   prevY = this.warpHeight * prevA;
    //   currY = this.warpHeight * currA;
    //   if (prevA == 2) {
    //     prevY += this.layerOffset;
    //   }
    //   if (currA == 2) {
    //     currY += this.layerOffset;
    //   }
    //   midY = Math.abs(currY - prevY) / 2 + Math.min(prevY, currY);
    // } else {
    //   prevY = this.warpHeight * prevA + this.layerOffset;
    //   currY = this.warpHeight * currA + this.layerOffset;
    //   if (prevA == 0) {
    //     prevY -= this.layerOffset;
    //   }
    //   if (currA == 0) {
    //     currY -= this.layerOffset;
    //   }
    // }

    let prevY =
      this.warpHeight * prevA +
      (this.layers - (curr.x % this.layers) - 1) * this.layerOffset;
    let currY =
      this.warpHeight * currA +
      (this.layers - (curr.x % this.layers) - 1) * this.layerOffset;
    if (currA < this.layers - (curr.x % this.layers) - 1) {
      currY -=
        (this.layers - (curr.x % this.layers) - 1 - currA) * this.layerOffset;
    } else if (currA > this.layers - (curr.x % this.layers)) {
      currY -=
        (currA - this.layers - (curr.x % this.layers)) * this.layerOffset;
    }
    if (prevA < this.layers - (curr.x % this.layers) - 1) {
      prevY -=
        (this.layers - (curr.x % this.layers) - 1 - prevA) * this.layerOffset;
    } else if (prevA > this.layers - (curr.x % this.layers)) {
      prevY -=
        (prevA - this.layers - (curr.x % this.layers)) * this.layerOffset;
    }
    let midY = Math.abs(currY - prevY) / 2 + Math.min(prevY, currY);
    let x = ((curr.x - (curr.x % this.layers)) / this.layers) * this.weftLength;
    let z = ((curr.y - (curr.y % this.layers)) / this.layers) * this.warpLength;

    if (prevA == currA) {
      return [
        new THREE.Vector3(x, currY, this.warp[0] + z),
        new THREE.Vector3(x, currY, this.warp[2] + z),
        new THREE.Vector3(x, currY, this.warp[4] + z)
      ];
    } else if (prevA != currA) {
      return [
        new THREE.Vector3(x, prevY, this.warp[0] + z),
        new THREE.Vector3(x, prevY, this.warp[1] + z),
        new THREE.Vector3(x, midY, this.warp[2] + z),
        new THREE.Vector3(x, currY, this.warp[3] + z),
        new THREE.Vector3(x, currY, this.warp[4] + z)
      ];
    }
  }

  onWindowResize() {
    this.camera.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
  }

  reset() {
    this.sceneMatrix = [];
    this.scene.dispose();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.backgroundColor);
    this.matrix = matrix;
    if (this.layers == 1) {
      this.layerOffset = 0;
    } else {
      this.layerOffset = this.defaultLayerOffset;
    }
    this.initWeave();
  }
}
