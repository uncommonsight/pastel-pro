## Last files edited
- `css/presets.css` — stripped to strip-only styles (Groups 1–4, 6, 9); folder view and carousel animations removed
- `css/folders.css` — new file: folder view, folder indicator base styles, and carousel animations (Groups 5, 7, 8)
- `index.html` — added `<link rel="stylesheet" href="css/folders.css">` after `presets.css`
- `js/render.js` — restored lost `state.gradientDirection` switch at line 195

## Work in progress
presets.css refactor is complete. No task is mid-flight.

## Decisions made
- Group 5 (folder indicator base styles: `.folder-indicator`, `.folder-visual-small`) moved to `folders.css` — its `[data-folder-type]` visual skins live in Group 7, keeping them split would fragment one component across two files.
- Gradient rotate button bug fixed in-session: commit `b1f31dd` (cinema presets) accidentally replaced the 4-direction `switch(state.gradientDirection)` in `render.js` with a hardcoded top-to-bottom gradient. Restored from `298f36c`.

## Next steps
1. **Smoke test on iPhone** — load photo, apply gradient preset, tap rotate arrow (must cycle 4 directions), apply another preset, adjust slider, crop, export. All 5 smoke test steps must pass.
2. **Commit** — suggested message: `refactor: split presets.css into presets and folders, fix gradient rotate regression`
3. **Next refactor candidate** — `css/layout.css` if continuing the CSS split (not yet reviewed for splitting).

## Blockers / open questions
- Smoke test not yet run on device — required before push.
