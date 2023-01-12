<script setup>
import { importProject } from '../webtool/import';
</script>

<template>
  <form @submit="importProject">
    <label for="name">Choose a file: </label>
    <input id="import-by-name-button" type="file" name="name" />
    <br />
    <button type="submit" class="btn">Open</button>
    <button type="button" class="btn" @click="closeImportModal">Cancel</button>
  </form>
</template>

<script>
export default {
  methods: {
    closeImportModal() {
      this.$parent.$emit('closeModal');
    },
  },
};
</script>

<style>
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
