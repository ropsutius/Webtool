<script setup>
import { uploadProject } from '../webtool/export';
import { onWindowResize } from '../webtool/interaction';
import { updateLayers } from '../webtool/Matrix';
import NavbarComponent from './NavbarComponent.vue';
import NavbarDropdown from './NavbarDropdown.vue';
</script>

<template>
  <div class="navbar">
    <NavbarDropdown name="File">
      <NavbarComponent name="New" :handler="openNewModal" />
      <NavbarComponent name="Open" :handler="openImportModal" />
      <NavbarComponent name="Save" :handler="uploadProject" />
      <NavbarComponent name="Export" :handler="openExportModal" />
    </NavbarDropdown>

    <NavbarDropdown name="Edit">
      <NavbarComponent name="Undo" />
      <NavbarComponent name="Redo" />
      <NavbarComponent name="Copy" />
      <NavbarComponent name="Cut" />
      <NavbarComponent name="Paste" />
      <NavbarComponent name="Layers" :handler="updateLayers" />
    </NavbarDropdown>

    <NavbarDropdown name="View">
      <NavbarComponent name="Dual view" :handler="toDualView" />
      <NavbarComponent name="Pixel view" :handler="toPixelView" />
      <NavbarComponent name="3D view" :handler="to3dView" />
    </NavbarDropdown>
  </div>
</template>

<script>
export default {
  props: {
    state: Object,
  },
  methods: {
    openNewModal() {
      this.state.newModal = true;
    },
    openImportModal() {
      this.state.importModal = true;
    },
    openExportModal() {
      this.state.exportModal = true;
    },
    uploadProject,
    updateLayers,
    to3dView() {
      const threeDView = document.getElementById('3d-view');
      const pixelView = document.getElementById('pixel-view');
      pixelView.style.display = 'none';
      threeDView.style.display = 'block';
      threeDView.style.width = '100%';
      threeDView.style.float = 'right';
      onWindowResize();
    },
    toPixelView() {
      const threeDView = document.getElementById('3d-view');
      const pixelView = document.getElementById('pixel-view');
      threeDView.style.display = 'none';
      pixelView.style.display = 'block';
      pixelView.style.width = '100%';
      pixelView.style.float = 'right';
      onWindowResize();
    },
    toDualView() {
      const threeDView = document.getElementById('3d-view');
      const pixelView = document.getElementById('pixel-view');
      pixelView.style.display = 'block';
      pixelView.style.width = '50%';
      threeDView.style.display = 'block';
      threeDView.style.width = '50%';
      onWindowResize();
    },
  },
};
</script>

<style scoped>
.navbar {
  overflow: hidden;
  background-color: #333;
}
</style>
