# Bunker Frontier

Generate energy. Defend your bunker. Salvage enemy scrap. Strengthen the coil and reclaim the space beyond your walls.

The first playable reclamation prototype connects the existing Spark Workshop economy to one shared Tesla/cannon combat system and a three-sector territory map. The long-term roadmap is in [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md).

**Play:** [Bunker Frontier on GitHub Pages](https://Montrelvo.github.io/Incremental-Web-Game/). Main merges are tested and deployed by the existing Pages workflow. See [the delivery audit](PROJECT_DELIVERY_AUDIT.md) for the ordered PRs and [testing notes](TESTING.md) for verified behavior and remaining checks.

## Development

Use **Node.js 24 LTS** and npm.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

## How to play

1. Generate 12 sparks and build a coil generator. Run cycles manually, then hire its manager for 35 sparks. Add machines to establish a reliable supply.
2. Open **Bunker frontier**, reserve sparks in the capacitor, choose an automatic refill rate, and activate defense. Attacks begin only when you activate it.
3. The Tesla coil spends two reserved energy per pulse against enemies in range. Enemies have health; surviving enemies move toward the bunker and damage its integrity when they reach it.
4. Defeated enemies drop scrap. Spend scrap on discharge strength, capacitor capacity, or arc chaining. Cannon support spends workshop sparks for two damage per spark of charge and attacks the same enemies.
5. Hold the frontier to farm salvage, or push into the next connected sector. A push contains four regular enemies, a mini boss, four more enemies, and a boss. Defeat all ten to reclaim the sector; an escaped campaign enemy fails the push.
6. Claims award a one-time scrap bonus and increase per-type generator capacity from 10 to 20, 30, and finally 100. Territory determines enemy difficulty; buying generators does not increase threat.
7. Reclaim the perimeter, scrapyard, and relay grounds to complete the prototype. Repeatable frontier defense continues afterward.

At zero bunker integrity, attacks stop. Machines, managers, scrap, upgrades, cores, and reclaimed territory remain. Remaining capacitor energy and unfired cannon charges are refunded. Generate sparks to repair the bunker, prepare the reserve, and explicitly restart defense.

Production purchases still cost 15% more each time and every ten generators doubles that type’s output. Wiring and lenses multiply production. Managers produce during offline time, up to eight hours per absence. Combat runs once per visible-play second across all in-game screens and pauses while the browser/app is hidden. Offline time grants no kills, scrap, damage, or sector progress.

Saves are local, with automatic saving and export/import. Existing version-one saves migrate to version two: workshop progress and core bonuses are preserved, legacy cannon charges are refunded once, and the new defense starts inactive. Legacy combat and journal records are retained. Existing machines above a new territory capacity continue producing. Rekindling is disabled until the expedition reset rules are redesigned.

## Shared architecture

| Layer | Responsibility |
| --- | --- |
| `src/game/engine.ts` | Workshop economy, offline production, schema migration and validation |
| `src/game/frontier.ts` | Shared combat, energy reserve, salvage, upgrades, territory, recovery |
| `src/components/Territory.tsx` | Territory map, defense arena, coil and cannon controls |
| `src/App.tsx` | React interface, lifecycle, interaction, field journal |
| `src/components/Workshop.tsx` | Phaser illustration; game rules never depend on rendered frames |
| `src/platform/storage.ts` | Browser/Electron localStorage and native Capacitor Preferences |
| `capacitor.config.ts` | Android/iOS packaging configuration |
| `electron/main.cjs` | Sandboxed desktop window |

The same interface and simulation serve all platforms. Layout supports narrow touch screens, keyboard controls, and wide desktop windows. Browser background throttling does not determine earnings; the simulation catches up from timestamps. Fonts have system fallbacks when offline. Import validation rejects malformed saves; unreadable existing saves are preserved until explicitly replaced.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` tests and builds on pushes to `main`, then deploys `dist` to Pages. Set **Settings → Pages → Source → GitHub Actions**. Pull requests run the build and tests without deployment. Vite uses relative asset paths so this project works at `/Incremental-Web-Game/` and within native containers.

## Mobile apps

```sh
npm run build
npm run mobile:android
npm run mobile:ios
npm run mobile:sync
npx cap open android
npx cap open ios
```

Add each platform once. Generated `android/` and `ios/` directories are local build outputs, intentionally ignored. Android requires Android Studio and its SDK. iOS requires macOS and Xcode, locally or on a build host. Store releases require signing and device testing; a browser build is not evidence of App Store readiness. Native project generation and signed mobile binaries are not required for the first Pages release.

## Desktop apps

```sh
npm run desktop
npm run desktop:package
```

The packaging command creates an unpacked app for the current host. To produce installers, use `npx electron-builder --win`, `--mac`, or `--linux` on an appropriate build host. Signing, notarization, store integration, and automatic updates are separate release steps. Electron has Node integration disabled, context isolation enabled, and sandboxing enabled.

## Scope and testing

The first release is a single-player game with local saves. No accounts, multiplayer, advertising, payments, cloud saves, or background server is needed. Unit tests cover production, legacy simulations, unified combat, energy conservation, unique rewards, recovery, save migration, offline pauses, and the complete three-sector progression from a fresh state.

Cross-platform support is an architecture and build target; validate actual Safari/iOS, Android, macOS, and Linux releases on those devices before shipping them. Read [the mechanics research](IDLE_MECHANICS_RESEARCH.md) for the larger atlas and proposed future chapters.
