import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { handleCatalogApi } from './server/catalog-api.mjs';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const distRoot = resolve(projectRoot, 'dist');
const port = Number(process.env.PORT ?? 4173);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

const sendFile = async (request, response, filePath) => {
  const info = await stat(filePath);
  response.statusCode = 200;
  response.setHeader('Content-Type', contentTypes[extname(filePath)] ?? 'application/octet-stream');
  response.setHeader('Content-Length', info.size);
  response.setHeader('Cache-Control', filePath.endsWith('index.html') ? 'no-cache' : 'public, max-age=604800');
  if (request.method === 'HEAD') {
    response.end();
    return;
  }
  createReadStream(filePath).pipe(response);
};

const server = createServer(async (request, response) => {
  try {
    if (request.url?.startsWith('/api/catalog/')) {
      await handleCatalogApi(request, response);
      return;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.statusCode = 405;
      response.end('Method not allowed');
      return;
    }

    const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
    const relativePath = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    const candidate = resolve(distRoot, relativePath);
    if (candidate !== distRoot && !candidate.startsWith(`${distRoot}${sep}`)) {
      response.statusCode = 403;
      response.end('Forbidden');
      return;
    }

    try {
      await sendFile(request, response, candidate);
    } catch {
      if (extname(relativePath)) {
        response.statusCode = 404;
        response.end('Not found');
        return;
      }
      await sendFile(request, response, resolve(distRoot, 'index.html'));
    }
  } catch {
    response.statusCode = 500;
    response.end('Internal server error');
  }
});

server.listen(port, '0.0.0.0', () => {
  process.stdout.write(`hongbaiji-grid listening on ${port}\n`);
});
