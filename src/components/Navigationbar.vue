<script setup>
import { uploadProject } from '../webtool/export';
import { onWindowResize } from '../webtool/interaction';
import { updateLayers } from '../webtool/Matrix';

const openNewModal = () => {
  document.getElementById('new').style.display = 'block';
};

const openImportModal = () => {
  document.getElementById('import').style.display = 'block';
};

const openExportModal = () => {
  document.getElementById('export').style.display = 'block';
};

const to3dView = () => {
  const threeDView = document.getElementById('3d-view');
  const pixelView = document.getElementById('pixel-view');
  pixelView.style.display = 'none';
  threeDView.style.display = 'block';
  threeDView.style.width = '100%';
  threeDView.style.float = 'right';
  onWindowResize();
};

const toPixelView = () => {
  const threeDView = document.getElementById('3d-view');
  const pixelView = document.getElementById('pixel-view');
  threeDView.style.display = 'none';
  pixelView.style.display = 'block';
  pixelView.style.width = '100%';
  pixelView.style.float = 'right';
  onWindowResize();
};

const toDualView = () => {
  const threeDView = document.getElementById('3d-view');
  const pixelView = document.getElementById('pixel-view');
  pixelView.style.display = 'block';
  pixelView.style.width = '50%';
  threeDView.style.display = 'block';
  threeDView.style.width = '50%';
  onWindowResize();
};
</script>

<template>
  <div class="navbar">
    <div class="dropdown">
      <button class="dropbtn">File</button>
      <div class="dropdown-content">
        <a @click="openNewModal">New</a>
        <a @click="openImportModal">Open</a>
        <a @click="uploadProject">Save</a>
        <a @click="openExportModal">Export</a>
      </div>
    </div>

    <div class="dropdown">
      <button class="dropbtn">Edit</button>
      <div class="dropdown-content">
        <a href="#">Undo (N/A)</a> <a href="#">Redo (N/A)</a>
        <a href="#">Copy (N/A)</a> <a href="#">Cut (N/A)</a>
        <a href="#">Paste (N/A)</a> <a @click="updateLayers">Layers</a>
      </div>
    </div>

    <div class="dropdown">
      <button class="dropbtn">View</button>
      <div class="dropdown-content">
        <a @click="toDualView">Dual view</a>
        <a @click="toPixelView">Pixel view</a>
        <a @click="to3dView">3D view</a>
      </div>
    </div>
  </div>
</template>

<style>
.navbar {
  overflow: hidden;
  background-color: #333;
}

/* Links inside the navbar */
.navbar a {
  float: left;
  font-size: 12px;
  color: white;
  text-align: center;
  padding: 6px 16px;
  text-decoration: none;
}

/* The dropdown container */
.dropdown {
  float: left;
  overflow: hidden;
}

/* Dropdown button */
.dropdown .dropbtn {
  font-size: 12px;
  border: none;
  outline: none;
  color: white;
  padding: 6px 16px;
  background-color: inherit;
  font-family: inherit; /* Important for vertical align on mobile phones */
  margin: 0; /* Important for vertical align on mobile phones */
}

.navbar a:hover,
.dropdown:hover .dropbtn {
  background-color: gray;
}

/* Dropdown content (hidden by default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  float: none;
  color: black;
  padding: 6px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
  cursor: pointer;
}

/* Add a grey background color to dropdown links on hover */
.dropdown-content a:hover {
  background-color: #ddd;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}
</style>
