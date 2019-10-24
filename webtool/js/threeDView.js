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
  offsetX = (this.sides[1] * this.weftLength) / 2;
  offsetZ = (this.sides[0] * this.warpLength) / 2;
  r = 1;
  tubeSegments = 32;
  radialSegments = 8;
  initialCameraPos = [0, 40, 100];

  constructor(canvas) {
    super(canvas);

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.canvas.offsetWidth / this.canvas.offsetHeight,
      1,
      10000
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
    this.controls.zoomSpeed = 0.4;
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
      let elev = 0;
      let sceneRow = [];

      for (let k = 0; k < this.sides[0]; k++) {
        this.matrix[k][i];
        if (k > 0) {
          curve = this.getWarpPointsByCoordinates(
            { y: k, x: i },
            { y: k - 1, x: i }
          );
        } else {
          curve = this.getWarpPointsByCoordinates({ y: k, x: i }, 0);
        }

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

    for (let i = 0; i < this.sides[0]; i++) {
      let curve = [
        new THREE.Vector3(
          -this.r * 2 - this.offsetX,
          this.warpH[1],
          (i + 1) * this.warpLength - this.offsetZ
        ),
        new THREE.Vector3(
          (this.sides[1] - 1) * this.weftLength - this.offsetX + this.r * 2,
          this.warpH[1],
          (i + 1) * this.warpLength - this.offsetZ
        )
      ];

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
    axesHelper.translateY(40);
    this.scene.add(axesHelper);

    this.camera.position.set(
      this.initialCameraPos[0],
      this.initialCameraPos[1],
      this.offsetZ + this.initialCameraPos[2]
    );

    this.animate();
  }

  draw() {
    if (changed3D != null) {
      let curr = this.scene.getObjectById(
        this.sceneMatrix[changed3D.y][changed3D.x]
      );

      let curve;
      if (changed3D.y > 0) {
        curve = this.getWarpPointsByCoordinates(changed3D, {
          y: changed3D.y - 1,
          x: changed3D.x
        });
      } else {
        curve = this.getWarpPointsByCoordinates(changed3D, 0);
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

      if (changed3D.y + 1 < this.sides[0]) {
        let next = this.scene.getObjectById(
          this.sceneMatrix[changed3D.y + 1][changed3D.x]
        );
        curve = this.getWarpPointsByCoordinates(
          { y: changed3D.y + 1, x: changed3D.x },
          changed3D
        );

        next.geometry.copy(
          new THREE.TubeBufferGeometry(
            new THREE.CatmullRomCurve3(curve),
            this.tubeSegments,
            this.r,
            this.radialSegments,
            false
          )
        );
        next.geometry.needsUpdate = true;
      }

      changed3D = null;
    }
  }

  getWarpPointsByCoordinates(curr, prev) {
    let currA, prevA;
    if (typeof curr == "object") {
      currA = this.matrix[curr.y][curr.x];
    } else {
      currA = curr;
    }
    if (typeof prev == "object") {
      prevA = this.matrix[prev.y][prev.x];
    } else {
      prevA = prev;
    }

    let curve;
    let x = curr.x * this.weftLength - this.offsetX;
    let z = curr.y * this.warpLength - this.offsetZ;

    if (prevA == 0 && currA == 0) {
      curve = [
        new THREE.Vector3(x, this.warpH[0], this.warp[0] + z),
        new THREE.Vector3(x, this.warpH[0], this.warp[2] + z),
        new THREE.Vector3(x, this.warpH[0], this.warp[4] + z)
      ];
    } else if (prevA == 1 && currA == 0) {
      curve = [
        new THREE.Vector3(x, this.warpH[2], this.warp[0] + z),
        new THREE.Vector3(x, this.warpH[2], this.warp[1] + z),
        new THREE.Vector3(x, this.warpH[1], this.warp[2] + z),
        new THREE.Vector3(x, this.warpH[0], this.warp[3] + z),
        new THREE.Vector3(x, this.warpH[0], this.warp[4] + z)
      ];
    } else if (prevA == 0 && currA == 1) {
      curve = [
        new THREE.Vector3(x, this.warpH[0], this.warp[0] + z),
        new THREE.Vector3(x, this.warpH[0], this.warp[1] + z),
        new THREE.Vector3(x, this.warpH[1], this.warp[2] + z),
        new THREE.Vector3(x, this.warpH[2], this.warp[3] + z),
        new THREE.Vector3(x, this.warpH[2], this.warp[4] + z)
      ];
    } else if (prevA == 1 && currA == 1) {
      curve = [
        new THREE.Vector3(x, this.warpH[2], this.warp[0] + z),
        new THREE.Vector3(x, this.warpH[2], this.warp[2] + z),
        new THREE.Vector3(x, this.warpH[2], this.warp[4] + z)
      ];
    }

    return curve;
  }

  onWindowResize() {
    this.camera.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
  }
}
