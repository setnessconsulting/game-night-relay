import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => JSON.parse(readFileSync(new URL(path,import.meta.url)));
const r4=read('../docs/design/vertical-slice-brief.json');
const r5=read('../docs/design/vertical-slice-brief-r5.json');
test('revision 5 changes the interaction contract without changing any evaluator expectation',()=>{
  for(const key of ['evaluator_contract','scenario_content','message_contract','recipient_response_cases']) assert.deepEqual(r5.payload[key],r4.payload[key],key);
  assert.equal(r5.result_state,'NOT_RUN');
  assert.equal(r5.evidence_class,'design_intent');
  assert.equal(r5.payload.revision_5_basis.previous_brief_sha256,'a2bfe2293fa6e39f3bf5a0e8adcc5a26ecd44ddcb6054ce8328eff66770e7c84');
});
test('the two presentation steps cover each independent decision once',()=>{
  assert.deepEqual(Object.values(r5.payload.interaction_contract.steps).flat(),r4.payload.evaluator_contract.input.field_order);
});
