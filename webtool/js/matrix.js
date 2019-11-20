class Matrix {
  matrix;
  x;
  y;
  constructor(app, options, matrix = []) {
    this.app = app;
    this.layers = this.app.layers;

    if (matrix.length > 0) {
      this.setMatrix(matrix);
    } else {
      this.initMatrix(options);
    }
  }

  initMatrix(options) {
    if (options.Height && options.Width && options.Weave) {
      this.y = options.Height;
      this.x = options.Width;
      this.matrix = [];
      let weave = weaves[options.Weave][this.layers - 1];
      for (let y = 0; y < this.y; y++) {
        this.matrix[y] = [];
        for (let x = 0; x < this.x / weave.length; x++) {
          this.matrix[y] = this.matrix[y].concat(weave[y % weave.length]);
        }
      }
    }
  }

  setMatrix(matrix) {
    if (this.testMatrix(matrix)) {
      this.matrix = matrix;
      this.x = this.matrix[0].length;
      this.y = this.matrix.length;
    }
  }

  testMatrix(matrix) {
    if (matrix.length % this.layers == 0) {
      let length = matrix[0].length;
      for (let i = 1; i < matrix.length; i++) {
        if (matrix[i].length != length) {
          return false;
        }
      }
      return true;
    } else return false;
  }

  getToggle(coords) {
    return this.matrix[coords.y][coords.x];
  }

  getToggleById(id) {
    return this.getToggle(this.getCoordinatesById(id));
  }

  getId(coords, sceneMatrix) {
    return sceneMatrix[coords.y][coords.x] === undefined
      ? null
      : sceneMatrix[coords.y][coords.x];
  }

  getCoordinatesById(id, sceneMatrix) {
    for (let i = 0; i < this.y; i++) {
      let index = sceneMatrix[i].indexOf(id);
      if (index > -1) {
        return { y: i, x: index };
      }
    }
    return null;
  }

  toggle(coords) {
    if (this.getToggle(coords) == 0) {
      this.matrix[coords.y][coords.x] = 1;
    } else {
      this.matrix[coords.y][coords.x] = 0;
    }
  }

  reset(options, matrix = []) {
    this.layers = options.Layers;
    if (matrix.length == 0) {
      this.initMatrix(options);
    } else {
      this.setMatrix(matrix);
    }
  }
}
