// Copies authored data only. Never generates expected outputs from production code.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

export const hashes = {
  'game-vision.json': 'bf25a8f68e17c6f2ed99d0afd78ff9235bd2efb17c07325309e27b26fad5dd5b',
  'vertical-slice-brief.json': '649086df0874db63393571313091ab1ad5d14fb06de071105188822c35d99e6d',
};
for (const [file, hash] of Object.entries(hashes)) {
  const bytes = readFileSync(new URL(`../docs/design/${file}`, import.meta.url));
  if (createHash('sha256').update(bytes).digest('hex') !== hash) throw Error(`Design drift: ${file}`);
}
const brief = JSON.parse(readFileSync(new URL('../docs/design/vertical-slice-brief.json', import.meta.url)));
const payload = brief.payload;
const { pair_table_oracle, golden_results, ...productionContract } = payload.evaluator_contract;
const authored = {
  scenario: payload.scenario_content,
  message: payload.message_contract,
  cases: payload.recipient_response_cases,
  evaluator: productionContract,
};
mkdirSync(new URL('../src/', import.meta.url), { recursive: true });
mkdirSync(new URL('../tests/fixtures/', import.meta.url), { recursive: true });
writeFileSync(new URL('../src/content.js', import.meta.url),
  '// Authored revision-4 data. Regenerate only after explicit contract review.\n' +
  `export const content = ${JSON.stringify(authored, null, 2)};\n`);
// This separate frozen fixture has no production predicates or computed results.
const fixture = {
  brief_sha256: hashes['vertical-slice-brief.json'],
  input: payload.evaluator_contract.input,
  tables: pair_table_oracle,
  priority: payload.evaluator_contract.issue_order,
  rules: payload.evaluator_contract.issue_rules.map(({ when, ...rule }) => rule),
  headings: payload.evaluator_contract.feedback_headings,
  rendering: payload.evaluator_contract.rendering,
  sources: payload.scenario_content,
  conclusions: payload.message_contract.conclusion_choices,
  overrides: payload.recipient_response_cases.map(c => ({ tuple: c.input_tuple, text: c.recipient_interpretation })),
  goldens: golden_results,
};
writeFileSync(new URL('../tests/fixtures/revision-4-oracle.json', import.meta.url), JSON.stringify(fixture, null, 2) + '\n');
console.log('Extracted reviewed authored data; no evaluator executed.');
