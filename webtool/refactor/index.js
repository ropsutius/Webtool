import * as App from './app.js';
import * as UiController from './uiController.js';

App.init({ layers: 1, width: 20, height: 20, weave: 'blank' });
UiController.addEventHandlers();
