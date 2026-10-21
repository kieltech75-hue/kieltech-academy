import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.all('/api/ai/*', (_req, res) => {
  res.status(410).json({ error: 'AI features are disabled.' });
});

const isDevelopment = process.argv.includes('--dev');
const serverDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = isDevelopment ? serverDirectory : resolve(serverDirectory, '..');

async function startServer() {
  if (isDevelopment) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDirectory = resolve(projectRoot, 'dist');
    app.use(express.static(distDirectory));
    app.get('*', (_req, res) => {
      res.sendFile(resolve(distDirectory, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`KielTech Academy server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((error: unknown) => {
  console.error('Failed to start KielTech Academy server:', error);
  process.exitCode = 1;
});
