# PULSEFALL release candidate gate

**Scope frozen:** 18 stages. No new mechanics or extra stages before release.

## Required checks

- [x] 18 stages are defined and pass basic geometry checks.
- [x] Simulated startup, movement, gravity and dash checks pass in portrait and landscape (36/36 in the most recent assistant-run harness).
- [x] Objectives and time limits are covered by automated assertions.
- [x] A player reported completing all 18 stages before the new Echo mechanic was introduced.
- [ ] Reverify full stage completion after the Echo mechanic change, including ordered pulse collection and rush timeouts.
- [ ] All flagged stage-connectivity cases (1, 2, 3, 7, 12, 14) are resolved or demonstrated completable.
- [ ] Recheck enlarged touch controls and HUD on actual mobile browsers; user reported controls were too short before v45.
- [ ] Save, restart, pause, resume, stage transition, and final victory verified.
- [ ] Audio, performance, accessibility, and visual regressions reviewed.
- [ ] Final public GitHub Pages deployment checked on a real browser.

## User playtest findings

- Player reported that stages felt repetitive. Four Echo Window challenges were added in v46, but enjoyment and end-to-end completion remain unverified.
- Player requested longer controls. Wider and taller touch targets were implemented in v45; awaiting user validation.
- Automated checks confirmed Echo Window activation and expiry on stages 7, 10, 13, and 16 (v47), but did not complete those stages.

## Release decision

Do not mark the game final or commercially ready while required checks remain open.
Static route estimates and 60-frame smoke checks are not full-playthrough evidence.

## Change policy

Fix release blockers first. Every fix must rerun the 18-stage smoke tests. Avoid new features until this gate passes.

## Release candidate build (October 2026)

- The 18-stage game is frozen for release-candidate review.
- Smoke-test assertions were updated to recognize Echo objectives on stages 7, 10, 13 and 16.
- Assistant-run simulated startup/movement/gravity/dash checks: 36/36 passed (18 stages × portrait/landscape) using two-frame action assertions. This is not an end-to-end completion test.
- Final live-site, physical touch-device, and new Echo full-playthrough verification are **not** complete. This build is a **release candidate**, not a certified final production release.
