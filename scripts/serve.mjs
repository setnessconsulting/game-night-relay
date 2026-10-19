import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, sep, extname } from 'node:path';

export function serve({ port = 4173 } = {}) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8' };
  const server = createServer(async (req,res) => {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    let target;
    try { target = resolve(root, '.' + decodeURIComponent(pathname === '/' ? '/index.html' : pathname)); }
    catch { res.writeHead(400); res.end(); return; }
    if (!target.startsWith(root.endsWith(sep) ? root : root + sep) ||
        !(target === resolve(root, 'index.html') || target.startsWith(resolve(root, 'src') + sep)) ||
        !['GET','HEAD'].includes(req.method)) {
      res.writeHead(404); res.end(); return;
    }
    try {
      const bytes = await readFile(target);
      res.writeHead(200, { 'Content-Type':types[extname(target)] ?? 'application/octet-stream', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch { res.writeHead(404); res.end(); }
  });
  return new Promise(resolve => server.listen(port, '127.0.0.1', () => resolve(server)));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = await serve({ port:Number(process.env.PORT ?? 4173) });
  console.log(`Night Relay: http://127.0.0.1:${server.address().port}`);
}
