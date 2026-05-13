# HANDOFF

## Last file edited
`CLAUDE.md` and `README.md` — documentation updated to match current codebase.

**CLAUDE.md changes:**
- File map load order updated to full 13-file chain: `state → presets → ui → download → compare → image-load → editor → render → crop → crop-ui → preset-select → folders → app`
- All new JS files described (download.js, compare.js, image-load.js, editor.js, crop-ui.js, preset-select.js, folders.js)
- `css/folders.css` added to CSS list
- Preset System shape corrected: added `clarity`, `vignette`, `bloom`, `splitTone`; fixed gradient structure to `{ type, stops:[{pos,r,g,b,a}] }`

**README.md changes:**
- All preset tables replaced with bold-name list format per user request
- Cinema folder added (was completely missing): Matrix, Titanic, Casablanca, Blade, Drive
- Glow folder description updated to mention bloom

## Work in progress
Nothing in flight. Documentation pass is complete.

## Decisions made
- Cinema preset descriptions written from the preset data (tint color, contrast, grain, vignette values) since there were no existing descriptions — kept them short and vibe-focused to match the README tone.
- Kept CLAUDE.md Refactor Rules section unchanged — still active.

## Next steps
1. **Smoke test on iPhone** — still required before pushing. All 5 steps: load photo, apply preset, adjust slider, crop/undo/straighten, export. This was flagged in the previous handoff and has not been done yet.
2. **Commit** — suggested message: `refactor: split ui.js into compare, image-load, editor, crop-ui, download; update docs`
3. **Next refactor candidate** — `js/render.js` (237 lines): consider splitting `applyPreset` filter engine into its own file, leaving `render()`, `scheduleRender`, and gradient paint in render.js.

## Blockers / open questions
- Smoke test not yet run on device — required before push.
- `TODO.md` exists in the project root but was not reviewed this session — may contain relevant tasks.
