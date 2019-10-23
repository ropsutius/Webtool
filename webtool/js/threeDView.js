class ThreeDView extends View {
  warpColor = 0x4444ff;
  weftColor = 0x77cc77;
  highlightColor = 0xcc4444;
  lightColor = 0x404040;
  warpLength = 10;
  weftLength = 10;
  warpHeight = 4;
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

    let offsetX = (this.sides[1] * this.weftLength) / 2;
    let offsetZ = (this.sides[0] * this.warpLength) / 2;

    for (let i = 0; i < this.sides[0]; i++) {
      this.sceneMatrix[i] = [];
    }

    let warp = [
      0,
      this.warpLength / 4,
      this.warpLength / 2,
      (3 * this.warpLength) / 4,
      this.warpLength
    ];
    let warpH = [0, this.warpHeight / 2, this.warpHeight];

    let curve;

    for (let i = 0; i < this.sides[1]; i++) {
      let elev = 0;
      let sceneRow = [];

      for (let k = 0; k < this.sides[0]; k++) {
        let x = i * this.weftLength - offsetX;
        let z = k * this.warpLength - offsetZ;

        if (this.matrix[k][i] == 0 && elev == 0) {
          curve = [
            new THREE.Vector3(x, warpH[0], warp[0] + z),
            new THREE.Vector3(x, warpH[0], warp[2] + z),
            new THREE.Vector3(x, warpH[0], warp[4] + z)
          ];
        } else if (this.matrix[k][i] == 0 && elev == 1) {
          curve = [
            new THREE.Vector3(x, warpH[2], warp[0] + z),
            new THREE.Vector3(x, warpH[2], warp[1] + z),
            new THREE.Vector3(x, warpH[1], warp[2] + z),
            new THREE.Vector3(x, warpH[0], warp[3] + z),
            new THREE.Vector3(x, warpH[0], warp[4] + z)
          ];
          elev = 0;
        } else if (this.matrix[k][i] == 1 && elev == 0) {
          curve = [
            new THREE.Vector3(x, warpH[0], warp[0] + z),
            new THREE.Vector3(x, warpH[0], warp[1] + z),
            new THREE.Vector3(x, warpH[1], warp[2] + z),
            new THREE.Vector3(x, warpH[2], warp[3] + z),
            new THREE.Vector3(x, warpH[2], warp[4] + z)
          ];
          elev = 1;
        } else if (this.matrix[k][i] == 1 && elev == 1) {
          curve = [
            new THREE.Vector3(x, warpH[2], warp[0] + z),
            new THREE.Vector3(x, warpH[2], warp[2] + z),
            new THREE.Vector3(x, warpH[2], warp[4] + z)
          ];
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
          -this.r * 2 - offsetX,
          warpH[1],
          (i + 1) * this.warpLength - offsetZ
        ),
        new THREE.Vector3(
          (this.sides[1] - 1) * this.weftLength - offsetX + this.r * 2,
          warpH[1],
          (i + 1) * this.warpLength - offsetZ
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
      offsetZ + this.initialCameraPos[2]
    );

    this.animate();
  }

  draw() {
    if (changed3D != null) {
      this.scene
        .getObjectById(this.sceneMatrix[changed3D.y][changed3D.x])
        .material.color.set(0xfffb00);
      changed3D = null;
    }
  }

  onWindowResize() {
    this.camera.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
  }
}
