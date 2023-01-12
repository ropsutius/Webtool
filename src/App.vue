<script setup>
import { reactive } from 'vue';
import Navbar from './components/Navbar.vue';
import AppCanvas from './components/AppCanvas.vue';
import Sidebar from './components/Sidebar.vue';
import NewForm from './components/NewForm.vue';
import ImportForm from './components/ImportForm.vue';
import ExportForm from './components/ExportForm.vue';
import Modal from './components/Modal.vue';

const state = reactive({
  exportModal: false,
  importModal: false,
  newModal: false,
});
</script>

<template>
  <Navbar :state="state" />
  <AppCanvas />
  <Sidebar />

  <Modal
    id="new"
    v-if="state.newModal"
    @close-modal="() => (state.newModal = false)"
  >
    <NewForm />
  </Modal>
  <Modal
    id="import"
    v-if="state.importModal"
    @close-modal="() => (state.importModal = false)"
  >
    <ImportForm />
  </Modal>
  <Modal
    id="export"
    v-if="state.exportModal"
    @close-modal="() => (state.exportModal = false)"
  >
    <ExportForm />
  </Modal>
</template>
