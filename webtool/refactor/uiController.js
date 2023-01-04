import * as ThreeDView from './threeDView.js';
import * as PixelView from './pixelView.js';
import { onPointerMove, onMouseClick, onWindowResize } from './interaction.js';
import { createNewProject, importProject } from './import.js';
import { saveProject, exportProject } from './export.js';
import { updateLayers } from './Matrix.js';

const threeDView = document.getElementById('3d-view');
const pixelView = document.getElementById('pixel-view');
const canvas = document.getElementById('canvas');

export function addEventHandlers() {
  //INTERACTION

  threeDView.addEventListener('pointermove', (event) =>
    onPointerMove(event, threeDView)
  );
  pixelView.addEventListener('pointermove', (event) =>
    onPointerMove(event, pixelView)
  );

  ThreeDView.canvas.addEventListener('click', (event) =>
    onMouseClick(event, ThreeDView.scene, ThreeDView.camera)
  );
  PixelView.canvas.addEventListener('click', (event) =>
    onMouseClick(event, PixelView.scene, PixelView.camera)
  );

  window.addEventListener('resize', onWindowResize);

  document
    .getElementById('layers-button')
    .addEventListener('click', updateLayers);

  //IMPORT PROJECT WIDGET
  const importElement = document.getElementById('import');
  document
    .getElementById('import-form')
    .addEventListener('submit', (event) => importProject(event));

  document
    .getElementById('open-import-button')
    .addEventListener('click', () => {
      importElement.style.display = 'block';
    });

  document
    .getElementById('close-import-button')
    .addEventListener('click', () => {
      importElement.style.display = 'none';
    });

  document.getElementById('close-import-span').addEventListener('click', () => {
    importElement.style.display = 'none';
  });

  //NEW PROJECT WIDGET
  const newElement = document.getElementById('new');
  document
    .getElementById('new-form')
    .addEventListener('submit', (event) => createNewProject(event));

  document.getElementById('open-new-button').addEventListener('click', () => {
    newElement.style.display = 'block';
  });

  document.getElementById('close-new-button').addEventListener('click', () => {
    newElement.style.display = 'none';
  });

  document.getElementById('close-new-span').addEventListener('click', () => {
    newElement.style.display = 'none';
  });

  //SAVE PROJECT WIDGET
  const saveElement = document.getElementById('save');
  document
    .getElementById('save-form')
    .addEventListener('submit', (event) => saveProject(event));

  document.getElementById('open-save-button').addEventListener('click', () => {
    saveElement.style.display = 'block';
  });

  document.getElementById('close-save-button').addEventListener('click', () => {
    saveElement.style.display = 'none';
  });

  document.getElementById('close-save-span').addEventListener('click', () => {
    saveElement.style.display = 'none';
  });

  //EXPORT PROJECT WIDGET
  const exportElement = document.getElementById('export');
  document
    .getElementById('export-form')
    .addEventListener('submit', (event) => exportProject(event));

  document
    .getElementById('open-export-button')
    .addEventListener('click', () => {
      exportElement.style.display = 'block';
    });

  document
    .getElementById('close-export-button')
    .addEventListener('click', () => {
      exportElement.style.display = 'none';
    });

  document.getElementById('close-export-span').addEventListener('click', () => {
    exportElement.style.display = 'none';
  });

  //VIEWS
  document
    .getElementById('to-dual-view-button')
    .addEventListener('click', toDualView);

  document
    .getElementById('to-pixel-view-button')
    .addEventListener('click', toPixelView);

  document
    .getElementById('to-3d-view-button')
    .addEventListener('click', to3dView);
}

function to3dView() {
  pixelView.style.display = 'none';
  threeDView.style.display = 'block';
  threeDView.style.width = '100%';
  threeDView.style.float = 'right';
  onWindowResize();
}

function toPixelView() {
  threeDView.style.display = 'none';
  pixelView.style.display = 'block';
  pixelView.style.width = '100%';
  pixelView.style.float = 'right';
  onWindowResize();
}

function toDualView() {
  pixelView.style.display = 'block';
  pixelView.style.width = '50%';
  threeDView.style.display = 'block';
  threeDView.style.width = '50%';
  onWindowResize();
}
