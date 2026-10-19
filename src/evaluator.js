import { content } from './content.js';
import { renderResult } from './format.js';

export class ContractError extends TypeError {}
export const fields = Object.freeze([...content.evaluator.input.field_order]);

export function validateInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(input)) ||
      Reflect.ownKeys(input).length !== fields.length) {
    throw new ContractError('Expected a plain record with exactly five fields.');
  }
  for (const field of fields) {
    const descriptor = Object.getOwnPropertyDescriptor(input, field);
    if (!descriptor || !Object.hasOwn(descriptor, 'value') ||
        !content.evaluator.input.domains[field].includes(descriptor.value)) {
      throw new ContractError(`Invalid ${field}.`);
    }
  }
  return input;
}

// Production uses guarded fact predicates, never the independent pair tables.
export function evaluate(input) {
  validateInput(input);
  const { path: p, gate: g, map_evidence: m, notice_evidence: n, conclusion: c } = input;
  const f = content.evaluator.facts;
  const admissionClaim = c === 'C1' || c === 'C2';
  const predicates = {
    ROUTE_GATE_CONFLICT: p !== null && g !== null && f.destination[p] !== g,
    CONCLUSION_NOTICE_CONFLICT: admissionClaim && n !== null && f.conclusion_admission[c] !== f.notice_detail[n].admits,
    CONCLUSION_ADMISSION_CONFLICT: admissionClaim &&
      ((g !== null && f.conclusion_admission[c] !== f.admission[g]) ||
       (p !== null && f.conclusion_admission[c] !== f.admission[f.destination[p]])),
    UNSUPPORTED_QUICKEST: c === 'C3',
    MAP_EVIDENCE_IRRELEVANT: m !== null &&
      ((p !== null && f.map_detail[m].path !== p) || (g !== null && f.map_detail[m].gate !== g)),
    NOTICE_EVIDENCE_IRRELEVANT: n !== null &&
      ((g !== null && f.notice_detail[n].gate !== g) ||
       (p !== null && f.notice_detail[n].gate !== f.destination[p])),
    EVIDENCE_DISCONNECTED: m !== null && n !== null && f.map_detail[m].gate !== f.notice_detail[n].gate,
    MISSING_PATH: p === null,
    MISSING_GATE: g === null,
    WRONG_ENTRANCE: p === 'North' || g === 'Willow',
    MISSING_MAP_EVIDENCE: m === null,
    MISSING_NOTICE_EVIDENCE: n === null,
    MISSING_CONCLUSION: c === null,
  };
  const issues = content.evaluator.issue_order.filter(code => predicates[code]);
  const complete = p === 'South' && g === 'Bell' && m === 'M2' && n === 'N1' && c === 'C1';
  const actionable = p === 'South' && g === 'Bell' && !issues.some(code =>
    ['ROUTE_GATE_CONFLICT', 'CONCLUSION_NOTICE_CONFLICT', 'CONCLUSION_ADMISSION_CONFLICT'].includes(code));
  if ((issues.length === 0) !== complete) throw new ContractError('Inconsistent authored classification.');
  return renderResult(input, issues, actionable, complete);
}
