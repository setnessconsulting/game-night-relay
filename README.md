# Night Relay: The Last Lantern Post

A Grade 4 ELA browser game about using two sources to give a visitor a supported,
step-free route. One untimed loop: plan a route, build a reason, send, inspect,
repair, complete and replay.

The implementation was first evaluated in an isolated working copy seeded from
the exact dirty source worktree, then copied into this review branch. The source
worktree remains preserved. See `docs/evidence/improvement/baseline.json` and
`docs/evidence/improvement/isolation-final.json` for the evaluation snapshot's
provenance and hashes.

## Play locally

Use Node 24 or later. The pinned development dependencies are needed only for
verification; playing requires no package installation, build step or runtime
dependencies.

```powershell
$env:PORT = '4186'
npm start
```

Open http://127.0.0.1:4186. Stop the server with Ctrl+C. With no PORT setting,
`npm start` uses 4173. All fonts and game assets are local.

## The revised loop

- Plan a path and gate using two independent choices. Neither is filled for you.
- Open **Build a reason**, or use M1/M2 and N1/N2 directly in the source cards.
  A source button changes only that evidence choice. Either detail is available.
- Choose a conclusion connecting the two sources. You may send from either step,
  including an unfinished message.
- Each source-check issue has an **Edit** action. It opens the relevant choice
  with the issue beside the draft. Other choices stay intact.
- Feedback and the completed-message card describe the last sent message.
  Changes are checked only when you send again. Explicit answer help stays optional.
- Replay clears the draft and help markers and identifies the new run as replay.

No learner data is stored or transmitted. **After Ready to play**, the loaded
session, revision and replay work offline. First-visit offline, offline reload
and restoration after closing are not supported or claimed.

## Verify

```text
npm run check
npm test
npm run test:browser
```

Browser tools remain the baseline's pinned development dependencies:
Playwright 1.64.1 and @axe-core/playwright 4.13.0. The current local verification
uses the lockfile-installed packages; it does not install browser binaries.
Chromium was available; Firefox and WebKit were not. The browser runner records
those missing supplemental engines explicitly in the exact-build evidence.

## Package a hosted candidate

The game has no build step or runtime package dependency. `npm run release:package`
copies the local entry page and its JavaScript/CSS modules into an immutable static
candidate directory and writes a manifest with the exact source SHA, lockfile hash,
file hashes, aggregate content hash, and links to recorded evidence. Supply an explicit
version and a new output path:

```text
npm run release:package -- --version 2026.10.19-example --out release/2026.10.19-example
```

The manifest preserves the evidence limits: packaging does not mark the game approved,
human-reviewed, or promoted. Generated release directories are ignored by Git.
Before writing a candidate, the packager requires fresh passing records for
`npm run check`, `npm test`, and `npm run test:browser`; it matches the records to
the exact runtime, package, lockfile, verifier, and Chromium version. It refuses
stale or mismatched evidence.

Revision 4 remains frozen. Revision 5 adds the interaction contract, while all
source facts, five input domains, evaluator rules, exact output text, 26 goldens,
eight recipient overrides and the independent 324-case oracle remain unchanged.
The complete finite space is checked in unit tests and the connected browser UI.

See [changes and tradeoffs](docs/improvement.md), [acceptance matrix](docs/acceptance/README.md)
and [new evidence](docs/evidence/improvement/README.md). Intended-age playtesting,
educator review, independent accessibility review, disabled-player feedback and
owner acceptance remain pending. No release, learning-effectiveness or
accessibility-conformance claim is made.
