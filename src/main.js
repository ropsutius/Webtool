import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import * as WebTool from './webtool/app.js';

import './assets/main.css';
const app = createApp(App);

app.use(createPinia());
app.mount('#app');

WebTool.initApp();
