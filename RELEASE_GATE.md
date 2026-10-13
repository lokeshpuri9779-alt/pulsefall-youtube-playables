# PULSEFALL release candidate gate

**Scope frozen:** 18 stages. No new mechanics or extra stages before release.

## Required checks

- [x] 18 stages are defined and pass basic geometry checks.
- [x] Simulated startup, movement, gravity and dash checks pass in portrait and landscape (36/36 in the most recent assistant-run harness).
- [x] Objectives and time limits are covered by automated assertions.
- [ ] Every stage is completed end-to-end using real game physics, including ordered pulse collection and rush timeouts.
- [ ] All flagged stage-connectivity cases (1, 2, 3, 7, 12, 14) are resolved or demonstrated completable.
- [ ] Touch controls and HUD verified on actual mobile browsers.
- [ ] Save, restart, pause, resume, stage transition, and final victory verified.
- [ ] Audio, performance, accessibility, and visual regressions reviewed.
- [ ] Final public GitHub Pages deployment checked on a real browser.

## Release decision

Do not mark the game final or commercially ready while required checks remain open.
Static route estimates and 60-frame smoke checks are not full-playthrough evidence.

## Change policy

Fix release blockers first. Every fix must rerun the 18-stage smoke tests. Avoid new features until this gate passes.
