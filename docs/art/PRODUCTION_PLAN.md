# Bunker image production plan

Sources: [storyline notes](STORYLINE_NOTES.md) and [visual asset plan](VISUAL_ASSET_PLAN.md). This plan prepares image requests; it does not generate artwork, alter game behavior, or publish the game.

## Using the prompt library

Open [the copy-button library](http://127.0.0.1:4174/). Select a category and click **Copy full prompt** for the image you want. Paste that text into your image generator and attach the approved references listed for that request. Ordinary repository links open files; the library's buttons perform the clipboard copy.

If the local page is unavailable, run `node docs/art/tools/serve-art-prompts.mjs` from the repository root, then open `http://127.0.0.1:4174/`. Keep that terminal running while using the page. Alternatively, open `docs/art/index.html` in your browser; clipboard permissions may require the offered manual-copy fallback. The page is self-contained and works without fetching the manifest. GitHub displays the HTML source rather than running its copy buttons; use the local page for clipboard actions.

Every image request also has its own `.txt` file. Category documents below contain the complete prompts and links. The JSON manifest records IDs, phases, output formats and reference inputs. To revise the library, edit `docs/art/tools/build-art-prompts.mjs` and run `node docs/art/tools/build-art-prompts.mjs`; this regenerates the category files, individual prompts, manifest and HTML page.

## Production sequence

1. **Establish references.** Generate the world style guide, scientist reference, engineering signature and bunker architecture reference. Review those together before dependent images. The scientist's age, clothing and face in the prompts are a proposed working design, not previously settled canon.
2. **Build the playable world.** Produce base bunker and workshop, six machine families, three enemy families, three first-region environments and the regional map. Check side-view alignment and small-screen readability before creating variants.
3. **Create the opening.** Produce escape, arrival, door closure and first defense panels. Breaker and relief panels support the fuller six-beat opening. Use the approved scientist, bunker and enemy references throughout.
4. **Add the reveal.** Produce the gate winding, prototype photograph and relay evidence, then scientist portraits and the records station. Compare the visible engineering signature across evidence, enemies and defenses.
5. **Add reusable variants.** Produce machine states, enemy key poses, portrait expressions, equipment, props and damage layers. For an edit request, attach the exact approved base; text alone cannot ensure pixel-aligned variants.
6. **Implement the interface and effects.** Use concept prompts where useful, but build actual text, gauges, routes, markers, interaction states and routine effects in HTML/SVG/CSS or the renderer. Keep those separate from painted backgrounds. Static effect prompts are optional references, not animation deliverables.
7. **Expand after the first region.** Produce residential, prototype-facility and transmission-center scenes, world overview and later evidence when their story beats are ready. Remorseful/defensive portraits and memory inserts are optional until the character arc needs them.

## Prompt categories

| Category | Repository prompts | Copy-button page |
| --- | --- | --- |
| Art direction and references | [Prompts](direction.md) | [Open](http://127.0.0.1:4174/#direction) |
| Scientist and equipment | [Prompts](scientist.md) | [Open](http://127.0.0.1:4174/#scientist) |
| Opening story panels | [Prompts](opening.md) | [Open](http://127.0.0.1:4174/#opening) |
| Bunker and refuge | [Prompts](bunker.md) | [Open](http://127.0.0.1:4174/#bunker) |
| Electrical technology | [Prompts](technology.md) | [Open](http://127.0.0.1:4174/#technology) |
| Creations and enemies | [Prompts](enemies.md) | [Open](http://127.0.0.1:4174/#enemies) |
| Environments | [Prompts](environments.md) | [Open](http://127.0.0.1:4174/#environments) |
| Region and world maps | [Prompts](maps.md) | [Open](http://127.0.0.1:4174/#maps) |
| Evidence and memories | [Prompts](evidence.md) | [Open](http://127.0.0.1:4174/#evidence) |
| Codex, interface and effects | [Prompts](interface.md) | [Open](http://127.0.0.1:4174/#interface) |

## Coverage and deliverables

The library covers all image groups recommended in the notes, splitting discrete character poses, expressions, machine states and enemy key poses into separate requests. Small prop groups, evidence frames and icon concepts remain explicitly named kits to be extracted or redrawn. Those kits are not production-ready packed atlases. Map routes, actual state overlays and focus/hover interactions are implementation tasks; their concept references are grouped in the interface category. Lighting variants and damage overlays support compositing; they do not guarantee editable layers from a generator.

For each accepted asset, retain the original output and any editable source available, then prepare the actual game export. Use the prompt ID as the filename stem. Log the generator/model, date, attached reference IDs, source/usage rights, dimensions, alpha state and acceptance status alongside it. Save future approved artwork under `public/art/` only when ready for integration.

## Acceptance checklist

- Scientist identity, bunker landmarks and the engineering signature match approved references.
- Early scenes evoke danger and shelter without announcing responsibility; later evidence visibly supports the reveal.
- Gameplay cutouts have real transparency, clean edges, consistent baselines and clear silhouettes at display size.
- Machine terminals and cannon muzzles stay fixed between states; enemy proportions match between poses. Repair or redraw mismatched variants before integration.
- Backgrounds leave the combat lane and controls readable; the regional map matches its environments.
- Evidence has an authored accessible transcription. Generated handwriting, dates or labels do not establish story facts.
- Required information remains clear without animation or color alone. Long flashes and screen-wide flicker are not baked into backgrounds.
- Image dimensions and compressed file sizes are chosen against the actual interface before shipping; the suggested aspect ratios are composition targets.

Final animation, image generation, art integration and story implementation remain future production work. This deliverable is the saved plan and ready-to-copy prompt library.
