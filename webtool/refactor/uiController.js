import * as App from './app.js';

export function init() {
  window.addEventListener('resize', () => {
    pixelView.onWindowResize();
    threeDView.onWindowResize();
  });
}

export function to3dView() {
  document.getElementById('pixel-view').style.display = 'none';
  document.getElementById('threeD-view').style.display = 'block';
  document.getElementById('threeD-view').style.width = '100%';
  threeDView.onWindowResize();
}

export function toPixelView() {
  document.getElementById('threeD-view').style.display = 'none';
  document.getElementById('pixel-view').style.display = 'block';
  document.getElementById('pixel-view').style.width = '100%';
  pixelView.onWindowResize();
}

export function toDualView() {
  document.getElementById('threeD-view').style.display = 'block';
  document.getElementById('threeD-view').style.width = '50%';
  document.getElementById('pixel-view').style.display = 'block';
  document.getElementById('pixel-view').style.width = '50%';
  threeDView.onWindowResize();
  pixelView.onWindowResize();
}

export function openNew() {
  document.getElementById('new').style.display = 'block';
}
export function closeNew() {
  document.getElementById('new').style.display = 'none';
}

export function openExport() {
  document.getElementById('export').style.display = 'block';
}
export function closeExport() {
  document.getElementById('export').style.display = 'none';
}

export function openSave() {
  document.getElementById('save').style.display = 'block';
}
export function closeSave() {
  document.getElementById('save').style.display = 'none';
}

export function openOpen() {
  document.getElementById('open').style.display = 'block';
}
export function closeOpen() {
  document.getElementById('open').style.display = 'none';
}
