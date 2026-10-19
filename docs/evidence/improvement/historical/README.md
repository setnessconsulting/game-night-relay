# Evidence lanes

Evidence is for this uncommitted worktree, based on game main
`2c46b0eb4c1e83585e234f891c92eb3498ce3802`, not an invented implementation SHA.
Use the runtime SHA-256 manifest in `browser-results.json` and the verification
record for exact file identity. Re-run affected checks after source/test drift.

| Lane | Evidence / status |
| --- | --- |
| Artifact validity | `validate-design.py`: Game Maker validator plus governing JSON Schema. Original design states stay NOT_RUN. |
| Automated evaluator/state | `npm test`: full independent 324-tuple sweep, all 26 authored goldens, eight exact overrides, invalid inputs, sensitivity and state tests. |
| Automated browser | `browser-results.json`: exact environment, checks, errors, supplemental engine availability, privacy/offline observations and limitations. Screenshots are observations of that build. |
| Manual/visual | Implementer screenshot inspection and any recorded targeted walkthrough, limited to stated environment. Not human learner/AT evidence. |
| Accessibility | Automated keyboard/DOM/axe/reflow/contrast are supporting evidence. NVDA/VoiceOver, physical device matrix, human independent review and disabled-player feedback remain NOT_RUN. |
| Learner | Intended-age observation NOT_RUN. |
| Educator/content | Human review NOT_RUN. |
| Owner acceptance | PENDING; provisional coding decisions are not acceptance. |
| Hosted CI/provider | NOT_RUN; no PR and no Jenkins/Actions build dispatched. |
| Release | NOT_AUTHORIZED; no publication or deployment. |

`browser-first-run.json` retains the initial runner failure: its keyboard test
incorrectly assumed which radio receives native Tab entry. The harness was fixed
to navigate from the actual focused choice. The final run is in
`browser-results.json`. Screenshot export was also corrected to decode Windows
file URLs containing spaces. Neither fix changed authored game rules.

Implementer visual inspection found the desktop and narrow screenshots readable,
with separated source and message regions, no clipped prose, and source-feedback
actions visible. This is an AI implementer's visual inspection, not a human
accessibility or intended-age playtest.

No absence of an automated finding establishes human accessibility conformance,
age suitability, learning effectiveness, product acceptance or release readiness.
