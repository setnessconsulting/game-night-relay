// Deliberately imports no production module, predicate, formatter, or helper.
import { readFileSync } from 'node:fs';
export const fixture = JSON.parse(readFileSync(new URL('./fixtures/revision-4-oracle.json', import.meta.url)));
const fieldOrder = fixture.input.field_order;

export function* tuples(position = 0, prefix = []) {
  if (position === fieldOrder.length) { yield prefix; return; }
  for (const value of fixture.input.domains[fieldOrder[position]]) yield* tuples(position + 1, [...prefix, value]);
}
export const asRecord = tuple => Object.fromEntries(fieldOrder.map((field, i) => [field, tuple[i]]));

export function expectedResult(tuple) {
  const record = asRecord(tuple);
  const found = new Set();
  for (const row of fixture.tables.rows) {
    if (row.pairs.some(pair => pair.every((value, i) => value === record[row.fields[i]]))) found.add(row.issue);
  }
  for (const row of fixture.tables.unary_rows) if (record[row.field] === row.equals) found.add(row.issue);
  const issues = fixture.priority.filter(code => found.has(code));
  const firstRule = fixture.rules.find(rule => rule.code === issues[0]);
  const feedbackClass = firstRule ? firstRule.feedback_class : 'complete_supported';
  const complete = JSON.stringify(tuple) === '["South","Bell","M2","N1","C1"]';
  const actionable = tuple[0] === 'South' && tuple[1] === 'Bell' &&
    !issues.some(issue => fixture.priority.slice(0, 3).includes(issue));
  const override = fixture.overrides.find(item => JSON.stringify(item.tuple) === JSON.stringify(tuple));
  const facts = [...fixture.sources.route_guide.facts, ...fixture.sources.festival_notice.facts, ...fixture.conclusions];
  const values = [
    ['path_display', fixture.input.display_names[tuple[0]]],
    ['gate_display', fixture.input.display_names[tuple[1]]],
    ['map_text', facts.find(item => item.id === tuple[2])?.text],
    ['notice_text', facts.find(item => item.id === tuple[3])?.text],
    ['conclusion_text', facts.find(item => item.id === tuple[4])?.text],
  ];
  const fragments = fieldOrder.map((field, index) => {
    const definition = fixture.rendering.recipient_fragments[field];
    if (tuple[index] === null) return definition.null;
    let text = definition.selected;
    for (const [token, value] of values) if (value !== undefined) text = text.split(`{${token}}`).join(value);
    return text;
  });
  const status = fixture.rendering.source_status_rules.find(rule =>
    rule.when === (complete ? 'complete=true' : actionable ? 'complete=false AND actionable_plan=true' : 'complete=false AND actionable_plan=false'));
  return {
    issues, primary_issue: issues.at(0) ?? null, secondary_issues: issues.slice(1),
    feedback_class: feedbackClass, feedback_heading: fixture.headings[feedbackClass],
    actionable_plan: actionable, complete, recipient_text: override?.text ?? fragments.join(' '),
    source_status: { text: status.text, links: structuredClone(status.links), actions: structuredClone(status.actions) },
    source_rows: issues.map(code => {
      const row = fixture.rules.find(item => item.code === code);
      return { code, text: row.source_text, links: row.links.map(link => link === 'selected_notice' ? record.notice_evidence : link) };
    }),
    revision_focus: firstRule?.focus_field ?? 'path',
  };
}
