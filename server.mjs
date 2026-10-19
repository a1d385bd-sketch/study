import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const host = '127.0.0.1';
const requestedPort = Number(process.env.PORT || 4173);
let port = requestedPort;
const mime = {
  '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.svg':'image/svg+xml'
};

const server = http.createServer(async (request, response) => {
  try {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, {'Content-Type':'text/plain; charset=utf-8', 'Allow':'GET, HEAD'});
      return response.end('Method not allowed');
    }
    const url = new URL(request.url, `http://${host}:${port}`);
    if (url.pathname.startsWith('/api/')) {
      response.writeHead(404, {'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store'});
      return response.end(JSON.stringify({error:'AI provider support is scaffolded but not enabled in this edition.'}));
    }
    const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const file = path.resolve(root, `.${pathname}`);
    if (!file.startsWith(root + path.sep)) {
      response.writeHead(403, {'Content-Type':'text/plain; charset=utf-8'});
      return response.end('Forbidden');
    }
    const data = await fs.readFile(file);
    response.writeHead(200, {
      'Content-Type':mime[path.extname(file)] || 'application/octet-stream',
      'Cache-Control':'no-cache',
      'X-Content-Type-Options':'nosniff',
      'Referrer-Policy':'no-referrer',
      'Content-Security-Policy':"default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; base-uri 'self'; frame-ancestors 'none'"
    });
    if (request.method === 'HEAD') return response.end();
    response.end(data);
  } catch {
    response.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
    response.end('Not found');
  }
});
function listen() {
  server.once('error', error => {
    if (error.code === 'EADDRINUSE' && !process.env.PORT && port < 65535) { port++; setImmediate(listen); return; }
    throw error;
  });
  server.listen(port, host, () => console.log('StudyLoop is ready at http://' + host + ':' + port));
}
listen();
for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));