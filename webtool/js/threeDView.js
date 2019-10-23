class ThreeDView extends View {
  warpColor = 0x4444ff;
  weftColor = 0x77cc77;
  highlightColor = 0xcc4444;
  r = 1;
  tubeSegments = 32;
  radialSegments = 8;
  initialCameraPos = [0, 40, 100];

  constructor(canvas) {
    super(canvas);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
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
    // this.controls.screenSpacePanning = true;
    this.controls.minDistance = 50;
    this.controls.maxDistance = 1000;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.ROTATE
    };
    this.controls.zoomSpeed = 0.4;
  }

  initWeave() {
    var light = new THREE.HemisphereLight(0x404040);
    light.position.y = -10;
    this.scene.add(light);

    var weftMaterial = new THREE.MeshLambertMaterial({ color: this.weftColor });

    var offsetX = (this.sides[1] * 9) / 2;
    var offsetZ = (this.sides[0] * 19) / 2;
    for (var i = 0; i < this.sides[0]; i++) {
      this.sceneMatrix[i] = [];
    }
    var curve;
    for (var i = 0; i < this.sides[1]; i++) {
      var elev = 0;
      var sceneRow = [];
      for (var k = 0; k < this.sides[0]; k++) {
        var x = i * 10 - offsetX;
        var z = k * 19 - offsetZ;
        if (this.matrix[k][i] == 0 && elev == 0) {
          curve = [
            new THREE.Vector3(x, 0, z),
            new THREE.Vector3(x, 0, 10 + z),
            new THREE.Vector3(x, 0, 20 + z)
          ];
        } else if (this.matrix[k][i] == 0 && elev == 1) {
          curve = [
            new THREE.Vector3(x, 4, z),
            new THREE.Vector3(x, 4, 5 + z),
            new THREE.Vector3(x, 2, 10 + z),
            new THREE.Vector3(x, 0, 15 + z),
            new THREE.Vector3(x, 0, 20 + z)
          ];
          elev = 0;
        } else if (this.matrix[k][i] == 1 && elev == 0) {
          curve = [
            new THREE.Vector3(x, 0, z),
            new THREE.Vector3(x, 0, 5 + z),
            new THREE.Vector3(x, 2, 10 + z),
            new THREE.Vector3(x, 4, 15 + z),
            new THREE.Vector3(x, 4, 20 + z)
          ];
          elev = 1;
        } else if (this.matrix[k][i] == 1 && elev == 1) {
          curve = [
            new THREE.Vector3(x, 4, z),
            new THREE.Vector3(x, 4, 10 + z),
            new THREE.Vector3(x, 4, 20 + z)
          ];
        }
        var tube = new THREE.TubeBufferGeometry(
          new THREE.CatmullRomCurve3(curve),
          this.tubeSegments,
          this.r,
          this.radialSegments,
          false
        );
        var warpMaterial = new THREE.MeshLambertMaterial({
          color: this.warpColor
        });
        var mesh = new THREE.Mesh(tube, warpMaterial);
        this.sceneMatrix[k][i] = mesh.id;
        this.scene.add(mesh);
      }
    }

    for (var i = 0; i < this.sides[0]; i++) {
      var curve = [
        new THREE.Vector3(-offsetX - 2, 2, i * 19 + 20 - offsetZ),
        new THREE.Vector3(
          this.sides[1] * 10 - offsetX,
          2,
          i * 19 + 20 - offsetZ
        )
      ];
      var tube = new THREE.TubeBufferGeometry(
        new THREE.CatmullRomCurve3(curve),
        this.tubeSegments,
        this.r,
        this.radialSegments,
        false
      );
      var mesh = new THREE.Mesh(tube, weftMaterial);
      this.scene.add(mesh);
    }
    var axesHelper = new THREE.AxesHelper(5);
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
    var x = 1;
    var y = 1;
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
