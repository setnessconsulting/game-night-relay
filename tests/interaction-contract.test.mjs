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
  assert.equal(r5.payload.revision_5_basis.previous_brief_sha256,'649086df0874db63393571313091ab1ad5d14fb06de071105188822c35d99e6d');
});
test('the two presentation steps cover each independent decision once',()=>{
  assert.deepEqual(Object.values(r5.payload.interaction_contract.steps).flat(),r4.payload.evaluator_contract.input.field_order);
});
