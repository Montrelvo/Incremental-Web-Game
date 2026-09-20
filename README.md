# Spark Workshop

A little effort. A clever machine. Something that keeps on growing.

Spark Workshop is the first playable chapter of **The Incremental Atlas**: a collection of experiments that let players explore incremental and idle game mechanics. Build copper coils, induction wheels, and arc dynamos; hire managers; discover production milestones; and rekindle for permanent power.

**Play:** https://Montrelvo.github.io/Incremental-Web-Game/

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

1. Generate 12 sparks and build your first copper coil.
2. Run machine cycles manually. Hire a manager to restart them automatically.
3. Buy more machines. Each group of 10 doubles that machine type's output; purchases cost 15% more each time, rounded up. Each type is capped at 100 machines.
4. Buy upgrades and automate all three machine types. Reach 25,000 lifetime sparks with all managers hired to finish the chapter.
5. Optional: rekindle after earning 10,000 sparks in a run. Each ember core adds 25% to future production. The confirmation panel shows exactly what resets and what stays.

Managers work while you are away, up to 8 hours per absence. Manual cycles finish once and stop. Save automatically every five seconds, after actions, and on lifecycle events. Settings supports save export/import, reduced motion, and a confirmed fresh start. Export saves before moving between devices: cloud sync is not included.

## Shared architecture

| Layer | Responsibility |
| --- | --- |
| `src/game/engine.ts` | Pure TypeScript economy, elapsed-time simulation, validation, prestige |
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

The first release is a single-player game with local saves. No accounts, multiplayer, advertising, payments, cloud saves, or background server is needed. Unit tests cover the opening loop, manual/automated cycles, offline versus stepped simulation, bulk prices, milestones, reset retention, clock changes, and invalid saves.

Cross-platform support is an architecture and build target; validate actual Safari/iOS, Android, macOS, and Linux releases on those devices before shipping them. Read [the mechanics research](IDLE_MECHANICS_RESEARCH.md) for the larger atlas and proposed future chapters.


## Mobs and Bosses

The sidebar opens a ten-stage cannon minigame using the workshop spark balance. Each stage contains four metal mobs, one mini boss, four more mobs, and one stage boss (100 enemies total). Regular mob HP is `10 × stage`; mini bosses have twice that HP and stage bosses four times that HP. Stage 1 starts at 10 / 20 / 40 HP; stage 10 reaches 100 / 200 / 400 HP.

One charge costs one spark and deals two damage. Choose a charge and queue 1, 5, or 10 shots at a time, up to 50 outstanding shots. Charges are paid upfront; shots fire every 0.7 seconds while the combat view is visible. Excess damage is discarded. Cancelling refunds unfired charges; clearing the last boss refunds the remaining queue. Combat and prepaid shots survive saves and rekindling, and pause away from combat. Existing workshop saves migrate automatically.

Successful workshop upgrades produce a spark burst and a synthesized zap. Cannon shots have muzzle, beam, impact, and recoil effects. Settings include sound and reduced-motion controls; no audio asset downloads are needed.


## Tesla survival

Mobs and Bosses now contains separate Cannon campaign and Tesla survival modes. Tesla is opt-in because failure wipes all progression. Each visible-play second spends the allocated whole sparks (default 1), supplying one power per spark actually paid. An intact coil draws power even with no enemies nearby. At the coil, power must be strictly greater than mob strength; ties and insufficient power break the coil. Three more ticks carry the breached mob to the far edge and reset the entire game. Sound and reduced-motion preferences are retained, but sparks, machines, upgrades, cores, lifetime records, journal, cannon campaign/queue, and Tesla progress are erased and the fresh save is written.

Generator threat is `coils + 4 × wheels + 12 × dynamos`. New mobs have `1 + threat` strength and spawn every `max(1, 6 - floor(threat / 20))` seconds. Existing mobs keep their spawn strength. Mobs enter at the right, reach the coil after seven movement ticks, and breach the left edge three ticks later. The defense continues across in-game screens, pauses while the browser/app is hidden, and saves active enemies across reloads without offline attacks. Rekindling is locked during an active run.
