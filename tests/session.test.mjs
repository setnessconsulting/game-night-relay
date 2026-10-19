import test from 'node:test';
import assert from 'node:assert/strict';
import { createSession } from '../src/session.js';
import { evaluate } from '../src/evaluator.js';
const answer = { path:'South', gate:'Bell', map_evidence:'M2', notice_evidence:'N1', conclusion:'C1' };
const chooseAnswer = session => { for (const [k,v] of Object.entries(answer)) session.choose(k,v); };

test('blank start, partial Send, independent edits, revision and submitted snapshot', () => {
  const s = createSession();
  assert.ok(Object.values(s.snapshot.draft).every(v => v === null));
  assert.equal(s.snapshot.result, null);
  assert.equal(s.send().ok, true);
  assert.equal(s.snapshot.context.kind, 'first_submission');
  assert.equal(s.revise(), 'path');
  const previous = s.snapshot;
  s.choose('path', 'South');
  assert.equal(s.snapshot.draft.gate, null);
  assert.deepEqual(s.snapshot.result, previous.result);
  assert.deepEqual(s.snapshot.submitted, previous.submitted);
  assert.equal(s.snapshot.draft.path, 'South');
  const detached = s.snapshot; detached.draft.path = 'North';
  assert.equal(s.snapshot.draft.path, 'South');
  assert.throws(() => s.choose('gate', 'Bell Gate'));
  assert.throws(() => s.choose('not_a_field', null));
  s.send(); assert.equal(s.snapshot.context.kind, 'revision');
});

test('source inspection and help preserve selections and identify later submissions', () => {
  const s = createSession(); chooseAnswer(s); s.choose('conclusion', null); s.send();
  const original = s.snapshot.draft;
  s.inspectSource(); assert.deepEqual(s.snapshot.draft, original);
  assert.equal(s.revise(), 'conclusion');
  s.send(); assert.equal(s.snapshot.context.kind, 'source_prompted_revision');
  s.reveal(); assert.deepEqual(s.snapshot.draft, original);
  s.choose('conclusion', 'C1'); s.send();
  assert.equal(s.snapshot.result.complete, true);
  assert.equal(s.snapshot.context.kind, 'explicit_answer_help_revision');
  assert.equal(s.snapshot.context.assisted, true);
  assert.equal(s.revise(), 'path');
  s.choose('conclusion', 'C3'); s.send();
  assert.equal(s.snapshot.context.assisted, true);
});

test('completion and Replay alone explicitly clear the draft and help history', () => {
  const s = createSession(); chooseAnswer(s); s.reveal(); s.send();
  assert.equal(s.snapshot.result.complete, true);
  s.replay();
  const replay = s.snapshot;
  assert.ok(Object.values(replay.draft).every(v => v === null));
  assert.equal(replay.submitted, null); assert.equal(replay.result, null);
  assert.equal(replay.answerHelp, false); assert.equal(replay.sourceHelp, false);
  assert.equal(replay.explanationVisible, false); assert.equal(replay.isReplay, true);
  assert.equal(replay.sequence, 1);
  s.send(); assert.equal(s.snapshot.context.replay, true);
  assert.equal(s.snapshot.context.kind, 'first_submission');
  s.replay(); assert.equal(s.snapshot.sequence, 2);
});

test('implementation failure retains the draft and never completes a failed Send', () => {
  let fail = false;
  const s = createSession({ evaluator: input => { if(fail) throw new TypeError('contract failure'); return evaluate(input); } });
  chooseAnswer(s); s.send();
  fail = true; s.choose('conclusion', 'C3');
  const before = s.snapshot;
  const failed = s.send();
  assert.deepEqual(failed, { ok:false, result:null });
  assert.deepEqual(s.snapshot.draft, before.draft);
  assert.deepEqual(s.snapshot.submitted, before.submitted);
  assert.deepEqual(s.snapshot.result, before.result);
  assert.equal(s.snapshot.submissions, before.submissions);
  assert.ok(s.snapshot.failure);
});
