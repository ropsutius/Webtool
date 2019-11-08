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
  layerOffset = 10;

  constructor(canvas, options) {
    super(canvas, options);

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
    for (let i = 0; i < this.sides[0]; i++) {
      let x, y, z;
      if (this.layers == 1) {
        x = [-this.r * 2, (this.sides[1] - 1) * this.weftLength + this.r * 2];
        y = this.warpHeight / 2;
        z = (i + 1) * this.warpLength;
      } else if (this.layers == 2) {
        x = [-this.r * 2, ((this.sides[1] - 1) * this.weftLength) / 2 + this.r];
        if (i % 2 == 0) {
          y = this.warpHeight / 2;
          z = (i * this.warpLength) / 2 + this.warpLength;
        } else {
          y = (3 / 2) * this.warpHeight + this.layerOffset;
          z = ((i - 1) * this.warpLength) / 2 + this.warpLength;
        }
      }
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
    if (!this.isPrimePoint(coords)) {
      coords = this.getPairPointByCoordinates(coords);
    }
    let object = this.scene.getObjectById(this.getIdByCoordinates(coords));
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

    let prev = this.getPreviousPointByCoordinates(curr);
    if (prev != null) {
      prevA = this.getHeightByCoordinates(prev);
    } else {
      if (curr.x % 2 == 1) {
        prevA = 0;
      } else {
        prevA = 1;
      }
    }

    let prevY, midY, currY;
    if (curr.x % 2 == 1) {
      prevY = this.warpHeight * prevA;
      currY = this.warpHeight * currA;
      if (prevA == 2) {
        prevY += this.layerOffset;
      }
      if (currA == 2) {
        currY += this.layerOffset;
      }
      midY = Math.abs(currY - prevY) / 2 + Math.min(prevY, currY);
    } else {
      prevY = this.warpHeight * prevA + this.layerOffset;
      currY = this.warpHeight * currA + this.layerOffset;
      if (prevA == 0) {
        prevY -= this.layerOffset;
      }
      if (currA == 0) {
        currY -= this.layerOffset;
      }
      midY = Math.abs(currY - prevY) / 2 + Math.min(prevY, currY);
    }

    let x, z;
    if (this.layers == 1) {
      x = curr.x * this.weftLength;
      z = curr.y * this.warpLength;
    } else if (this.layers == 2) {
      if (curr.x % 2 == 0 && curr.y % 2 == 1) {
        x = (curr.x / 2) * this.weftLength;
        z = ((curr.y - 1) / 2) * this.warpLength;
      } else if (curr.x % 2 == 1 && curr.y % 2 == 0) {
        x = ((curr.x - 1) / 2) * this.weftLength;
        z = (curr.y / 2) * this.warpLength;
      }
    }

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

  getHeightByCoordinates(curr) {
    let currA = this.getToggleByCoordinates(curr);
    if (this.layers == 1) {
      return currA;
    } else if (this.layers == 2) {
      let pairA = this.getToggleByCoordinates(
        this.getPairPointByCoordinates(curr)
      );
      if (currA == pairA && currA == 0) {
        return 0;
      } else if (currA == pairA && currA == 1) {
        return 2;
      } else if (
        (curr.y % 2 == 0 && currA == 1 && pairA == 0) ||
        (curr.y % 2 == 1 && currA == 0 && pairA == 1)
      ) {
        return 1;
      } else {
        return null;
      }
    }
  }

  onWindowResize() {
    this.camera.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
  }
}
