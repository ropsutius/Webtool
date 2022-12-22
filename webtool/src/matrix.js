export let matrix, width, height;

export function initMatrix(options) {
  height = options.height;
  width = options.width;
  matrix = [];

  switch (options.weave) {
    case 'blank':
      matrix = Array(height).fill(Array(width).fill(0));
      return matrix;

    case 'plain':
      let weave = weaves[options.weave][app.layers - 1];
      for (let y = 0; y < y; y++) {
        matrix[y] = [];
        for (let x = 0; x < x / weave.length; x++) {
          matrix[y] = matrix[y].concat(weave[y % weave.length]);
        }
      }
      return matrix;
  }
}

export function setMatrix(matrix) {
  if (testMatrix(matrix)) {
    matrix = matrix;
    y = matrix.length;
    x = matrix[0].length;
  }
}

export function testMatrix(matrix) {
  if (matrix.length % app.layers == 0) {
    let length = matrix[0].length;
    for (let i = 1; i < matrix.length; i++) {
      if (matrix[i].length != length) {
        return false;
      }
    }
    return true;
  } else return false;
}

export function getSaveData() {
  let string = '';
  for (let i = 0; i < y - 1; i++) {
    string += matrix[i].toString() + ';';
  }
  return string + matrix[y - 1].toString();
}

export function reset(options, matrix = []) {
  if (matrix.length == 0) {
    initMatrix(options);
  } else {
    setMatrix(matrix);
  }
}
