import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { sha256, buildIdentity, verificationIdentity } from './build-identity.mjs';
import { content } from '../src/content.js';
const root = new URL('../', import.meta.url);
const hashes = {
  'game-vision.json':'bf25a8f68e17c6f2ed99d0afd78ff9235bd2efb17c07325309e27b26fad5dd5b',
  'vertical-slice-brief.json':'649086df0874db63393571313091ab1ad5d14fb06de071105188822c35d99e6d',
  'vertical-slice-brief-r5.json':'efb27888920e8ec733585a8409d1622d6382e5bb2b48de759b34db099f7e4842',
};
for (const [file, hash] of Object.entries(hashes)) {
  const raw = readFileSync(new URL(`docs/design/${file}`, root));
  assert.equal(sha256(raw), hash, `design drift: ${file}`);
  assert.equal(JSON.parse(raw).result_state, 'NOT_RUN');
}
const payload = JSON.parse(readFileSync(new URL('docs/design/vertical-slice-brief.json', root))).payload;
const { pair_table_oracle, golden_results, ...contract } = payload.evaluator_contract;
assert.deepEqual(content, { scenario:payload.scenario_content, message:payload.message_contract, cases:payload.recipient_response_cases, evaluator:contract });
const files = ['src','scripts','tests'].flatMap(dir => readdirSync(new URL(`${dir}/`,root)).filter(f => /\.(?:js|mjs)$/.test(f)).map(f => `${dir}/${f}`));
for (const file of files) execFileSync(process.execPath, ['--check',fileURLToPath(new URL(file,root))]);
// Supporting static check, not a substitute for network/storage browser observation.
for (const file of files.filter(f => f.startsWith('src/'))) {
  const source = readFileSync(new URL(file,root),'utf8');
  assert.ok(!/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|serviceWorker)\b|document\.cookie/.test(source), `unexpected runtime transport/storage API: ${file}`);
}
const html = readFileSync(new URL('index.html',root),'utf8');
assert.match(html,/connect-src 'none'/);
assert.match(html,/form-action 'none'/);
console.log(JSON.stringify({syntax_files:files.length,design_hashes:hashes,authored_content:'PASS',static_privacy_boundary:'PASS',identity:buildIdentity(),verification:verificationIdentity()},null,2));
