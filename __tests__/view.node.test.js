/* eslint-disable */
import assert from 'node:assert';
import { JSDOM } from 'jsdom';

import { createView } from '../src/view.js';

const { window } = new JSDOM('<!doctype html><html><body></body></html>');
global.window = window;
global.document = window.document;

console.log('Тест: view API и методы');
const mount = document.createElement('div');
const view = createView(mount);

assert.strictEqual(typeof view.setEmotion, 'function');
assert.strictEqual(typeof view.setSatiation, 'function');
assert.strictEqual(typeof view.setMessage, 'function');
assert.strictEqual(typeof view.setDisabled, 'function');

view.setSatiation(42);
assert.strictEqual(view.root.querySelector('.satiation').dataset.value, '42');
assert.strictEqual(view.root.querySelector('.satiation').textContent.includes('42'), true);

view.setMessage('hello');
assert.strictEqual(view.root.querySelector('.message').textContent, 'hello');

view.setEmotion('happy');
assert.strictEqual(view.root.querySelector('.fish-face').classList.contains('happy'), true);

view.setDisabled(true);
assert.strictEqual(view.feedButton.hasAttribute('disabled'), true);
view.setDisabled(false);
assert.strictEqual(view.feedButton.hasAttribute('disabled'), false);

console.log('✔ View tests passed');
