class View {
  sceneMatrix = [];
  backgroundColor = 0xf5f5f5;
  doubleOK = ["00", "10", "11"];
  doubleBAD = ["01"];
  tripleOK = ["000", "100", "110", "111"];
  tripleBAD = ["011", "001", "101", "010"];

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

  getToggleByCoordinates(coords) {
    return this.matrix[coords.y][coords.x];
  }

  getToggleById(id) {
    return this.getToggleByCoordinates(this.getCoordinatesById(id));
  }

  getPreviousPointByCoordinates(coords) {
    return coords.y < this.layers
      ? null
      : { y: coords.y - this.layers, x: coords.x };
  }

  getNextPointByCoordinates(coords) {
    return coords.y > this.sides[0] - this.layers - 1
      ? null
      : { y: coords.y + this.layers, x: coords.x };
  }

  getPrimePoint(coords) {
    while (!this.isPrimePoint(coords)) {
      coords = this.getRotationPointByCoordinates(coords);
    }
    return coords;
  }

  getRotationPointByCoordinates(coords) {
    return coords.y % this.layers < this.layers - 1
      ? { x: coords.x, y: coords.y + 1 }
      : { x: coords.x, y: coords.y - this.layers + 1 };
  }

  getStartPoint(coords) {
    if (this.isStartPoint(coords)) {
      return coords;
    } else {
      let next = coords;
      for (let i = 1; i < this.layers; i++) {
        next = this.getRotationPointByCoordinates(next);
        if (this.isStartPoint(next)) {
          return next;
        }
      }
    }
  }

  getHeightByCoordinates(coords) {
    if (this.layers == 1) {
      return this.getToggleByCoordinates(coords);
    }
    let start = this.getStartPoint(coords);
    let string = this.getToggleByCoordinates(start).toString();
    let next = start;
    for (let i = 1; i < this.layers; i++) {
      next = this.getRotationPointByCoordinates(next);
      string += this.getToggleByCoordinates(next).toString();
    }
    if (this.layers == 2) {
      return this.doubleOK.includes(string)
        ? this.doubleOK.indexOf(string)
        : null;
    } else if (this.layers == 3) {
      return this.tripleOK.includes(string)
        ? this.tripleOK.indexOf(string)
        : null;
    }
  }

  isStartPoint(coords) {
    return coords.y % this.layers == 0 ? true : false;
  }

  isPrimePoint(coords) {
    return (coords.y % this.layers) + (coords.x % this.layers) ==
      this.layers - 1
      ? true
      : false;
  }

  isEqualToPair(coords) {
    return this.getToggleByCoordinates(coords) ==
      this.getToggleByCoordinates(this.getRotationPointByCoordinates(coords))
      ? true
      : false;
  }

  toggleByCoordinates(coords) {
    if (this.layers == 2) {
      if (
        coords.y % 2 == 1 &&
        this.isEqualToPair(coords) &&
        this.getToggleByCoordinates(coords) == 0
      ) {
        return;
      } else if (
        coords.y % 2 == 0 &&
        this.isEqualToPair(coords) &&
        this.getToggleByCoordinates(coords) == 1
      ) {
        return;
      }
    } else if (this.layers == 3) {
    }
    if (this.getToggleByCoordinates(coords) == 0) {
      this.matrix[coords.y][coords.x] = 1;
    } else {
      this.matrix[coords.y][coords.x] = 0;
    }
    changed3D = coords;
    changedPixel = coords;
  }

  // generatePermutations() {
  //   for (let i = 0; i < Math.pow(2, this.layers); i++) {
  //
  //   }
  //   return [];
  // }

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
