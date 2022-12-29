import { scene, camera, canvas } from './threeDView.js';
import { onPointerMove, onMouseClick, onWindowResize } from './interaction.js';
import { createNewProject, importProject } from './import.js';
import { saveProject, exportProject } from './export.js';

export function addEventHandlers() {
  //INTERACTION
  canvas.addEventListener('pointermove', (event) =>
    onPointerMove(event, canvas)
  );
  canvas.addEventListener('click', () => onMouseClick(scene, camera));
  window.addEventListener('resize', () => onWindowResize(canvas));

  //IMPORT PROJECT WIDGET
  const importElement = document.getElementById('import');
  document
    .getElementById('import_form')
    .addEventListener('submit', (event) => importProject(event));
  document
    .getElementById('open_import_button')
    .addEventListener('click', () => {
      importElement.style.display = 'block';
    });
  document
    .getElementById('close_import_button')
    .addEventListener('click', () => {
      importElement.style.display = 'none';
    });
  document.getElementById('close_import_span').addEventListener('click', () => {
    importElement.style.display = 'none';
  });

  //NEW PROJECT WIDGET
  const newElement = document.getElementById('new');
  document
    .getElementById('new_form')
    .addEventListener('submit', (event) => createNewProject(event));
  document.getElementById('open_new_button').addEventListener('click', () => {
    newElement.style.display = 'block';
  });
  document.getElementById('close_new_button').addEventListener('click', () => {
    newElement.style.display = 'none';
  });
  document.getElementById('close_new_span').addEventListener('click', () => {
    newElement.style.display = 'none';
  });

  //SAVE PROJECT WIDGET
  const saveElement = document.getElementById('save');
  document
    .getElementById('save_form')
    .addEventListener('submit', (event) => saveProject(event));
  document.getElementById('open_save_button').addEventListener('click', () => {
    saveElement.style.display = 'block';
  });
  document.getElementById('close_save_button').addEventListener('click', () => {
    saveElement.style.display = 'none';
  });
  document.getElementById('close_save_span').addEventListener('click', () => {
    saveElement.style.display = 'none';
  });

  //EXPORT PROJECT WIDGET
  const exportElement = document.getElementById('export');
  document
    .getElementById('export_form')
    .addEventListener('submit', (event) => exportProject(event));
  document
    .getElementById('open_export_button')
    .addEventListener('click', () => {
      exportElement.style.display = 'block';
    });
  document
    .getElementById('close_export_button')
    .addEventListener('click', () => {
      exportElement.style.display = 'none';
    });
  document.getElementById('close_export_span').addEventListener('click', () => {
    exportElement.style.display = 'none';
  });
}

function to3dView() {
  document.getElementById('pixel-view').style.display = 'none';
  document.getElementById('threeD-view').style.display = 'block';
  document.getElementById('threeD-view').style.width = '100%';
  threeDView.onWindowResize();
}

function toPixelView() {
  document.getElementById('threeD-view').style.display = 'none';
  document.getElementById('pixel-view').style.display = 'block';
  document.getElementById('pixel-view').style.width = '100%';
  pixelView.onWindowResize();
}

function toDualView() {
  document.getElementById('threeD-view').style.display = 'block';
  document.getElementById('threeD-view').style.width = '50%';
  document.getElementById('pixel-view').style.display = 'block';
  document.getElementById('pixel-view').style.width = '50%';
  threeDView.onWindowResize();
  pixelView.onWindowResize();
}
