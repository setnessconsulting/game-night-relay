# Night Relay local improvement status

The revision-5 interaction is implemented in the isolated directory
`game-night-relay-improved-20261018`. It preserves the exact dirty baseline from
`game-night-relay-slice-20261018`; it is not a new Git commit or PR.

The loop now separates route planning from explaining, allows direct evidence
selection in both sources, keeps the map at narrow widths, offers per-issue
repair with preserved choices, and presents the completed submitted message.
The evaluator and all authored revision-4 expected outputs remain unchanged.

Fresh results and exact runtime/verifier identities are in
`docs/evidence/improvement/after/verification-results.json` and
`docs/evidence/improvement/after/browser-results.json`. The latter reports the
available Chromium lane separately from unavailable Firefox and WebKit lanes.
No package, browser or toolchain installation occurred. The existing Python 3.12
interpreter and already-unpacked cached jsonschema 4.26.0 libraries validated
both frozen documents and revision 5; the initial missing-library and incompatible
cached binary attempts are retained as diagnostics.

Original evidence remains historical. Fresh before/after captures show the start,
a coherent wrong-entrance message and completion at 1280×900 and 390×844. Browser
reflow checks also cover 320 CSS pixels and 200% root-font enlargement.

Human intended-age playtesting, educator review, independent accessibility review,
disabled-player feedback, actual assistive technology/device/zoom checks and owner
acceptance remain pending. Automated axe has an incomplete color-contrast check;
representative computed-color measurements supplement it without establishing
conformance. No learning-effectiveness, human approval, hosted CI, Jenkins,
release-readiness or deployment claim is made. No commit, push, PR or external
service write was performed.
