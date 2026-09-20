# Incremental and Idle Game Mechanics

Research date: September 20, 2026. Status: design reference; no gameplay implemented.

## Purpose and scope

Build a game in which players discover and experiment with incremental and idle mechanics through play. This catalog covers browser, mobile, and PC examples, including related merge and management hybrids. It is a broad starting library, not an exhaustive inventory of every game.

“Popular” here means recurring patterns illustrated by established games, not a measured ranking of individual mechanics. The reviewed Steam listings show substantial audiences for Cookie Clicker, AdVenture Capitalist, NGU Idle, and Melvor Idle; Idle Miner Tycoon's developer reports over 150 million lifetime downloads. These are audience signals, not evidence that a particular mechanic caused a game's success. [S1–S6]

Incremental progression means accumulating gains that expand future capabilities. Idle play means progress can continue with limited input. Offline progress is a separate feature: leaving a game running and closing it need not produce identical results.

The numbered mechanics below are research synthesis. Each **Experiment** is an original proposal for this project, not a claim about the cited game's exact rules. Sources support the associated examples; proposed quantities and scenarios are illustrative. Stable IDs can be used in future design documents and issues.

## 1. Earning and reinvestment

- **M01 — Manual production.** Clicking or tapping earns the first resource. Example: Cookie Clicker. **Experiment:** collect sparks manually, then compare manual and automated output. [S1]
- **M02 — Passive generators.** Owned producers continuously earn resources that buy more producers. Examples: Cookie Clicker and AdVenture Capitalist. **Experiment:** choose between several machines with different prices and yields. [S1, S2]
- **M03 — Production cycles.** Businesses pay out on a repeating timer; cycle length and payout create different investment profiles. Example: AdVenture Capitalist, discussed in Kongregate's economic analysis. **Experiment:** compare a quick workshop with a slow, larger shipment. [S11]
- **M04 — Escalating costs.** Repeated purchases become more expensive, making the best next investment change over time. **Experiment:** alternate between two generators as their payback periods diverge. [S11]

## 2. Upgrades and growth curves

- **M05 — Ownership milestones.** Reaching a purchase threshold triggers a substantial production bonus. **Experiment:** decide whether to finish a generator milestone or buy another producer. [S11]
- **M06 — Additive versus multiplicative bonuses.** Bonuses can add within a category and compound across others. Egg, Inc.'s support explains additive research tiers. **Experiment:** compare two explicitly labeled upgrade formulas and watch their output diverge. [S7]
- **M07 — Producers that create producers.** A higher production tier generates a lower tier rather than directly generating money. **Experiment:** compare a machine factory with a direct income machine over short and long horizons. [S12]
- **M08 — Diminishing reset rewards.** Increasing prestige rewards can require progressively more earnings. Example: Egg, Inc.'s soul egg counter. **Experiment:** show the extra reward from another minute and let players choose when to reset. [S7, S13]

## 3. Automation and time

- **M09 — Hire managers.** Turn manually activated work into an automatic loop. Examples: AdVenture Capitalist and Idle Miner Tycoon. **Experiment:** spend on immediate output or on freeing a task from manual attention. [S2, S6]
- **M10 — Automate purchases and routine actions.** Assistants handle recurring maintenance. Example: Idle Champions' familiars automate leveling and gold collection. **Experiment:** unlock separate automation switches and observe which one removes the biggest chore. [S9]
- **M11 — Programmable automation.** Players specify rules for repeated decisions; Antimatter Dimensions includes a scripting system. **Experiment:** assemble simple “if balance exceeds X, buy Y” blocks before exposing optional scripting. [S3]
- **M12 — Offline earnings.** Progress is calculated while the player is absent. Examples: Melvor Idle and AdVenture Capitalist. **Experiment:** preview a simulated absence, then explain earnings, resource exhaustion, and any configured cap. [S2, S4]

## 4. Prestige and lasting progression

