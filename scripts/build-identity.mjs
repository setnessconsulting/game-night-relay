import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export function buildIdentity() {
  const paths = ['index.html', 'package.json', 'package-lock.json',
    ...readdirSync(new URL('src/', root)).sort().map(file => `src/${file}`)];
  const files = Object.fromEntries(paths.map(file => [file, sha256(readFileSync(new URL(file, root)))]));
  return { algorithm:'sha256', build:sha256(JSON.stringify(files)), files };
}

export function verificationIdentity() {
  const collect = dir => readdirSync(new URL(dir,root), { withFileTypes:true }).flatMap(entry =>
    entry.isDirectory() ? collect(`${dir}${entry.name}/`) : [`${dir}${entry.name}`]);
  const paths = [...collect('scripts/'), ...collect('tests/')].sort();
  const files = Object.fromEntries(paths.map(file => [file, sha256(readFileSync(new URL(file,root)))]));
  return { algorithm:'sha256', verifier:sha256(JSON.stringify(files)), files };
}
