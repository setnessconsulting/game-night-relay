# Revision 5: focused interaction improvement

## Baseline and isolation

Source: `<user-profile>\Desktop\AI Projects\02-setnessconsulting\_worktrees\game-night-relay-slice-20261018`.
Baseline branch: `codex/night-relay-slice-20261018`.
Baseline HEAD: `2c46b0eb4c1e83585e234f891c92eb3498ce3802`.

The source had modified README.md and STATUS.md plus untracked .gitignore, docs,
index.html, package files, scripts, src and tests. An independent directory copy
at `game-night-relay-improved-20261018` included all 253 files, including installed
node_modules. Every file hash was compared before edits. Only the `.git` pointer
was excluded to prevent accidental operations on the original repository. No
reset, stash, commit, push, PR or source edit was used. The full initial status,
file hashes and final source-preservation check are in the evidence directory.

The original design, acceptance matrix, implementation notes, tests and evidence
were inspected. Existing evidence was used only to understand prior scope and
harness limitations. It was not counted as a new result. The three required
commands were freshly run on the copied baseline before implementation. Original
evidence is separately preserved under `improvement/historical/`.

## Opportunities selected before implementation

| Opportunity | Intended player benefit | Risk and control |
| --- | --- | --- |
| Separate planning from explaining | Give attention to a small decision group with a persistent route summary | Hidden controls could be confusing; both named steps are always available, preserve choices and allow partial Send |
| Select evidence where it is read | Turn source use into an explicit action; avoid remembering source IDs across a long page | Could reveal or infer an answer; both alternatives are selectable and only the requested evidence field changes |
| Repair directly from feedback | Get from a specific issue to the relevant choice, retaining context and work | Could over-help; preserve the authored prompt, all secondary issues and explicit-only answer reveal |

All three form one focused set. No new scenario, score, progression, account,
timer, remote asset, runtime dependency or learner persistence was added. The
new end card repeats the submitted supported message; it does not invent travel
or a visitor outcome. The map reflects the chosen path, never its correctness.

## Contract and implementation

The frozen `game-vision.json` and `vertical-slice-brief.json` are unchanged and
retain design-intent NOT_RUN. Their content pins use UTF-8 text with CRLF
normalized to LF so Git checkout settings do not change the digest. The
revision-5 brief is a separate traceable revision using the inspected local Game
Maker template and governing schema. Its previous-brief digest now matches the
tracked revision-4 artifact; the revision-5 snapshot digest was recomputed from
that exact manifest. Historical source and review metadata remains historical;
there is no new owner-approval or remote-freshness claim.

Evaluator rules did not change. The independently authored revision-4 table
oracle, goldens and fixture are byte-for-byte preserved, as are content.js,
evaluator.js, format.js and session.js. New interaction expectations were authored
in `tests/fixtures/revision-5-interactions.json` without running the implementation
to produce expected results. Contract tests enforce unchanged evaluator, facts,
messages and overrides across revisions. Browser tests verify native navigation,
keyboard activation, source-only edits, repair into hidden steps, stale feedback,
completion snapshots, replay resets and narrow layout. The full 324-tuple exact
output comparison still runs both in unit tests and the connected UI.

Runtime remains static HTML/CSS/vanilla JavaScript modules, a local Node server,
Node >=24, no build and no runtime dependencies. Existing development-only tools
remain Playwright 1.64.1 and @axe-core/playwright 4.13.0; the lockfile is unchanged.
All runtime modules and CSS load before readiness. No lazy network fetch, remote
asset or persistence was introduced. Offline means the already-loaded session,
including revision and replay; it does not mean offline reload or first visit.

## Observable comparison

The matching capture script drives the same wrong-entrance tuple
North/Willow/M1/N2/C2 and supported tuple South/Bell/M2/N1/C1 in both versions.
It records browser version, viewports, runtime manifest and verifier manifest.

| Behavior | Fresh baseline | Revision 5 |
| --- | --- | --- |
| Initial radio choices displayed | All 11 across five groups | Four across path/gate; seven in the separately accessible reason step |
| Source details | Read-only facts, repeated in choices | Facts also have explicit selection controls with synchronized pressed state |
| Repair | One primary Revise action | Every issue can open its own field and retain its prompt beside the choices |
| Map at 390 pixels | Hidden | Readable route branches, with an explicit chosen-path marker |
| Completed result | Recipient echo and source status | Same exact checks plus the supported submitted message to reread |
| Start document height at 1280×900 | 2329 px | 1686 px |
| Start document height at 390×844 | 3624 px | 3281 px |

The whole page remains scrollable, especially on narrow screens. Completion is
not universally shorter: the new end card adds content. These are interface
observations, not evidence of lower cognitive load, improved learning or better
outcomes for children. Structured choices still permit guessing; one scenario
cannot establish transfer or mastery. Per-issue prompts still use revision 4's
wording, whose reading level needs educator review.

## Verification boundaries

Fresh command records and browser checks live under `improvement/after/`.
The first revised browser run failed because a new narrow test assumed a blank
plan step while the preceding test had left a completed reason step. The runner
now explicitly replays before that scenario. The failure is retained. Contrast
checks were updated to measure the current computed palette rather than retain
old color constants. No runtime change was made to conceal either test issue.

The bare Game Maker Python environment lacked jsonschema. Validation subsequently
used the existing Python 3.12 interpreter with existing cached jsonschema 4.26.0,
referencing 0.37.0, attrs 26.1.0, jsonschema-specifications 2025.9.1 and rpds-py
2026.9.1 libraries. The first cached rpds choice was for Python 3.11 and failed;
the matching existing cp312 library was used. Nothing was installed or downloaded.
These are verifier-only libraries and have no browser/runtime role.

All human gates remain open: intended-age playtesting, educator review,
independent accessibility review, disabled-player feedback and owner acceptance.
Actual NVDA/VoiceOver, physical device/browser coverage, 400% browser zoom and
release/deployment review remain separate. No learning effectiveness,
accessibility conformance, approval, hosted CI, release readiness or deployment
is claimed.
