# Prototype validation

## Current automated results

- TypeScript validation passed using the bundled Node 24.19.0 runtime.
- Production Vite build passed. The existing Phaser bundle still produces a size advisory.
- All 34 tests passed across five simulation suites: 18 retained simulation tests, six standalone frontier tests, and ten economy/migration/progression integration tests.
- A deterministic integration test starts at zero, earns sparks through clicks and generators, earns scrap from actual kills, buys coil upgrades, and reclaims all three sectors without granting test currency.

Frontier coverage includes energy transfers/refunds without false earnings; shared Tesla/cannon targets and single-award kills; no idle drain; shortage behavior; recoverable defeat; manual recovery from zero; failed pushes; one-time claims and capacity; legacy migration with exactly-once prepaid-charge refunds; active saves and offline combat pauses; rejection of invalid defense state.

## Browser verification

The local Vite server started successfully at http://127.0.0.1:5173/. The connected browser discovered the correct page title, but DOM/screenshot operations timed out or returned no content. Visual layout and interactive browser behavior have not been confirmed for this update. Previous release browser checks are not evidence for the new frontier screen.

## Sequential delivery checks

PR 1 records the roadmap and chat-to-repository audit. PR 2 was checked in an isolated baseline-plus-core project: all 24 tests and TypeScript validation passed. The full PR 3 integration passes all 34 tests, TypeScript validation, and the Node 24 production build. Each PR must pass its own GitHub build before merging. [PR #5](https://github.com/Montrelvo/Incremental-Web-Game/pull/5), the fourth delivery PR, updates player documentation and the delivery record. The original local implementation was not a published release; this series closes that gap.

## Manual acceptance pass still needed

Use a disposable local save or export a backup first.

1. From zero, buy a generator, run a cycle, hire a manager, and build a reserve.
2. Inspect the frontier map and controls on desktop and at a 390px phone width; check readable controls and no horizontal overflow.
3. Fill the capacitor, enable refill, activate defense, earn scrap, and buy a coil upgrade.
4. Queue cannon support and confirm both weapons damage the same enemies; cancel unfired shots and verify the refund.
5. Move to the workshop while defense is active and confirm enemies continue. Hide the app and confirm only workshop production catches up on return.
6. Push through a sector, verify the one-time claim reward and increased purchase capacity, then reclaim the remaining sectors.
7. Allow a disposable bunker to fail, confirm progress is retained, repair it with manually generated energy, and restart.
8. Reload during a push and confirm enemy health, reserves, upgrades, and territory remain. Import a legacy save and confirm safe inactive migration and exactly-once refunds.

## Platform scope

Browser, Electron, and Capacitor share the simulation. Native binaries, mobile lifecycle behavior on physical devices, installers, signing, and platform stores have not been retested for this update. The sequential PR series uses the existing GitHub Actions build and Pages deployment workflow; current deployment results are available in the repository Actions history.
