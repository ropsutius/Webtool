class View {
  matrix;
  sceneMatrix = [];
  clearColor = 0xffffff;

  constructor(canvas) {
    this.matrix = matrix;
    this.sides = [this.matrix.length, this.matrix[0].length];
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.renderer.setClearColor(this.clearColor, 1);
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
  }

  getIdByCoordinates(c) {
    return this.sceneMatrix[c.y][c.x];
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
