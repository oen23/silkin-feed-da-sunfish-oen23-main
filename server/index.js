/* eslint-disable */
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/src', express.static(path.join(__dirname, '..', 'src')));
app.use('/node_modules', express.static(path.join(__dirname, '..', 'node_modules')));

app.get('/feed', (req, res) => {
  const delay = Math.floor(Math.random() * 800) + 200;
  setTimeout(() => {
    const rnd = Math.random();
    if (rnd < 0.7) {
      res.status(200).json({ result: 'yummy' });
    } else if (rnd < 0.9) {
      res.status(429).json({ error: 'too_many' });
    } else {
      res.status(500).json({ error: 'server' });
    }
  }, delay);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
