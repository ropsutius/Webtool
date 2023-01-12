<script setup>
import Navbar from './components/Navbar.vue';
import AppCanvas from './components/AppCanvas.vue';
import Sidebar from './components/Sidebar.vue';
import NewForm from './components/NewForm.vue';
import ImportForm from './components/ImportForm.vue';
import ExportForm from './components/ExportForm.vue';
import Modal from './components/Modal.vue';
</script>

<template>
  <Navbar />
  <AppCanvas />
  <Sidebar />

  <Modal id="new"> <NewForm /> </Modal>
  <Modal id="import"> <ImportForm /> </Modal>
  <Modal id="export"> <ExportForm /> </Modal>
</template>
