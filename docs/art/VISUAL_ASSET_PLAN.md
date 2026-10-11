# Visual asset plan: the scientist's ruined world

Planning inventory, not generated artwork or an implementation change. The first production scope follows the current bunker -> Perimeter -> Scrapyard -> Relay Grounds progression. Later locations are expansion proposals.

## Visual foundation

Recommended direction: weathered industrial electrical science fiction. Concrete shelters, copper windings, ceramic insulators, riveted steel, old instruments, and machinery retrofitted after a catastrophe. Avoid making every surface ornate; readable silhouettes matter at web-game scale.

Suggested palette: charcoal and dirty concrete for the world, aged copper for construction, pale cyan for energized machinery, warm amber for inhabited shelter, and a separate warning treatment for danger. Color should be backed by shapes, labels, and motion states.

The strongest unifying motif is a recognizable winding and insulator arrangement shared by the scientist's equipment and his creations. Document it in the art guide before making individual assets.

## 1. Scientist

| Asset | Needed versions | Story or gameplay purpose |
| --- | --- | --- |
| Character design sheet | Front, side, back; face; hands; coat; tools; distinctive old burn | Keep portraits, opening panels, and evidence photographs consistent. |
| Present-day full-body figure | Fleeing, bracing the door, operating a console, exhausted seated pose | Build the opening with reusable poses. |
| Codex portrait | Neutral, strained, recalling, guarded, remorseful or defensive | Give remembered lines a human presence; expressions need not determine his final arc yet. |
| Earlier self | Cleaner clothing and posture; unmistakably the same face and identifying detail | Make recovered photographs recognizable without a caption announcing the answer. |
| Personal equipment | Insulated glove or gauntlet, instrument case, goggles, access key | Connect the person to the engineering throughout the world. |

Avoid a prominently villainous opening pose or promotional label. Let his actions and the recovered evidence establish his role.

## 2. Bunker and refuge

| Asset | Needed versions | Purpose |
| --- | --- | --- |
| Exterior bunker | Unpowered, powered, damaged; reusable door and coil placement | Anchor the defense scene and opening. |
| Entrance close-up | Door, latch, emergency switch, scrape marks | Support the escape sequence and later reinterpretation. |
| Workshop interior | Dim emergency lighting and operating lighting | Make generation feel like restoring shelter. |
| Workbench props | Tools, replacement windings, instruments, component trays | Explain craft and familiarity visually. |
| Personal corner | Coat hook, cot, cup, prepared supplies | Humanize the refuge while hinting it was his. |
| Records station | Drawer, document tray, lamp, recorder | Give the codex a place in the world. |
| Damage overlays | Cracks, scorches, broken lamp, patched panel | Show bunker integrity without drawing a new scene per health value. |

The exterior, workshop, and records station should feel like different views of one building. Fix the door shape, construction materials, and key landmarks in the reference sheet.

## 3. Electrical technology

| Asset | Visual states / variants | Purpose |
| --- | --- | --- |
| Production copper coil | Idle and generating | Distinguish its compact enclosed form from the outdoor defense tower. |
| Induction wheel | Idle and rotating | Readable second production tier. |
| Arc dynamo | Idle and generating | Visually larger, more capable production equipment. |
| Defense Tesla coil | Idle, charging, firing, damaged; modular upgrade pieces | Recognizable defense with visible progression. |
| Capacitor bank | Empty, partial, full; separate warning indicator | Show stored energy and starvation. |
| Support cannon | Idle, charging, firing, recoil | Connect the cannon to the same improvised electrical toolkit. |
| Upgrade modules | Heavier discharge winding, extra capacitor cells, branching terminals | Represent discharge strength, capacity, and arc chaining. |
| Salvage | Copper fragments, steel parts, ceramic pieces grouped as scrap | Match resources to the enemies and upgrades. |
| Distribution props | Cables, breakers, grounding rods, meters, relay boxes | Make power flow legible across scenes. |

Build coil upgrades from reusable components. The current upgrade tracks do not need a separate full illustration for every possible combination.

## 4. Creations and enemies

| Asset | Minimum treatment | Purpose |
| --- | --- | --- |
| Scrap Walker | Clear silhouette; idle/walk, hit, defeated states | Regular enemy, readable in groups. |
| Steel Sentinel | Distinct stance and armor silhouette; same state coverage | Current mini boss. |
| Iron Colossus | Larger form with an unmistakable outline; same state coverage | Current sector boss. |
| Exposed internal mechanism | Shared winding, insulators, fastening plate | Physical evidence of a common designer. |
| Sector variants | Interchangeable corrosion, salvage plates, relay components | Tie repeated enemy families to locations economically. |
| Opening threat silhouettes | Drawn from the actual enemy designs | Make the opening and gameplay belong to the same world. |

Keep boss and mini-boss distinctions visible through outline and proportion. Future fast, armored, resistant, and siege roles will need distinct silhouettes when those mechanics are introduced.

## 5. Environments and world map

