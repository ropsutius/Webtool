class View {
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

  getToggleByCoordinates(coords) {
    return this.matrix[coords.y][coords.x];
  }

  getToggleById(id) {
    return this.getToggleByCoordinates(this.getCoordinatesById(id));
  }

  getPreviousPointByCoordinates(coords) {
    if (this.layers == 1) {
      if (coords.y == 0) {
        return null;
      } else {
        return { x: coords.x, y: coords.y - 1 };
      }
    } else if (this.layers == 2) {
      if (coords.y == 0 || coords.y == 1) {
        return null;
      } else {
        return { x: coords.x, y: coords.y - 2 };
      }
    }
  }

  getNextPointByCoordinates(coords) {
    if (this.layers == 1) {
      if (coords.y == this.sides[0]) {
        return null;
      } else {
        return { x: coords.x, y: coords.y + 1 };
      }
    } else if (this.layers == 2) {
      if (coords.y == this.sides[0] - 1 || coords.y == this.sides[0] - 2) {
        return null;
      } else {
        return { x: coords.x, y: coords.y + 2 };
      }
    }
  }

  getPairPointByCoordinates(coords) {
    if (coords.y % 2 == 0) {
      return { x: coords.x, y: coords.y + 1 };
    } else {
      return { x: coords.x, y: coords.y - 1 };
    }
  }

  isPrimePoint(coords) {
    if (this.layers == 1) {
      return true;
    } else if (this.layers == 2) {
      if (coords.y % 2 != coords.x % 2) {
        return true;
      }
    }
    return false;
  }

  isEqualToPair(coords) {
    if (
      this.getToggleByCoordinates(coords) ==
      this.getToggleByCoordinates(this.getPairPointByCoordinates(coords))
    ) {
      return true;
    } else return false;
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
    }
    if (this.getToggleByCoordinates(coords) == 0) {
      this.matrix[coords.y][coords.x] = 1;
    } else {
      this.matrix[coords.y][coords.x] = 0;
    }
    changed3D = coords;
    changedPixel = coords;
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