- **M13 — Reset for permanent power.** Trade current progress for a lasting bonus. Examples: Cookie Clicker's heavenly upgrades and Leaf Blower Revolution's prestige coins. **Experiment:** preview what is lost and retained, then race the previous run's time. [S1, S10, S13]
- **M14 — Prestige spending choices.** Reset currency buys upgrades rather than serving only as a score. Example: Antimatter Dimensions' Infinity upgrades. **Experiment:** choose between faster starts and stronger late production. [S3]
- **M15 — Multiple reset layers.** Later resets operate above earlier progression systems. Example: Antimatter Dimensions. **Experiment:** unlock a second layer only after the first is familiar; visibly map which layers reset. [S3]
- **M16 — Rule-changing challenge runs.** Restrictions make familiar systems behave differently. Example: Antimatter Dimensions' challenges. **Experiment:** complete a short run without the cheapest generator to unlock an alternate strategy. [S3]

## 5. Resource networks and allocation

- **M17 — Conversion chains.** Resources pass through intermediate stages. Example: Universal Paperclips' matter, wire, and manufacturing systems. **Experiment:** balance ore extraction, refining, and assembly with visible flow rates. [S8]
- **M18 — Capacity and storage.** A full store can block accumulation even when production is strong. Example: Universal Paperclips' operations and energy storage. **Experiment:** choose more production or a larger buffer before a long absence. [S8]
- **M19 — Shared resource allocation.** Limited capacity is distributed across competing uses. Example: Universal Paperclips allocates trust between computational resources. **Experiment:** divide ten workers between producing, researching, and transporting. [S8]
- **M20 — Price and demand.** Producing goods and selling them are separate constraints. Example: Universal Paperclips exposes price, demand, and unsold inventory. **Experiment:** adjust price to find a profitable balance between margin and sales volume. [S8]

## 6. Builds, synergies, and specialization

- **M21 — Factions with distinct play styles.** Selecting an affiliation changes which strategy pays. Example: Realm Grinder's factions. **Experiment:** compare an active collector, an offline specialist, and a production specialist under the same starting conditions. [S5]
- **M22 — Research and upgrade selection.** Spending on different systems produces different builds. Example: Realm Grinder's research, buildings, and spells. **Experiment:** offer a short branching tree with a free respec for comparisons. [S5]
- **M23 — Formation synergies.** Team composition and placement determine effectiveness. Example: Idle Champions. **Experiment:** rearrange a small party and watch support effects change its performance. [S9]
- **M24 — Cross-system benefits.** Progress in one activity improves another. Example: Melvor Idle's interconnected skills. **Experiment:** gather materials, craft equipment, and use it to unlock a better gathering zone. [S4]

## 7. Idle RPG and collection

- **M25 — Automatic combat.** Preparation drives battles that resolve with limited input. Example: Idle Champions. **Experiment:** change equipment and formation to overcome a clearly explained damage or survival barrier. [S9]
- **M26 — Skill training.** Repeated activities grow persistent skill levels and unlock options. Example: Melvor Idle. **Experiment:** choose which skill to train based on the next recipe or expedition requirement. [S4]
- **M27 — Loot and inventory progression.** Equipment, consumables, and quest items provide additional objectives. Example: NGU Idle. **Experiment:** compare two gear loadouts with different strengths, instead of only equipping the larger number. [S14]
- **M28 — Collectibles with utility.** Collection can grant gameplay bonuses. Example: Leaf Blower Revolution's unique leaves. **Experiment:** discover artifacts that alter strategies, with a visible collection journal. [S10]

## 8. Active and spatial hybrids

- **M29 — Physical collection and tool upgrades.** Movement or positioning determines collection efficiency. Example: Leaf Blower Revolution. **Experiment:** sweep particles into collectors, then buy tools with different coverage patterns. [S10]
- **M30 — Active work becomes automated.** An initially manual spatial task gains autonomous helpers. Example: Leaf Blower Revolution's Autoblowers. **Experiment:** unlock collection drones, then shift the player's role to route and upgrade decisions. [S10]
- **M31 — Merge evolution.** Combining matching items produces a higher tier. Example: Merge Dragons!, an adjacent mobile merge game rather than a pure idle reference. **Experiment:** merge resource-producing units while managing limited board space. [S15]
- **M32 — Efficient batch merging.** Waiting for a larger set can improve conversion efficiency. Merge Dragons! documents three items becoming one versus five becoming two. **Experiment:** choose between an immediate upgrade and saving for the better batch. [S16]

