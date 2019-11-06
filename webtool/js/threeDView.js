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
  warpH = [0, this.warpHeight / 2, this.warpHeight];
  r = 1;
  tubeSegments = 32;
  radialSegments = 8;
  initialCameraPos = [0, 40, 100];
  layerOffset = this.r;

  constructor(canvas, options) {
    super(canvas, options);

    if (this.layers == 1) {
      this.offsetX = (this.sides[1] * this.weftLength) / 2;
      this.offsetZ = (this.sides[0] * this.warpLength) / 2;
    } else if (this.layers == 2) {
      this.offsetX = (this.sides[1] * this.weftLength) / 4;
      this.offsetZ = (this.sides[0] * this.warpLength) / 4;
    }

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.canvas.offsetWidth / this.canvas.offsetHeight,
      1,
      10000
    );

    this.camera.position.set(
      this.offsetX + this.initialCameraPos[0],
      this.initialCameraPos[1],
      this.offsetZ + this.initialCameraPos[2]
    );

    this.initControls();
    this.initWeave();
  }

  initControls() {
    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.minDistance = 50;
    this.controls.maxDistance = 1000;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.ROTATE
    };
    this.controls.zoomSpeed = 0.6;
    this.controls.target = new THREE.Vector3(this.offsetX, 0, this.offsetZ);
  }

  initWeave() {
    let light = new THREE.HemisphereLight(this.lightColor);
    light.position.y = -10;
    this.scene.add(light);

    for (let i = 0; i < this.sides[0]; i++) {
      this.sceneMatrix[i] = [];
    }

    let curve;
    for (let i = 0; i < this.sides[1]; i++) {
      for (let k = 0; k < this.sides[0]; k++) {
        if (
          ((i % 2 == 0 && k % 2 == 0) || (i % 2 == 1 && k % 2 == 1)) &&
          this.layers == 2
        ) {
          continue;
        }
        curve = this.getWarpPointsByCoordinates({ y: k, x: i });

        let tube = new THREE.TubeBufferGeometry(
          new THREE.CatmullRomCurve3(curve),
          this.tubeSegments,
          this.r,
          this.radialSegments,
          false
        );

        let warpMaterial = new THREE.MeshLambertMaterial({
          color: this.warpColor
        });

        let mesh = new THREE.Mesh(tube, warpMaterial);
        this.sceneMatrix[k][i] = mesh.id;
        this.scene.add(mesh);
      }
    }

    for (curve of this.weftPoints()) {
      let tube = new THREE.TubeBufferGeometry(
        new THREE.CatmullRomCurve3(curve),
        this.tubeSegments,
        this.r,
        this.radialSegments,
        false
      );

      let weftMaterial = new THREE.MeshLambertMaterial({
        color: this.weftColor
      });

      let mesh = new THREE.Mesh(tube, weftMaterial);
      this.scene.add(mesh);
    }

    let axesHelper = new THREE.AxesHelper(5);
    axesHelper.translateY(10);
    this.scene.add(axesHelper);

    this.animate();
  }

  *weftPoints() {
    for (let i = 0; i < this.sides[0]; i++) {
      if (this.layers == 1) {
        yield [
          new THREE.Vector3(
            -this.r * 2,
            this.warpH[1],
            (i + 1) * this.warpLength
          ),
          new THREE.Vector3(
            (this.sides[1] - 1) * this.weftLength + this.r * 2,
            this.warpH[1],
            (i + 1) * this.warpLength
          )
        ];
      } else if (this.layers == 2) {
        if (i % 2 == 0) {
          yield [
            new THREE.Vector3(
              -this.r * 2,
              this.warpH[1],
              (i * this.warpLength) / 2 + this.warpLength
            ),
            new THREE.Vector3(
              ((this.sides[1] - 1) * this.weftLength) / 2 + this.r,
              this.warpH[1],
              (i * this.warpLength) / 2 + this.warpLength
            )
          ];
        } else {
          yield [
            new THREE.Vector3(
              -this.r * 2,
              -this.warpH[1],
              ((i - 1) * this.warpLength) / 2 + this.warpLength
            ),
            new THREE.Vector3(
              ((this.sides[1] - 1) * this.weftLength) / 2 + this.r,
              -this.warpH[1],
              ((i - 1) * this.warpLength) / 2 + this.warpLength
            )
          ];
        }
      }
    }
  }

  draw() {
    if (changed3D != null) {
      let curr = this.scene.getObjectById(
        this.sceneMatrix[changed3D.y][changed3D.x]
      );
      if (curr !== undefined) {
        let curve;
        if (changed3D.y > 0) {
          curve = this.getWarpPointsByCoordinates(changed3D);
        } else {
          curve = this.getWarpPointsByCoordinates(changed3D);
        }

        curr.geometry.copy(
          new THREE.TubeBufferGeometry(
            new THREE.CatmullRomCurve3(curve),
            this.tubeSegments,
            this.r,
            this.radialSegments,
            false
          )
        );
        curr.geometry.needsUpdate = true;
      }

      let next = this.getNextPoint(changed3D);
      if (next != null) {
        let nextObject = this.scene.getObjectById(
          this.getIdByCoordinates(next)
        );
        if (nextObject !== undefined) {
          let curve = this.getWarpPointsByCoordinates(next);

          nextObject.geometry.copy(
            new THREE.TubeBufferGeometry(
              new THREE.CatmullRomCurve3(curve),
              this.tubeSegments,
              this.r,
              this.radialSegments,
              false
            )
          );
          nextObject.geometry.needsUpdate = true;
        }
      }

      changed3D = null;
    }
  }

  getWarpPointsByCoordinates(curr) {
    let currA, prevA, prev;
    if (typeof curr == "object") {
      currA = this.matrix[curr.y][curr.x];
      prev = this.getPreviousPoint(curr);
      if (prev != null) {
        prevA = this.matrix[prev.y][prev.x];
      } else {
        prevA = 0;
      }
    } else {
      currA = curr;
    }

    let x, y, z;
    if (this.layers == 1) {
      x = curr.x * this.weftLength;
      y = 0;
      z = curr.y * this.warpLength;
    } else if (this.layers == 2) {
      if (curr.x % 2 == 0 && curr.y % 2 == 1) {
        x = (curr.x / 2) * this.weftLength;
        y = 0;
        z = ((curr.y - 1) / 2) * this.warpLength;
      } else if (curr.x % 2 == 1 && curr.y % 2 == 0) {
        x = ((curr.x - 1) / 2) * this.weftLength;
        y = -this.warpHeight - this.layerOffset;
        z = (curr.y / 2) * this.warpLength;
      }
    }

    if (prevA == 0 && currA == 0) {
      return [
        new THREE.Vector3(x, this.warpH[0] + y, this.warp[0] + z),
        new THREE.Vector3(x, this.warpH[0] + y, this.warp[2] + z),
        new THREE.Vector3(x, this.warpH[0] + y, this.warp[4] + z)
      ];
    } else if (prevA == 1 && currA == 0) {
      return [
        new THREE.Vector3(x, this.warpH[2] + y, this.warp[0] + z),
        new THREE.Vector3(x, this.warpH[2] + y, this.warp[1] + z),
        new THREE.Vector3(x, this.warpH[1] + y, this.warp[2] + z),
        new THREE.Vector3(x, this.warpH[0] + y, this.warp[3] + z),
        new THREE.Vector3(x, this.warpH[0] + y, this.warp[4] + z)
      ];
    } else if (prevA == 0 && currA == 1) {
      return [
        new THREE.Vector3(x, this.warpH[0] + y, this.warp[0] + z),
        new THREE.Vector3(x, this.warpH[0] + y, this.warp[1] + z),
        new THREE.Vector3(x, this.warpH[1] + y, this.warp[2] + z),
        new THREE.Vector3(x, this.warpH[2] + y, this.warp[3] + z),
        new THREE.Vector3(x, this.warpH[2] + y, this.warp[4] + z)
      ];
    } else if (prevA == 1 && currA == 1) {
      return [
        new THREE.Vector3(x, this.warpH[2] + y, this.warp[0] + z),
        new THREE.Vector3(x, this.warpH[2] + y, this.warp[2] + z),
        new THREE.Vector3(x, this.warpH[2] + y, this.warp[4] + z)
      ];
    }
  }

  getPreviousPoint(curr) {
    if (this.layers == 1) {
      if (curr.y == 0) {
        return null;
      } else {
        return { x: curr.x, y: curr.y - 1 };
      }
    } else if (this.layers == 2) {
      if (curr.y == 0 || curr.y == 1) {
        return null;
      } else {
        return { x: curr.x, y: curr.y - 2 };
      }
    }
  }

  getNextPoint(curr) {
    if (this.layers == 1) {
      if (curr.y == this.sides[0]) {
        return null;
      } else {
        return { x: curr.x, y: curr.y + 1 };
      }
    } else if (this.layers == 2) {
      if (curr.y == this.sides[0] - 1 || curr.y == this.sides[0] - 2) {
        return null;
      } else {
        return { x: curr.x, y: curr.y + 2 };
      }
    }
  }

  onWindowResize() {
    this.camera.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
  }
}
