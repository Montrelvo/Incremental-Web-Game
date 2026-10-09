# Bunker reclamation roadmap

Status: core rules and the three-sector playable prototype are merged through PRs #1–#3. PR #5, the fourth delivery PR, completes the documentation and delivery record. See PROJECT_DELIVERY_AUDIT.md for the comparison, ordered merges, and validation. Browser visual acceptance remains unverified.

## Shared vision
Generate sparks at the bunker; use them to power Tesla defense and cannon support; recover scrap from enemies; upgrade the coil; reclaim territory; defend a stronger frontier; repeat.

## Immediate plan: three-sector playable prototype
1. Add a pure frontier simulation with one bunker, integrity, approaching enemies, and recoverable defeat.
2. Keep existing workshop production, managers, milestones, and upgrades. Rename the production coil to distinguish it from the defense coil.
3. Add scrap from kills and three scrap-funded coil tracks: discharge strength, capacitor capacity, and arc chaining.
4. Reserve prepaid sparks in a limited capacitor; allow manual fill and a configurable capped automatic refill. Defense pulses consume energy only when targets are in range. Enemy health replaces instant breakage.
5. Combine Tesla and cannon against the same enemies. A single application-owned visible-play combat clock runs across game screens. Production settles before combat. Hidden time grants production, without attacks or salvage.
6. Add a connected map: bunker -> perimeter -> scrapyard -> relay grounds. Hold the frontier for repeatable scrap, or deliberately push through four mobs, a mini boss, four mobs, and a boss.
7. A successful push claims a sector once, awards scrap once, unlocks generator capacity, and raises frontier difficulty. Generator purchases alone do not raise threat.
8. At zero integrity, stop combat and fail the push. Keep economic progress, upgrades, scrap, and claimed territory. Refund stored capacitor energy and unfired cannon charges. Pay sparks to repair and explicitly restart. Manual generation always permits recovery.
9. Migrate existing saves without losing workshop progress. Refund legacy prepaid cannon shots, preserve legacy records, and initialize the new defense inactive. Retain core bonuses; disable rekindling until expedition resets are redesigned.
10. Connect the workshop and territory screens with shared balances, defense status, next-step guidance, and accessible desktop/mobile controls.
11. Verify energy conservation, unique rewards, claims, recovery, full three-sector progression, migrations, reloads, offline behavior, production build, and disposable-save browser play.
12. Update README and TESTING with implemented and verified behavior.

Initial generator caps are 10 / 20 / 30 / 100 per type at zero / one / two / three sector claims. Migrated ownership above a cap continues producing. The initial frontier supplies scrap before the first claim so upgrades do not depend on already winning a boss.

Scope excludes branching paths, multiple towers, new resource types, equipment inventory, procedural maps, and new prestige progression.

Done means a fresh player can automate generation, defend, earn scrap, upgrade, claim all three sectors, and recover from a failed push. Each system feeds the next and saves preserve progress.

## Expansion roadmap

### A. Complete first region
Expand to ten sectors and a regional boss. Add fast, armored, resistant, and siege enemy roles with readable counters. Preview pressure and boss traits. Give sectors distinct capacity, salvage, or upgrade rewards.
Gate: the small loop is understandable and recovery is fair.

### B. Strategic territory
Add connected branching routes, visible reward previews, outposts, and distinct contested/frontier states. Consider limited territorial retreat only after recovery pacing is tested. Limit simultaneous fronts.
Gate: branching changes player decisions, rather than adding decorative nodes.

### C. Bunker and coil builds
Add specialized defense placements, battery and repair infrastructure, salvage processing, and efficiency/control/durability upgrade paths. Provide respec options. Add currencies only for decisions existing resources cannot express.
Gate: players can explain energy costs and why a defense succeeds or fails.

### D. Expeditions and permanent research
Redesign rekindling around region completion or voluntary expeditions. Ember cores fund lasting research. Preview exact reset/retention rules. Add regions, factions, and optional challenge expeditions; retain achievements and discovered map knowledge.
Gate: the ordinary territory loop works before prestige extends it.

### E. Presentation and release
Unify bunker, enemy, coil, and map art. Improve energy-starvation, damage, salvage, and claim feedback. Add state-driven onboarding. Verify accessibility, mobile controls, save resilience, performance, and native platforms. Keep offline combat deferred until fair bounded simulation is established.

## First implementation checkpoint
Build progression configuration, frontier rules, and save migration, then expose one complete generation -> defense -> salvage -> upgrade -> claim cycle. Expand the same verified rules to the remaining two sectors.