## 9. Discovery and objectives

- **M33 — Unfolding systems.** New mechanics appear as progression advances. Examples: Antimatter Dimensions and NGU Idle. **Experiment:** let a simple generator unlock a workshop, then a new type of decision; reveal one system at a time. [S3, S14]
- **M34 — Achievements that affect production.** Accomplishments can feed back into upgrades. Example: Realm Grinder's trophy-dependent strategies. **Experiment:** reward trying different builds with modest permanent bonuses. [S5]
- **M35 — Side minigames.** Secondary activities create variety within the wider progression game. Examples: Cookie Clicker and Leaf Blower Revolution. **Experiment:** add a short optional puzzle that earns a bounded production bonus. [S1, S10]
- **M36 — Zone and boss progression.** New areas and encounters give concrete destinations for rising numbers. Examples: Melvor Idle and NGU Idle. **Experiment:** use a three-zone expedition with visible preparation requirements and a finish line. [S4, S14]

## 10. Shared goals and service patterns

- **M37 — Cooperative contracts.** Players contribute toward a shared objective. Example: Egg, Inc.'s co-op contracts. **Experiment:** start with a simulated partner and shared delivery target before committing to multiplayer infrastructure. [S7]
- **M38 — Parallel parties.** Multiple teams pursue different objectives. Example: Idle Champions. **Experiment:** distribute a limited roster between a resource expedition and a progression expedition. [S9]
- **M39 — Optional rewarded boosts.** Mobile idle games can exchange ad viewing for temporary rewards; Idle Miner Tycoon's official site features this pattern in its player testimonials. **Experiment:** model the boost using earned tokens. Advertising is not required to teach the mechanic. [S6]
- **M40 — Earnable premium currency.** Some free-to-play games let players obtain premium currency through play; NGU Idle explicitly advertises this. **Experiment:** use an entirely earned bonus currency to explore saving versus spending. Real-money purchases are a separate product decision. [S14]

## Proposed structure for our game

These are design recommendations, not research findings or an approved implementation scope.

Use a hub of compact, replayable experiments. Each introduces one main mechanic, gives the player a consequential choice, and unlocks a comparison screen showing why the result changed. A shared discovery journal can connect the experiments without forcing all their economies into one enormous balance problem.

| Suggested order | Playable experiment | Mechanics | What the player discovers |
| --- | --- | --- | --- |
| 1 | Spark Workshop | M01–M05, M09 | Reinvestment and automation change the value of manual effort. |
| 2 | Supply Chain | M17–M20 | The weakest stage constrains an otherwise strong economy. |
| 3 | Reset Observatory | M08, M13–M16 | A reset can exchange current progress for better future possibilities. |
| 4 | Guild Expedition | M23–M28, M36 | Preparation and specialization matter more than constant input. |
| 5 | Merge Garden | M29–M32 | Space and timing create choices within a growth loop. |
| 6 | Automation Lab | M10–M12, M21–M22 | Rules and builds can optimize for different play schedules. |

Initial prototype recommendation: Spark Workshop with three generators, one manager unlock, one milestone, and a clear endpoint. Target a first meaningful choice in the first minute and completion in roughly 10–15 minutes; these are hypotheses to playtest, not established genre benchmarks. Add prestige after the initial economy is enjoyable.

For every future experiment, define its starting state, core decision, active input, idle behavior, completion condition, reset scope, and intended lesson. Track time to first decision, time to automation, longest forced wait, and whether at least two strategies remain useful. Include a fast-forward comparison mode so players can study long-term outcomes without waiting days.

Platform design proposals: browser play needs dependable local saves and export/import; mobile needs comfortable touch targets and short-session clarity; desktop can expose richer comparisons and keyboard shortcuts. Explain offline calculations and make reset previews explicit on every platform. Keep source-inspired experiments original in theme, wording, art, and balance.

