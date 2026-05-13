## Last files edited
- `js/folders.js` — new file: `buildPresetThumbnails`, `renderFoldersView`, `renderPresetsView`, `enterFolder`, `exitFolder` (moved from navigation.js)
- `js/preset-select.js` — new file: `selectPreset`, `findPreset`, `setActivePresetUI`, `updateFolderHeader`, `updateGradientRotateBtn` (moved from navigation.js)
- `js/navigation.js` — deleted (all functions moved out)
- `index.html` — replaced `navigation.js` script tag with `preset-select.js` then `folders.js`

## Work in progress
navigation.js refactor is complete. No task is mid-flight.

## Decisions made
- Split navigation.js into two files instead of one: folder rendering/navigation logic → `folders.js`, preset selection + UI state → `preset-select.js`
- `preset-select.js` loads before `folders.js` because `folders.js` calls `selectPreset`, `updateGradientRotateBtn`, and `updateFolderHeader` at runtime
- navigation.js fully deleted — nothing remained after the split

## Next steps
1. **Smoke test on iPhone** — load photo, apply a preset, tap a folder, navigate back, adjust slider, use crop, export. All 5 smoke test steps must pass.
2. **Commit** — suggested message: `refactor: split navigation.js into folders.js and preset-select.js`
3. **Next refactor candidate** — `js/ui.js` is the largest remaining JS file and likely has groupable sections; review before splitting.

## Blockers / open questions
- Smoke test not yet run on device — required before push.
