import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { evaluate, ContractError } from '../src/evaluator.js';
import { preview } from '../src/format.js';
import { fixture, tuples, asRecord, expectedResult } from './oracle.mjs';

test('frozen oracle fixture is bound to the exact reviewed authoring, without production output', () => {
  const bytes = readFileSync(new URL('../docs/design/vertical-slice-brief.json', import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), fixture.brief_sha256);
  const p = JSON.parse(bytes).payload;
  assert.deepEqual(fixture.tables, p.evaluator_contract.pair_table_oracle);
  assert.deepEqual(fixture.priority, p.evaluator_contract.issue_order);
  assert.deepEqual(fixture.rules, p.evaluator_contract.issue_rules.map(({ when, ...rule }) => rule));
  assert.deepEqual(fixture.headings, p.evaluator_contract.feedback_headings);
  assert.deepEqual(fixture.rendering, p.evaluator_contract.rendering);
  assert.deepEqual(fixture.sources, p.scenario_content);
  assert.deepEqual(fixture.conclusions, p.message_contract.conclusion_choices);
  assert.deepEqual(fixture.goldens, p.evaluator_contract.golden_results);
  assert.deepEqual(fixture.overrides, p.recipient_response_cases.map(c => ({ tuple:c.input_tuple, text:c.recipient_interpretation })));
  assert.equal(fixture.tables.rows.length, 9);
  assert.equal(fixture.tables.unary_rows.length, 8);
  const oracleSource = readFileSync(new URL('./oracle.mjs', import.meta.url), 'utf8');
  assert.ok(!oracleSource.includes('../src/'));
});

test('all 324 unique domain tuples match complete independent table-derived output', () => {
  const seen = new Set(); let complete = 0;
  for (const tuple of tuples()) {
    const key = JSON.stringify(tuple);
    assert.ok(!seen.has(key)); seen.add(key);
    const input = Object.freeze(asRecord(tuple));
    const actual = evaluate(input);
    assert.deepEqual(actual, expectedResult(tuple), key);
    assert.deepEqual(evaluate(input), actual, `determinism ${key}`);
    assert.deepEqual(input, asRecord(tuple), `no input mutation ${key}`);
    assert.equal(new Set(actual.issues).size, actual.issues.length);
    assert.equal(actual.issues.length === 0, actual.complete);
    assert.equal(actual.recipient_text.includes('undefined'), false);
    assert.equal(actual.recipient_text.includes('{'), false);
    complete += Number(actual.complete);
  }
  assert.equal(seen.size, 324);
  assert.equal(complete, 1);
});

assert.equal(fixture.goldens.length, 26);
for (const golden of fixture.goldens) test(`authored golden: ${golden.id}`, () => {
  const expected = expectedResult(golden.input);
  const actual = evaluate(asRecord(golden.input));
  for (const [field, value] of Object.entries(golden.expected)) {
    assert.deepEqual(actual[field], value, `production ${field}`);
    assert.deepEqual(expected[field], value, `independent oracle ${field}`);
  }
  assert.deepEqual(actual, expected);
});

test('exactly eight recipient overrides; same-class neighbours use fragments', () => {
  assert.equal(fixture.overrides.length, 8);
  for (const override of fixture.overrides) {
    assert.equal(evaluate(asRecord(override.tuple)).recipient_text, override.text);
  }
  for (const tuple of tuples()) {
    if (!fixture.overrides.some(item => JSON.stringify(item.tuple) === JSON.stringify(tuple))) {
      const result = evaluate(asRecord(tuple));
      assert.ok(!fixture.overrides.some(item => item.text === result.recipient_text));
      assert.equal(result.recipient_text, expectedResult(tuple).recipient_text);
    }
  }
});

test('invalid input fails as an implementation contract error without coercion', () => {
  const good = asRecord(['South', 'Bell', 'M2', 'N1', 'C1']);
  const bad = [undefined, null, [], 'South', 5, true, new Date(), new Map(), { ...good, extra: null }];
  for (const field of fixture.input.field_order) {
    const missing = { ...good }; delete missing[field]; bad.push(missing);
    for (const value of ['', 'south', 'South Path', 'unknown', 'M3', 0, false, {}, [], undefined]) bad.push({ ...good, [field]: value });
  }
  bad.push(Object.create(good));
  bad.push({ ...good, [Symbol('extra')]: 'x' });
  const accessor = { ...good }; Object.defineProperty(accessor, 'path', { get() { throw Error('must not read accessor'); } }); bad.push(accessor);
  for (const input of bad) assert.throws(() => evaluate(input), ContractError);
});

test('preview exposes blanks and never fills a field from evidence', () => {
  const input = asRecord([null, null, 'M2', 'N1', 'C1']);
  assert.match(preview(input), /\[path missing\].*\[gate missing\]/);
  assert.match(preview(input), /\(M2\).*\(N1\)/);
  assert.equal(input.path, null); assert.equal(input.gate, null);
});

test('oracle comparison detects secondary, priority, blank, link and override defects', () => {
  const mixed = ['South', 'Willow', 'M2', 'N2', 'C2'];
  const reference = expectedResult(mixed);
  const dropped = structuredClone(reference); dropped.secondary_issues.pop();
  const swapped = structuredClone(reference); [swapped.issues[0], swapped.issues[1]] = [swapped.issues[1], swapped.issues[0]];
  const link = structuredClone(reference); link.source_rows[0].links[0] = 'N2';
  for (const mutant of [dropped, swapped, link]) assert.throws(() => assert.deepEqual(mutant, reference));
  assert.throws(() => assert.deepEqual(evaluate(asRecord(['South', 'Bell', 'M2', 'N1', 'C1'])), expectedResult(['South', null, 'M2', 'N1', 'C1'])));
  const neighbour = ['South', 'Bell', null, null, null];
  const wrongOverride = expectedResult(neighbour); wrongOverride.recipient_text = fixture.overrides[1].text;
  assert.throws(() => assert.deepEqual(wrongOverride, expectedResult(neighbour)));
});
