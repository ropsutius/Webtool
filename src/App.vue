<script setup>
import Navigationbar from "./components/Navigationbar.vue";
import AppCanvas from "./components/AppCanvas.vue";
import Sidebar from "./components/Sidebar.vue";
import NewModal from "./components/NewModal.vue";
import ImportModal from "./components/ImportModal.vue";
import ExportModal from "./components/ExportModal.vue";
</script>

<template>
  <Navigationbar />
  <AppCanvas />
  <Sidebar />
  <NewModal />
  <ImportModal />
  <ExportModal />
</template>
