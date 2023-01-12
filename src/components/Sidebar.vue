<script setup>
import SidebarComponent from './SidebarComponent.vue';
</script>

<template>
  <div class="toolbar">
    <SidebarComponent name="P" />
    <SidebarComponent name="M" />
  </div>
</template>

<style scoped>
.toolbar {
  width: 46px; /* Set a specific width */
  height: calc(100% - 26px);
  background-color: #555; /* Dark-grey background */
  display: block;
  float: left;
  position: absolute;
}
</style>
