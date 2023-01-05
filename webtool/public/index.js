import * as App from './app.js';
import * as UiController from './uiController.js';

App.initApp({ layers: 2, width: 30, height: 30, weave: 'plain' });
UiController.addEventHandlers();