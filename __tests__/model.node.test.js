/* eslint-disable */
import assert from 'node:assert';
import http from 'node:http';
import { feedFish } from '../src/model.js';

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
  console.log('Тест: feedFish возвращает 200');
  const srv200 = await startServer(200, { result: 'yummy' });
  const port200 = srv200.address().port;
  process.env.PORT = String(port200);
  const r200 = await feedFish();
  assert.strictEqual(r200.status, 200);
  assert.strictEqual(r200.ok, true);
  assert.deepStrictEqual(r200.body, { result: 'yummy' });
  srv200.close();
  console.log('✔ 200 OK');

  console.log('Тест: feedFish возвращает 429');
  const srv429 = await startServer(429, { error: 'too_many' });
  const port429 = srv429.address().port;
  process.env.PORT = String(port429);
  const r429 = await feedFish();
  assert.strictEqual(r429.status, 429);
  assert.strictEqual(r429.ok, false);
  assert.deepStrictEqual(r429.body, { error: 'too_many' });
  srv429.close();
  console.log('✔ 429 OK');

  console.log('Тест: feedFish возвращает 500');
  const srv500 = await startServer(500, { error: 'server' });
  const port500 = srv500.address().port;
  process.env.PORT = String(port500);
  const r500 = await feedFish();
  assert.strictEqual(r500.status, 500);
  assert.strictEqual(r500.ok, false);
  assert.deepStrictEqual(r500.body, { error: 'server' });
  srv500.close();
  console.log('✔ 500 OK');

  console.log('Все тесты модели прошли');
})();
