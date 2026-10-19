# Night Relay revision 5 status

Revision 5 and the immutable static packaging helper are committed in this repository. This file describes the local prototype state, not product acceptance or release status.

## Local implementation and verification

The game is a local static browser app. Start it with `npm start`; play and verification instructions are in `README.md`.

The exact current local command results and file identities are recorded in `docs/evidence/improvement/after/verification-results.json` and `docs/evidence/improvement/after/browser-results.json`. They describe automated checks only. Chromium is the available browser lane; Firefox and WebKit are recorded separately when unavailable. The release packager checks these records against the exact runtime, package, lockfile and verifier files before creating a candidate.

At the 2026-10-19 repository review, `main` had no hosted workflow, branch protection or ruleset. The live Jenkins catalog classified `setnessconsulting/game-night-relay` as `unmapped`; no Jenkins lane or check is claimed.

## Acceptance and release boundary

Intended-age playtesting, educator review, independent accessibility review, disabled-player feedback, actual assistive-technology and device checks, and owner acceptance remain pending. The proposed criterion matrix is not a formal completion contract. No learning-effectiveness, accessibility-conformance, release-readiness or deployment claim is made. Candidate packaging does not authorize production promotion.