| Location | Main image / battlefield ingredients | Evidence opportunity |
| --- | --- | --- |
| Escape road | Ruined road, distant skyline, electrical storm, bunker approach | First sight of disaster and refuge. |
| Perimeter | Broken fence, gate, defensive posts, footprints, scorched ground | Familiar winding and an old repair. |
| Scrapyard | Wreck stacks, dismantling bench, crane silhouette, prototype remains | Photograph beside the matching wreck. |
| Relay Grounds | Transmission pylons, cable trench, relay hut, damaged switchgear | Interrupted recording and activation hardware. |
| Later residential district | Empty homes, evacuation signs, stalled public transport | Consequences for ordinary people. |
| Later prototype facility | Test cells, observation windows, assembly fixtures | Authorship and prior warnings. |
| Later transmission center | Central apparatus, burned control room, network infrastructure | Evidence of the catastrophe's spread. |

### Map asset layers

- **Regional base:** roads, terrain, structures, and the first three sectors, with clear correspondence to the battlefield backgrounds.
- **Bunker and landmark markers:** distinctive shapes readable at small sizes.
- **Route layer:** connects the bunker and sectors; keep routes separate from painted terrain.
- **State overlays:** undiscovered, visible but locked, contested, push active, reclaimed; pair treatments with text or symbols.
- **Interaction states:** selected, hover, keyboard focus, discovery available.
- **Future world overview:** a broader devastated landscape with region silhouettes and the transmission network. Detail only accessible regions; leave room for later expansion.

Author labels separately from the art so they remain readable, accessible, and editable. Prefer vector markers and routes, with painted terrain or backgrounds where atmosphere benefits from them.

## 6. Evidence, memories, and codex

| Asset | First-region example | Reuse approach |
| --- | --- | --- |
| Artifact close-up | Gate winding, photograph, relay switch | One readable illustration for each important discovery. |
| Evidence frame | Paper, metal plate, photograph border, recorder casing | Reusable frames instead of unique UI for every entry. |
| Earlier-world image | Intact prototype with the younger scientist | Match present wreck geometry and character features. |
| Recollection image | Hand at the lever or a remembered workshop detail | Optional selective insert; not every line needs a flashback. |
| Codex shell | Record index, entry panel, source label, character-response panel | Separate source evidence from his recollection. |
| Discovery indicator | Small recovered-record symbol | Signal a new entry without interrupting every combat action. |

Readable text belongs in the interface. Illustrations can show handwriting or torn labels as texture, but crucial evidence must have an accessible transcription.

## 7. Effects and interface assets

- Effects: charge glow, discharge arc, chain arc, cannon muzzle flash, impact, enemy breakup, salvage pickup, repair cue, and sector-claim cue.
- Opening atmosphere: drifting dust, distant electrical flashes, emergency-light flicker, door sparks. Supply static alternatives for reduced motion.
- Resource icons: sparks, scrap, capacitor energy, bunker integrity, generator capacity, and recovered records.
- Upgrade icons: discharge strength, capacitor capacity, arc chaining; visually match the hardware modules.
- State symbols: defense active/offline, insufficient energy, damaged bunker, locked sector, reclaimed sector.
- Interface treatments: compact instrument panels, progress gauges, codex tabs, and restrained borders drawn from bunker materials.

Routine icons, gauges, and effects can use SVG, CSS, or procedural rendering. Reserve painted imagery for character, environments, and story-bearing objects. Visual atmosphere must leave combat status and controls easy to read.

## First production batch

Make a coherent first slice before illustrating the whole world:

1. One art guide covering scientist reference, engineering motif, palette, materials, camera, and scale.
2. Four opening panels: escape, arrival, door closure, first defense. Derive them from the same character and bunker references.
3. One present scientist portrait with three expression variants and one earlier-self reference.
4. One bunker exterior and one workshop interior, with lighting and damage overlays.
5. Six gameplay machine designs: three generators, defense coil, capacitor bank, support cannon; then add state layers and upgrade modules.
6. Three enemy designs: Walker, Sentinel, Colossus, with basic movement, impact, and defeated treatments.
7. Three battlefield backgrounds: Perimeter, Scrapyard, Relay Grounds.
8. One regional map with reusable markers and state overlays. Add a simple world overview only if the early game exposes it.
9. Three discovery images: gate component, prototype photograph, relay switch/recording evidence.
10. One codex layout, the needed resource/upgrade icons, and a shared combat-effects kit.

This is a list of design groups, not a final exported-file count. Layering, animation frames, expression variants, and resolution variants determine the actual number of files.

## Production rules

- Establish the current side-view battlefield camera before drawing gameplay machines and enemies. Narrative close-ups can use other angles.
- Keep fixed anchor points for the coil terminal, cannon muzzle, enemy feet, and bunker doorway so effects and placements line up.
- Export standalone figures and machinery with transparency; export backgrounds separately. Keep editable layered source files.
- Prefer reusable damage, lighting, and upgrade layers over complete redraws.
- Make effects render independently from backgrounds and keep the battle floor uncluttered.
- Test silhouettes and icons at their actual small-screen display size. Check text contrast against the finished backgrounds.
- Choose final dimensions from the implemented layouts before commissioning a large batch. The current arena uses a 900 x 260 coordinate space, which can guide composition without dictating export resolution.
- Use consistent file names such as `scientist-present-portrait-neutral`, `bunker-exterior-base`, `defense-coil-terminal`, `perimeter-background`, and `evidence-relay-switch`.
- Record each asset's owner, status, source/license, intended screen, and required variants when production begins.

Related planning: [storyline and reveal notes](STORYLINE_NOTES.md).
