# Provisional implementation decisions

The owner explicitly adopted all three provisional defaults in this implementation
chat on 2026-10-18 (America/Los_Angeles): revision 4's one-scenario design and
evaluator; a static browser application with offline operation after loading and
no learner-data persistence/transmission; and the proposed Grade 4 audience
(about ages 9–10) and calm festival visitor portrayal with an explicit step-free
need. These are coding decisions, not learner/content acceptance or release.

The exact plan was read from chat `01a1520e-41b3-79b1-9b2f-49fefb678c63` and
the Luna Max review from `01a15212-cff0-71d1-aaef-3b24b02cb899`.
The reviewer closed the determinism finding at specification level. This session
implements and checks it; it does not manufacture a formal independent review.
No Astra invocation was used in this session.

## Source identity and isolation

Base: live game `main` at `2c46b0eb4c1e83585e234f891c92eb3498ce3802`.
Branch: `codex/night-relay-slice-20261018`, separate worktree. At the time of
this report, these changes were local and uncommitted; they were subsequently
committed in PR #2. Runtime evidence uses a SHA-256 file manifest from
`scripts/build-identity.mjs`; a base SHA alone does not identify changed code.

The two JSON artifacts were copied only after source digest checks, with original
files preserved in the design worktree:

| Artifact | Reviewed SHA-256 (UTF-8 with CRLF normalized to LF) |
| --- | --- |
| GameVision | `e0c232b5b22bcf73af060ee8473a6af0765a03bad7c10c4b2b12398c664be8ad` |
| VerticalSliceBrief | `a2bfe2293fa6e39f3bf5a0e8adcc5a26ecd44ddcb6054ce8328eff66770e7c84` |
| Revision-5 VerticalSliceBrief | `2ce2669ed97a54da5a237a58e113f4566dec5e596f338d48128ba63e78401f04` |

Both retain their original proposal/design-intent metadata and `NOT_RUN` state.
Their historical limitations remain part of those frozen documents; current
decisions, review references and implementation evidence are recorded separately.

Read-only official Atlassian MCP preflight inspected AIPORT-193 and all 28 direct
children (pagination complete). AIPORT-193 is Done; 24 children are Done and four
are Wont Do. This is the orchestration epic, explicitly excluding construction
of a particular production game. None of those children names Night Relay.
An additional text search found documentation/portfolio/CI references, not a
Night Relay revision-4 gameplay acceptance ticket. This implementation uses the
owner's separate game authorization and the reviewed brief, and does not assert
that AIPORT-193 accepts the game. No Jira write was made.

Game Maker guidance was inspected at local clean `main`
`2ffdd9802a8d42c7e18df509141bceb8c71eb22b`. Its orchestration contracts/guidance
are reused; its fixtures and production code were not changed. No Unity,
Blender, Figma, Sentry or other integration is needed for this static scene.

## Architecture and boundaries

- `content.js`: authored scenario, copy, rendering rules and source facts,
  extracted from the frozen brief. Production receives no pair-table oracle or
  golden expected results.
- `evaluator.js`: pure guarded predicates over exactly five validated fields;
  all matching issues are collected in the authored priority order.
- `format.js`: authored exact-tuple recipient overrides or five fixed fragments;
  ordered source statuses, rows, links and focus. No generated dialogue.
- `session.js`: editable draft, separate submitted snapshot/result, assistance
  history and replay context in memory. Evaluation failures preserve the draft.
- `app.js`: semantic document, native radios and buttons, source targets and
  invoking-control focus restoration. No routing, timeout, score or auto-advance.
- `bootstrap.js`: enables play only when all modules/data and stylesheet load.
- `serve.mjs`: loopback-only static preview, serves only index and runtime source.
  No write endpoint or learner-data receiver.

Runtime has no package dependencies. Browser verification dependencies are pinned
in the lockfile. The package installation used the existing local npm cache with
scripts disabled and offline resolution. JSON Schema validation used pinned
`jsonschema==4.26.0` from the local uv cache; no Game Maker environment mutation.

The test oracle is separately implemented in `tests/oracle.mjs`, using the frozen
authored fixture's nine pair rows and eight unary rows, with no production import.
It builds complete expected outputs independently. Fixture equality to the
reviewed brief is checked before testing. Its provenance is authored design
data, not a snapshot of production results. The implementer reviewed the table,
copy and golden bindings; no separate human/model fixture approval is claimed.

## Deferred gates and risks

The acceptance owner, formal completion contract, exact physical browser/device/
assistive-technology matrix, numerical device-performance budgets, human content
and accessibility reviews, intended-age observation and release authorization
remain open. The matrix in `docs/acceptance/README.md` is a proposed evidence map,
not an owner-adopted `DONE.md` contract.

Structured choices allow guessing and memorization. One scenario and repeated
repair cannot establish transfer, mastery or learning effectiveness. No curriculum
alignment claim is shown in the game. Proposed standards notes remain frozen
design context only.

No hosted CI, GitHub protection, Jenkins qualification or deployment result is
claimed. Future PR work must invoke `jenkins-admin` and reread the live workspace
procedure, GitHub protection and catalog, recording both Jenkins repository main
revisions and exact PR head. Required Jenkins with no catalog lane blocks merge;
App 5043075 success must be on the exact head when required. Use the eligible
poller path, do not dispatch builds or rerun residual Actions, and self-review
the exact live head and unresolved threads before merge or handoff.

No PR, commit, push, deployment, publication or external-service write is part of
this work. Verification and acceptance remain separate from release.
