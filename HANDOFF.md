## Last files edited
- `js/crop.js` — new file: `showCropOverlay`, `hideCropOverlay`, `resetCropBox`, `updateCropOverlay`, `drawCropOverlay`, `constrainPan`, `getCorners`, `onCropPointerDown`, `onCropPointerMove`, `onCropPointerUp`, `applyCrop`, `detectHorizon`, `findEdgeInColumn` (moved from render.js)
- `js/render.js` — crop overlay section + horizon detection removed; now 237 lines, filter engine + canvas draw only
- `index.html` — added `crop.js` script tag between `render.js` and `preset-select.js`

## Work in progress
render.js refactor is complete. No task is mid-flight.

## Decisions made
- Split render.js into two files: filter engine + canvas draw stays in `render.js`, all crop overlay code + horizon detection moved to `crop.js`
- `crop.js` loads after `render.js` because `applyCrop()` calls `render()` at the end of its blob callback
- `detectHorizon` and `findEdgeInColumn` went into `crop.js` (not a separate file) because they are only ever used in crop context (auto-straighten)

## Next steps
1. **Smoke test on iPhone** — load photo, apply a preset, adjust a slider, use crop tool, export/share. All 5 must pass before pushing.
2. **Commit** — suggested message: `refactor: split render.js crop overlay into crop.js`
3. **Next refactor candidate** — `js/ui.js` was flagged last session as the largest remaining JS file; review its sections before splitting.

## Blockers / open questions
- Smoke test not yet run on device — required before push.
