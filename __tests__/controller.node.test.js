/* eslint-disable */
import assert from 'node:assert';
import http from 'node:http';
import { JSDOM } from 'jsdom';

const startServer = (status, body) => new Promise((resolve) => {
  const srv = http.createServer((req, res) => {
    if (req.url === '/feed') {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body));
    } else {
      res.writeHead(404);
      res.end();
    }
  });
  srv.listen(0, '127.0.0.1', () => resolve(srv));
});

(async () => {
  const srv = await startServer(200, { result: 'yummy' });
  const { port } = srv.address();
  process.env.PORT = String(port);

  const { window } = new JSDOM('<!doctype html><html><body></body></html>');
  global.window = window; global.document = window.document;

  const { feedFish } = await import('../src/model.js');
  const { initApp } = await import('../src/controller.js');

  console.log('DEBUG feedFish result:', await feedFish());

  console.log('Тест: controller интеграция (200)');
  const mount = document.createElement('div');
  const view = initApp(mount);

  view.feedButton.click();

  await new Promise((r) => setTimeout(r, 150));

  console.log('DEBUG classes:', Array.from(view.face.classList));
  console.log('DEBUG satiation dataset:', view.root.querySelector('.satiation').dataset.value);
  assert.strictEqual(view.face.classList.contains('happy'), true);
  assert.strictEqual(view.root.querySelector('.satiation').dataset.value, '100');

  srv.close();
  console.log('✔ controller 200 passed');

  const srv2 = await startServer(429, { error: 'too_many' });
  process.env.PORT = String(srv2.address().port);
  const mount2 = document.createElement('div');
  const view2 = initApp(mount2);
  view2.feedButton.click();
  await new Promise((r) => setTimeout(r, 150));
  assert.strictEqual(view2.face.classList.contains('overfed'), true);
  srv2.close();
  console.log('✔ controller 429 passed');

  const srv3 = await startServer(500, { error: 'server' });
  process.env.PORT = String(srv3.address().port);
  const mount3 = document.createElement('div');
  const view3 = initApp(mount3);
  view3.feedButton.click();
  await new Promise((r) => setTimeout(r, 150));
  assert.strictEqual(view3.face.classList.contains('screaming'), true);
  srv3.close();
  console.log('✔ controller 500 passed');

  console.log('Все тесты controller прошли');
})();
