import { createApp } from 'vue';
import App from './App.vue';
import * as WebTool from './webtool/app.js';

import './assets/main.css';

createApp(App).mount('#app');

WebTool.initApp();
