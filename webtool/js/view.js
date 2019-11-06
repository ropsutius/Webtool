class View {
  matrix;
  sceneMatrix = [];
  backgroundColor = 0xf5f5f5;

  constructor(canvas, options) {
    this.matrix = matrix;
    this.sides = [this.matrix.length, this.matrix[0].length];

    if ("Layers" in options) {
      this.layers = options.Layers;
    } else {
      this.layers = 1;
    }

    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.backgroundColor);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.canvas.appendChild(this.renderer.domElement);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.canvas.addEventListener(
      "mousemove",
      this.onMouseMove.bind(this),
      false
    );
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.draw();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  getCoordinatesById(id) {
    for (let i = 0; i < this.sides[0]; i++) {
      let index = this.sceneMatrix[i].indexOf(id);
      if (index > -1) {
        return { y: i, x: index };
      }
    }
    return null;
  }

  getIdByCoordinates(coords) {
    return this.sceneMatrix[coords.y][coords.x] === undefined
      ? null
      : this.sceneMatrix[coords.y][coords.x];
  }

  onMouseMove(event) {
    this.mouse.x =
      ((event.clientX - this.canvas.offsetLeft) / this.canvas.offsetWidth) * 2 -
      1;
    this.mouse.y =
      -((event.clientY - this.canvas.offsetTop) / this.canvas.offsetHeight) *
        2 +
      1;
  }
}
