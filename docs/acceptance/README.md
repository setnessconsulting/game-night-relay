# Proposed criterion-to-evidence matrix

This maps revision-4 requirements to code and verification. It is not a formal
completion contract or owner acceptance. Exact current results belong in the
evidence directory and must match the runtime file manifest.

| Criterion | Implementation and automated coverage | Remaining acceptance evidence |
| --- | --- | --- |
| G1 complete loop | App, session; state suite and connected browser loop | Human walkthrough on agreed devices |
| G2 accurate separate sources | Frozen authored content; source equality, DOM checks and visual map inspection | Educator source clarity and map-equivalence review |
| G3 independent blank choices and supported completion | Strict five-domain evaluator, native independent radios; 324 sweep and state/UI tests | Learner usability |
| G4 total exact evaluator | Predicate implementation vs independent finite-table oracle; all 324 full outputs, 26 goldens, eight exact overrides, invalid inputs, sensitivity tests; connected DOM sweep | No learner or human review inferred |
| G5 preserved draft and separate feedback/help | Submitted snapshot, unchanged choices on source inspection/reveal/Revise; browser focus checks | Human comprehension and fairness review |
| G6 A1–A7 | Semantic native controls, untimed feedback, equivalent guide, responsive layout, visible focus | Each A criterion below; agreed physical matrix and independent accessibility review |
| G7 loaded-session offline and privacy | All runtime local assets loaded before readiness; no transport/storage APIs, CSP, offline loop and browser storage/network checks | Agreed-device verification; no first-load/reload offline promise |
| G8 honest observation | In-memory first/revision/source-help/answer-help/replay contexts; no score or outcome claims | Adult observation notes without names; intended-age learner evidence |

| Accessibility criterion | Supporting implementation/automated check | Still needed |
| --- | --- | --- |
| A1 keyboard | Native radios, Tab/Shift+Tab order, arrows/Space and Enter, source/help/Replay buttons | Human whole-loop keyboard and assistive-technology checks |
| A2 focus | Result heading once, issue-field Revise, named source target and exact Return, Replay request | Human visibility/unobscured focus and exact AT announcements |
| A3 semantics and announcements | Headings, legends, labeled choices, expanded help state, brief polite preview status, no result live region | NVDA/VoiceOver reading order, verbosity and announcement verification |
| A4 equivalent map | SVG has two named connections, shared start, no connecting gate line; full visible guide provides all facts | Independent map/text equivalence and disabled-player feedback |
| A5 non-color and contrast | Radio indicators, border/text states, explicit ordered issue labels, automated axe scan and contrast measurement | Human forced-colors/non-color review and device rendering |
| A6 resize/reflow | Responsive single column, wrapped controls, 320 CSS pixel and 200% text proxies | Actual 200% text resize and 400% browser zoom from 1280 CSS pixels on agreed matrix |
| A7 untimed/persistent/reduced motion | No animation, sound dependency, timeout, flashing or auto-advance; reduced-motion rule | Human persistence and AT usability review |

## Human observation protocol (not executed)

Have an intended-age reader inspect the request and both sources, choose a plan,
compose a reason and send. Adult notes distinguish actionable plan, relevant map
detail, relevant notice detail and connected explanation. Separate unassisted
first submission, source-prompted repair, explicit-answer-help repair and replay.
Do not record learner names, timing scores or a mastery verdict.

An educator reviews reading load, vocabulary, source adequacy and fairness.
Independent accessibility review and disabled-player feedback assess A1–A7 and
respectful visitor portrayal. Record disagreements and required revisions.

Before acceptance, the owner names an acceptance owner and locks the browser,
device and assistive-technology versions and completion contract. Proposed
Windows Edge/Chrome with keyboard/NVDA and iPad Safari/VoiceOver remain a proposal.
Accept against one exact build and the final criteria. Release authorization and
deployed verification/rollback remain a later, separate project.

## Revision-5 interaction extension (local evidence only)

The revision-4 rows above remain applicable. Their evaluator expectations are
unchanged. The new brief adds G9; this matrix does not constitute owner acceptance.

| Criterion | Implementation / fresh supporting checks | Pending human evidence |
| --- | --- | --- |
| G9a freely switchable planning/reason steps | app.js; keyboard full loop, partial sends, step switch preservation | Intended-age navigation comprehension |
| G9b source selection without inferred directions | Source buttons change only evidence, synchronize native radios/clear/pressed state; independent interaction fixture | Educator relevance and player source-use observation |
| G9c targeted repair | Every issue retains exact text/links and adds field-specific Edit; secondary repair opens hidden reason step with preserved choices and context | Child comprehension of feedback; assistive-technology reading/focus |
| G9d draft/sent boundary and completion | Completed message stays bound to last send; resend removes completion for a wrong draft; Replay resets markers and steps | Owner and player walkthrough |
| G9e readable narrow map | Route branches remain visible at 390 and 320 CSS pixels; text equivalence preserved | Independent accessibility review and disabled-player feedback |

See `../evidence/improvement/after/` for current records and `../improvement.md`
for the baseline comparison and tradeoffs. Frozen design result states remain
NOT_RUN; executed evidence lives separately.
