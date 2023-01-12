<script setup>
import { createNewProject } from '../webtool/import';
</script>

<template>
  <form @submit="createNewProject">
    <select>
      <option value="1" selected>Single</option>
      <option value="2">Double</option>
      <option value="3">Triple</option>
      <option value="4">Quadruple</option>
    </select>
    <br />
    <select name="weave">
      <option value="blank" selected>Blank</option>
      <option value="plain">Plain weave</option>
    </select>
    <br />
    <label for="width">Width:</label>
    <input type="number" min="1" max="1000" value="10" required />
    <label for="height">Height:</label>
    <input type="number" min="1" max="1000" value="10" required />
    <br />
    <button id="new-button" type="submit" class="btn">Create Canvas</button>
    <button type="button" class="btn" @click="closeNewModal">Cancel</button>
  </form>
</template>

<script>
export default {
  methods: {
    closeNewModal() {
      document.getElementById('new').style.display = 'none';
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
