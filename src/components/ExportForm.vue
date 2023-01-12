<script setup>
import { exportProject } from '../webtool/export';
</script>

<template>
  <form @submit="exportProject">
    <input type="text" />
    <select id="cars">
      <option value="png">.png</option>
      <option value="tif">.tif</option>
      <option value="txt">.txt</option>
    </select>
    <br />
    <button type="submit" class="btn">Download</button>
    <button type="button" class="btn" @click="closeExportModal">Cancel</button>
  </form>
</template>

<script>
export default {
  methods: {
    closeExportModal() {
      this.$parent.$emit('closeModal');
    },
  },
};
</script>

<style scoped>
input[type='number'],
input[type='text'],
select,
label,
form button {
  margin: 8px 16px;
  font-size: 12px;
}

#new label {
  margin-right: 2px;
}

.download label {
  margin-left: 0px;
}

.download input[type='text'] {
  margin-right: 2px;
}

input[type='number'] {
  margin-left: 2px;
}

form button {
  margin-top: 20px;
  margin-right: 0px;
  padding: 6px 10px;
  border: none;
  text-decoration: none;
  color: white;
  background-color: #303030;
  cursor: pointer;
}

form button:hover,
form button:focus {
  cursor: pointer;
}
</style>
