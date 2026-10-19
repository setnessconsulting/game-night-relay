import { content } from './content.js';

const contract = content.evaluator;
const rules = new Map(contract.issue_rules.map(rule => [rule.code, rule]));
const sourceTexts = new Map([
  ...content.scenario.route_guide.facts,
  ...content.scenario.festival_notice.facts,
  ...content.message.conclusion_choices,
].map(fact => [fact.id, fact.text]));

export function recipientText(input) {
  const tuple = contract.input.field_order.map(field => input[field]);
  const override = content.cases.find(item => item.input_tuple.every((value, i) => value === tuple[i]));
  if (override) return override.recipient_interpretation;
  const replacements = {
    path_display: contract.input.display_names[input.path],
    gate_display: contract.input.display_names[input.gate],
    map_text: sourceTexts.get(input.map_evidence),
    notice_text: sourceTexts.get(input.notice_evidence),
    conclusion_text: sourceTexts.get(input.conclusion),
  };
  return contract.input.field_order.map(field => {
    const fragments = contract.rendering.recipient_fragments[field];
    return input[field] === null ? fragments.null :
      fragments.selected.replace(/\{(\w+)\}/g, (_, key) => replacements[key]);
  }).join(' ');
}

export function renderResult(input, issues, actionable, complete) {
  const primary = issues[0] ?? null;
  const rule = rules.get(primary);
  const feedbackClass = rule?.feedback_class ?? 'complete_supported';
  const status = contract.rendering.source_status_rules[complete ? 0 : actionable ? 1 : 2];
  return {
    issues: [...issues], primary_issue: primary, secondary_issues: issues.slice(1),
    feedback_class: feedbackClass, feedback_heading: contract.feedback_headings[feedbackClass],
    actionable_plan: actionable, complete,
    recipient_text: recipientText(input),
    source_status: { text: status.text, links: [...status.links], actions: [...status.actions] },
    source_rows: issues.map(code => ({
      code, text: rules.get(code).source_text,
      links: rules.get(code).links.map(link => link === 'selected_notice' ? input.notice_evidence : link),
    })),
    revision_focus: rule?.focus_field ?? 'path',
  };
}

export function preview(input) {
  return `Take ${contract.input.display_names[input.path] ?? '[path missing]'} from Festival Plaza to ` +
    `${contract.input.display_names[input.gate] ?? '[gate missing]'}. My reason is that the route guide says ` +
    `${sourceTexts.get(input.map_evidence) ?? '[route-guide detail missing]'} ` +
    `(${input.map_evidence ?? 'no guide detail'}), and tonight's notice says ` +
    `${sourceTexts.get(input.notice_evidence) ?? '[notice detail missing]'} ` +
    `(${input.notice_evidence ?? 'no notice detail'}). ` +
    `${sourceTexts.get(input.conclusion) ?? '[conclusion missing]'}`;
}
