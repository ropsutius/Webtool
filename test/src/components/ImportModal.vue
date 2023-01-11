<script setup>
import { importProject } from '../webtool/import';

const closeImportModal = () => {
  document.getElementById('import').style.display = 'none';
};
</script>

<template>
  <div id="import" class="modal download">
    <div class="modal-content">
      <div class="modal-header">
        <span class="close" @click="closeImportModal">&times;</span>
        <h2>Open Project file</h2>
      </div>
      <div class="modal-body">
        <form @submit="importProject">
          <label for="name">Choose a file: </label>
          <input id="import-by-name-button" type="file" name="name" />
          <br />
          <button type="submit" class="btn">Open</button>
          <button type="button" class="btn" @click="closeImportModal">
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
