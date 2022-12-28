import { init } from './app.js';

export function importFile(event) {
  event.preventDefault;

  var file = event.target[0].files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const contents = event.target.result;
    parseFile(contents);
  };
  reader.readAsText(file);
}

function parseFile(contents) {
  const array = contents.split(';');
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].split(',');
    for (let k = 0; k < array[i].length; k++) {
      array[i][k] = parseInt(array[i][k]);
    }
  }
  //init({ layers: 1, width: 30, height: 30, weave: 'plain' });
}
