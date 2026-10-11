# Art-direction chat: inputs and outputs

Recorded for the Incremental Web Game art-direction branch **X.5**, 2026-10-09. This is a substantive summary, not a verbatim transcript. All deliverables created in this conversation are indexed below.

## User inputs

### Story and visual-world request

The protagonist is a mad scientist whose electrical creations caused the world's destruction. He retreats to his bunker as they overrun the world. Present the opening as someone barely escaping a great disaster, reaching shelter, raising defenses and surviving. Establish player sympathy through what they see and do.

Reveal responsibility gradually as sectors are cleared and events occur. Messages may describe someone resembling the protagonist; inspectable artifacts and a book/codex collect evidence. Clicking an entry triggers a line from him as he remembers the specific day or action. Tell the story through discoveries and recollections rather than an introductory explanation of his guilt.

The requested visual scope includes the scientist, Tesla/electrical technology, world map, and a fuller inventory of assets needed to bring the world together.

### Saved planning and copyable prompts

Turn the notes into a repository-saved production plan. Organize image-generation prompts in separate categories and provide clickable access so each complete prompt can be copied to the clipboard.

### GitHub organization

Verify GitHub plugin access. Summarize the conversation's inputs and outputs. Preserve all created plans, links and prompt artifacts in a distinct repository section. Use branch **X.5**, dedicated to art direction, with its own pull request separate from the ongoing gameplay/code work. Keep the folder organization after merge. No merge is performed as part of preparing this pull request.

## Outputs created

| Deliverable | Saved location | Contents |
| --- | --- | --- |
| Storyline notes | [STORYLINE_NOTES.md](STORYLINE_NOTES.md) | Core premise, six opening beats, evidence/source/recollection pattern, first-region clue progression, later reveal concepts, codex behavior and open story decisions. |
| Visual asset inventory | [VISUAL_ASSET_PLAN.md](VISUAL_ASSET_PLAN.md) | Scientist, refuge, technology, enemies, environments, maps, evidence, effects and UI; prioritized first production batch and asset rules. |
| Production plan | [PRODUCTION_PLAN.md](PRODUCTION_PLAN.md) | Reference-first workflow, production sequence, category links, scope distinctions and acceptance criteria. |
| Prompt library | [index.html](index.html) | Standalone page with ten categories, search, production-phase filters, per-image links, complete-prompt copy buttons and manual-copy fallback. |
| Prompt manifest | [manifest.json](manifest.json) | 116 requests, each with category, ID, title, phase, format, reference inputs and self-contained prompt. |
| Category documents | [Category index](README.md#prompt-categories) | Ten Markdown documents containing all prompts and links to individual text files and local copy sections. |
| Individual prompt files | [prompts/](prompts/) | One text file per image request, grouped by category. |
| Library generator | [tools/build-art-prompts.mjs](tools/build-art-prompts.mjs) | Recreates manifest, category documents, text prompts and browser page. |
| Local server | [tools/serve-art-prompts.mjs](tools/serve-art-prompts.mjs) | Serves only this art folder on loopback port 4174 for clipboard-page access. |
| Persistent entry point | [README.md](README.md) | Links to all planning, prompt categories and local usage instructions. |

## Creative suggestions and their status

- **Proposed visual direction:** weathered industrial electrical science fiction with charcoal steel, concrete, copper, cyan electrical light and amber shelter light.
- **Proposed evidence motif:** an asymmetrical winding, three ceramic insulators and a clipped fastening plate recur in his equipment and the creations. This turns visual consistency into an observable clue.
- **Working scientist design:** late fifties, lean, graying hair, tired face, patched workwear, left insulated glove and right-wrist burn. These are assistant-proposed prompt defaults awaiting reference review, not additional user-established canon.
- **First-region grounding:** bunker, Perimeter, Scrapyard and Relay Grounds correspond to existing project work. Suggested clues move from familiarity, to technical connection, to prototype association, to a consequential activation.
- **Proposed expansion:** residential district, prototype facility and central transmission site show human cost, authorship and the causal chain. They are not additions to the current gameplay implementation scope.
- **Suggested dialogue and codex name:** example memories and “Recovered Records” are drafts. The scientist's original motive, foresight and eventual response remain unresolved.
- **Production distinction:** painted images serve characters, places and evidence; actual routes, labels, gauges, focus/hover states and routine effects belong in the accessible game interface. Concept prompts do not replace those implementation tasks.

## Link preservation and organization

The original root-level `STORYLINE_NOTES.md` and `VISUAL_ASSET_PLAN.md` are now housed together in `docs/art/`. The original `scripts/build-art-prompts.mjs` and `scripts/serve-art-prompts.mjs` are now under `docs/art/tools/`, with their paths updated. Previous chat links using the old file locations describe those earlier locations; use this folder's relative links going forward.

The original copy-library URL is preserved: [http://127.0.0.1:4174/](http://127.0.0.1:4174/). All ten original category fragments are preserved in the [category index](README.md#prompt-categories) and [production plan](PRODUCTION_PLAN.md#prompt-categories). These are local service addresses, not GitHub-hosted web pages. GitHub renders the category Markdown and individual text files directly; download or clone the repository to run the copy-button page.

No external research sources or generated image links were created in this chat. The repository is [Montrelvo/Incremental-Web-Game](https://github.com/Montrelvo/Incremental-Web-Game). The original project README identifies [the existing playable game](https://Montrelvo.github.io/Incremental-Web-Game/); the art library is not deployed there by this change.

## Verification and remaining work

Earlier verification confirmed 116 unique prompt IDs with matching individual files, ten categories, and successful HTTP responses for the copy page and a sample prompt. This branch additionally checks regenerated content, internal file links and art-only scope before opening its pull request. Clipboard behavior has a fallback, but no end-to-end browser clipboard test was recorded in the earlier work.

GitHub plugin access was verified for Montrelvo on 2026-10-09, including repository push permission. Only `docs/art/` artifacts belong in this art-direction change; unrelated uncommitted gameplay changes remain outside the pull request.

Future work: approve reference designs, generate images, review continuity, prepare clean game exports and animation, integrate art, author final evidence text and implement narrative unlocks. No images have been generated during this conversation. Creating the branch and pull request does not merge or deploy it.
