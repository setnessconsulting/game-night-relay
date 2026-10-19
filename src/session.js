import { evaluate, fields, validateInput } from './evaluator.js';

const blank = () => Object.fromEntries(fields.map(field => [field, null]));
const copy = value => structuredClone(value);

export function createSession({ evaluator = evaluate } = {}) {
  let state = { draft: blank(), submitted: null, result: null, failure: null,
    sequence: 0, submissions: 0, isReplay: false, answerHelp: false, sourceHelp: false,
    explanationVisible: false, context: null };
  return {
    get snapshot() { return copy(state); },
    choose(field, value) {
      if (!fields.includes(field)) {
        state.failure = 'This choice could not be used. Your draft is still here. Please try again.';
        throw new TypeError('Unknown choice field.');
      }
      const next = { ...state.draft, [field]: value };
      try { validateInput(next); }
      catch (error) {
        state.failure = 'This choice could not be used. Your draft is still here. Please try again.';
        throw error;
      }
      state.draft = next;
      state.failure = null;
    },
    send() {
      const submitted = copy(state.draft);
      try {
        const result = evaluator(submitted);
        state.submitted = submitted;
        state.result = result;
        state.failure = null;
        state.context = {
          kind: state.answerHelp ? 'explicit_answer_help_revision' :
            state.submissions === 0 ? 'first_submission' :
              state.sourceHelp ? 'source_prompted_revision' : 'revision',
          assisted: state.answerHelp, replay: state.isReplay,
        };
        state.submissions += 1;
        return { ok: true, result: copy(result) };
      } catch {
        state.failure = 'The message could not be checked. Your draft is still here. Please try again.';
        return { ok: false, result: null };
      }
    },
    revise() { return state.result?.revision_focus ?? 'path'; },
    inspectSource() { if (state.submitted) state.sourceHelp = true; },
    reveal() { state.answerHelp = true; state.explanationVisible = true; },
    replay() {
      state = { draft: blank(), submitted: null, result: null, failure: null,
        sequence: state.sequence + 1, submissions: 0, isReplay: true,
        answerHelp: false, sourceHelp: false, explanationVisible: false, context: null };
    },
  };
}
