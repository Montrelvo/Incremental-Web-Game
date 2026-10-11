# Incremental Web Game: art direction

This folder is the dedicated home for the game's narrative and visual direction, production planning, image prompts and their supporting tools. It is introduced on branch **X.5** in a separate art-direction pull request. Its contents remain organized here after merge; the branch name is not a gameplay milestone.

## Start here

- [Chat inputs and outputs](CHAT_SUMMARY.md): requirements, decisions, deliverables, proposed details and outstanding production work.
- [Storyline notes](STORYLINE_NOTES.md): escape opening, evidence, recollections and gradual reveal.
- [Visual asset inventory](VISUAL_ASSET_PLAN.md): asset groups and first-region priorities.
- [Production plan](PRODUCTION_PLAN.md): sequence, reference dependencies, acceptance criteria and full category link table.
- [Prompt manifest](manifest.json): 116 requests with IDs, phases, reference requirements and complete prompt text.
- [Copy-button library source](index.html): self-contained browser page with search and phase filters.

## Prompt categories

| Category | Saved prompts | Local copy page |
| --- | --- | --- |
| Art direction and references | [Open](direction.md) | [Copy prompts](http://127.0.0.1:4174/#direction) |
| Scientist and equipment | [Open](scientist.md) | [Copy prompts](http://127.0.0.1:4174/#scientist) |
| Opening story panels | [Open](opening.md) | [Copy prompts](http://127.0.0.1:4174/#opening) |
| Bunker and refuge | [Open](bunker.md) | [Copy prompts](http://127.0.0.1:4174/#bunker) |
| Electrical technology | [Open](technology.md) | [Copy prompts](http://127.0.0.1:4174/#technology) |
| Creations and enemies | [Open](enemies.md) | [Copy prompts](http://127.0.0.1:4174/#enemies) |
| Environments | [Open](environments.md) | [Copy prompts](http://127.0.0.1:4174/#environments) |
| Region and world maps | [Open](maps.md) | [Copy prompts](http://127.0.0.1:4174/#maps) |
| Evidence and memories | [Open](evidence.md) | [Copy prompts](http://127.0.0.1:4174/#evidence) |
| Codex, interface and effects | [Open](interface.md) | [Copy prompts](http://127.0.0.1:4174/#interface) |

## Run locally

From the repository root:

```sh
node docs/art/tools/serve-art-prompts.mjs
```

Then visit [the prompt library](http://127.0.0.1:4174/). Category links navigate to their section; **Copy full prompt** copies the selected image request. If clipboard access is denied, the page selects the prompt for manual copying. Localhost links require this server on your own computer and are not public hosted links. Saved Markdown and text prompt links remain usable directly on GitHub.

Regenerate the saved library after editing its source:

```sh
node docs/art/tools/build-art-prompts.mjs
```

The tools have no package dependencies and do not modify gameplay files. Artwork generation and integration remain future work.
