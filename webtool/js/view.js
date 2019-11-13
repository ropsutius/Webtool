class View {
  sceneMatrix = [];
  backgroundColor = 0xf5f5f5;
  okList = [
    ["0", "1"],
    ["00", "10", "11"],
    ["000", "100", "110", "111"],
    ["0000", "1000", "1100", "1110", "1111"]
  ];

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

  getId(coords) {
    return this.sceneMatrix[coords.y][coords.x] === undefined
      ? null
      : this.sceneMatrix[coords.y][coords.x];
  }

  getToggle(coords) {
    return this.matrix[coords.y][coords.x];
  }

  getToggleById(id) {
    return this.getToggle(this.getCoordinatesById(id));
  }

  getPreviousSet(coords) {
    return coords.y < this.layers
      ? null
      : { y: coords.y - this.layers, x: coords.x };
  }

  getNextSet(coords) {
    return coords.y > this.sides[0] - this.layers - 1
      ? null
      : { y: coords.y + this.layers, x: coords.x };
  }

  getPrimePoint(coords) {
    while (!this.isPrimePoint(coords)) {
      coords = this.getNextPointInSet(coords);
    }
    return coords;
  }

  getNextPointInSet(coords) {
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
        next = this.getNextPointInSet(next);
        if (this.isStartPoint(next)) {
          return next;
        }
      }
    }
  }

  getHeight(coords) {
    let string = this.getSetString(coords);
    return this.okList[this.layers - 1].includes(string)
      ? this.okList[this.layers - 1].indexOf(string)
      : null;
  }

  getSetString(coords) {
    let point = this.getStartPoint(coords);
    let string = this.getToggle(point).toString();
    for (let i = 1; i < this.layers; i++) {
      point = this.getNextPointInSet(point);
      string += this.getToggle(point).toString();
    }
    return string;
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
    return this.getToggle(coords) ==
      this.getToggle(this.getNextPointInSet(coords))
      ? true
      : false;
  }

  isRealSet(coords) {}

  toggle(coords) {
    if (this.getToggle(coords) == 0) {
      this.matrix[coords.y][coords.x] = 1;
    } else {
      this.matrix[coords.y][coords.x] = 0;
    }
    let string = this.getSetString(coords);
    if (!this.okList[this.layers - 1].includes(string)) {
      if (this.getToggle(coords) == 0) {
        this.matrix[coords.y][coords.x] = 1;
      } else {
        this.matrix[coords.y][coords.x] = 0;
      }
    } else {
      changed3D = coords;
      changedPixel = coords;
    }
  }

  generatePermutations() {}

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
