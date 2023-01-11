<script setup>
import { createNewProject } from '../webtool/import';

const closeNewModal = () => {
  document.getElementById('new').style.display = 'none';
};
</script>

<template>
  <div id="new" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <span class="close" @click="closeNewModal">&times;</span>
        <h2>Create New Canvas</h2>
      </div>
      <div class="modal-body">
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
          <button id="new-button" type="submit" class="btn">
            Create Canvas
          </button>
          <button type="button" class="btn" @click="closeNewModal">
            Cancel
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
/* MODAL */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Header */
.modal-header {
  padding: 2px 16px;
  background-color: #555;
  color: white;
  text-align: center;
}

/* Modal Body */
.modal-body {
  padding: 12px 16px;
  color: black;
}

/* Modal Footer */
.modal-footer {
  padding: 2px 16px;
  background-color: #555;
  color: white;
}

/* Modal Content */
.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  animation-name: animatetop;
  animation-duration: 0.4s;
}

/* The Close Button */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

/* Add Animation */
@keyframes animatetop {
  from {
    top: -300px;
    opacity: 0;
  }
  to {
    top: 0;
    opacity: 1;
  }
}

/* FORM */
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
