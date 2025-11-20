/* eslint-disable */
import { initApp } from './controller.js';

const mount = document.getElementById('app') || document.body;
window.addEventListener('DOMContentLoaded', () => {
  initApp(mount);
});

