# Release validation

## Automated checks

Run `npm ci`, `npm test`, and `npm run build` with Node 24. CI repeats the tests and production build before Pages deployment.

The simulation tests verify:

- The first purchase and one-shot manual production.
- Equivalent automated production after one large time jump or many small ticks.
- Bulk purchase prices, milestones, and upgrade multipliers.
- The eight-hour offline cap and clocks moving backwards.
- Prestige reward, reset scope, and permanent journal retention.
- Chapter completion conditions.
- Save validation and round-tripping.

## Browser checks performed during development

- Generated 12 sparks, bought a coil, ran a manual cycle, and verified it stopped.
- Earned enough for a manager, hired it, and observed automatic output.
- Checked the desktop layout and a 390 × 844 phone viewport; no horizontal overflow.
- Opened mobile settings, exported a save, and rejected malformed imported JSON.
- Imported a later-game fixture through the normal save interface, purchased an upgrade, previewed prestige, and reset. Confirmed ember cores and all five journal discoveries remained.
- Checked browser error logs: no game runtime errors during this pass.

## Packaging checks

A clean `npm ci`, production build, Android project generation, and Android asset/plugin sync completed successfully on the development host. The native app was not compiled, signed, or run on an Android device. The generated project includes the App lifecycle and Preferences storage plugins.

The phone viewport is responsive-layout testing, not a substitute for testing real iOS and Android devices. Test actual touch behavior, interruption/resume, audio if later added, storage, and native plugins on those devices before shipping native apps. Desktop installers likewise need platform-specific validation and signing.


## Combat and feedback update

- All 12 simulation tests pass, including the complete 100-enemy campaign, charge spending, damage, queue limits/refunds, completion, old-save migration, and persistence through offline time/rekindling.
- TypeScript validation and production build pass.
- Browser: purchased an affordable upgrade; five queued one-charge shots cost five sparks and defeated a 10 HP mob. Reload retained the defeat and spark balance.
- Desktop and 390px mobile layouts inspected; all three navigation destinations remain accessible. No browser console errors observed. Native packages have not been retested for this update.