## Sources and evidence notes

All sources below were consulted through web search or page retrieval on the research date. Storefront descriptions are developer/publisher claims; their reviews and the reported download figure are contextual popularity signals. This research did not independently play through every title or verify every current platform build. Platform examples establish coverage, not feature parity between ports.

- **S1 — [Cookie Clicker, official Steam listing](https://store.steampowered.com/app/1454400/Cookie_Clicker/).** Browser origins and PC release; generators, upgrades, minigames, permanent upgrades.
- **S2 — [AdVenture Capitalist, official Steam listing](https://store.steampowered.com/app/346900/AdVenture_Capitalist/).** Managers, offline income, investments, and angel investors.
- **S3 — [Antimatter Dimensions, official Steam listing](https://store.steampowered.com/app/1399720/Antimatter_Dimensions/).** Browser origins, PC release, layered prestige, challenges, and automation.
- **S4 — [Melvor Idle, official Steam listing](https://store.steampowered.com/app/1267910/Melvor_Idle/).** Skills, combat, inventory, collection, and offline progression.
- **S5 — [Realm Grinder, official Steam listing](https://store.steampowered.com/app/610080/Realm_Grinder/).** Factions, research, spells, reincarnation, and functional achievements.
- **S6 — [Idle Miner Tycoon, developer website](https://www.idleminertycoon.com/).** Mobile example, managers, away earnings, reported downloads, and testimonials about optional rewarded ads. The testimonial is weaker evidence than formal feature documentation.
- **S7 — [Egg, Inc., Auxbrain support: General](https://auxbrain.freshdesk.com/support/solutions/folders/47000774544).** Mobile example; co-op contracts, additive research, prestige, and soul egg progression.
- **S8 — [Universal Paperclips, official browser game](https://www.decisionproblem.com/paperclips/index2.html).** Its exposed interface documents manufacturing, allocation, storage, pricing, and demand. Retrieved markup includes later systems; it is not a record of a played session.
- **S9 — [Idle Champions, official Steam listing](https://store.steampowered.com/app/627690/Idle_Champions_of_the_Forgotten_Realms/).** Formations, automatic combat, familiars, and multiple parties.
- **S10 — [Leaf Blower Revolution, official Steam listing](https://store.steampowered.com/app/1468260/Leaf_Blower_Revolution__Idle_Game/).** Spatial collection, automation, prestige, special leaves, crafting, and minigames.
- **S11 — [Anthony Pecorella / Kongregate: The Math of Idle Games, Part I](https://www.kongregate.com/en/pages/the-math-of-idle-games-part-i).** Generator economics, escalating costs, milestones, and bulk purchasing.
- **S12 — [Kongregate: The Math of Idle Games, Part II](https://www.kongregate.com/en/pages/the-math-of-idle-games-part-ii).** Generator chains and growth models.
- **S13 — [Kongregate: The Math of Idle Games, Part III](https://www.kongregate.com/en/pages/the-math-of-idle-games-part-iii).** Prestige formulas and progression tradeoffs.
- **S14 — [NGU Idle, official Steam listing](https://store.steampowered.com/app/1147690/NGU_IDLE/).** Browser/PC example; RPG items, bosses, unfolding systems, active/idle play, earnable premium currency.
- **S15 — [Gram Games: Merge Dragons!](https://gram.gs/game-detail-merge-dragons.html).** Merge evolution and collection in a mobile hybrid.
- **S16 — [Merge Dragons! official support: Merging five](https://zyngasupport.helpshift.com/hc/en/82-merge-dragons/faq/13774-tip-merging-5-at-once-is-better-than-3/?l=en).** Explicit three-to-one and five-to-two conversion rules.

## Next design decisions

Choose the hub's theme, decide whether experiments share progression or only discovery rewards, and design the Spark Workshop's first ten minutes. Multiplayer, advertisements, and purchases are not required for the first prototype. Extend this catalog as new research or playtesting reveals useful patterns.

