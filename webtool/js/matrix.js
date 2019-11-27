class Matrix {
  matrix;
  x;
  y;
  constructor(app, options, matrix = []) {
    this.app = app;

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
      if (options.Weave == "blank") {
        for (let y = 0; y < this.y; y++) {
          this.matrix[y] = [];
          for (let x = 0; x < this.x; x++) {
            this.matrix[y][x] = 0;
          }
        }
      } else {
        let weave = weaves[options.Weave][this.app.layers - 1];
        for (let y = 0; y < this.y; y++) {
          this.matrix[y] = [];
          for (let x = 0; x < this.x / weave.length; x++) {
            this.matrix[y] = this.matrix[y].concat(weave[y % weave.length]);
          }
        }
      }
    }
  }

  setMatrix(matrix) {
    if (this.testMatrix(matrix)) {
      this.matrix = matrix;
      this.y = this.matrix.length;
      this.x = this.matrix[0].length;
    }
  }

  testMatrix(matrix) {
    if (matrix.length % this.app.layers == 0) {
      let length = matrix[0].length;
      for (let i = 1; i < matrix.length; i++) {
        if (matrix[i].length != length) {
          return false;
        }
      }
      return true;
    } else return false;
  }

  getSaveData() {
    let string = "";
    for (let i = 0; i < this.y - 1; i++) {
      string += this.matrix[i].toString() + ";";
    }
    return string + this.matrix[this.y - 1].toString();
  }

  reset(options, matrix = []) {
    if (matrix.length == 0) {
      this.initMatrix(options);
    } else {
      this.setMatrix(matrix);
    }
  }
}
