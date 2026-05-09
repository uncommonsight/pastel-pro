# Pastel You — CLAUDE.md

Mobile-first PWA photo editor. No build step — plain HTML/CSS/JS served as static files. Designed primarily for iPhone (iOS Safari PWA).

## File Map

```
index.html          — single page, all screens inline
js/state.js         — global `state` object, loaded first
js/presets.js       — PRESET_FOLDERS array, all preset data
js/render.js        — filter engine (applyPreset), canvas draw, crop overlay + logic
js/navigation.js    — folder/preset navigation, thumbnail rendering
js/ui.js            — DOM refs, event handlers, image load, undo, crop UI wiring
js/app.js           — init (loadImage, reset on new image)
css/variables.css   — design tokens (colors, radius, shadow)
css/layout.css      — screen layout, header, canvas, controls area
css/controls.css    — buttons, sliders, editor bubble, crop bubble
css/presets.css     — preset strip, folder items, preset thumbnails
```

Script load order matters: `state.js → presets.js → ui.js → render.js → navigation.js → app.js`

## State Shape

```js
state = {
  originalImageData,   // ImageData snapshot used for preset thumbnails
  activePresetId,      // 'original' = no preset
  intensity,           // 0–100, strength slider
  currentFolderId,     // null = folders view, string = inside a folder
  activeFolderIndex,
  isTransitioning,     // guard against double-tap during folder animation
  sourceImg,           // current Image element (may be cropped)
  originalSourceImg,   // the original uncropped Image (kept for undo)
  editor: { exposure, highlights, shadows, whites, blacks, contrast, fade, saturation, warmth, colorSat },
  crop: { active, x, y, width, height, rotation, locked, applied, lockedAspect, pan: {x,y} }
}
```

## Render Pipeline

`render()` in render.js:
1. Draw `state.sourceImg` to canvas at canvas size
2. `getImageData` → `applyPreset(data, preset, intensity)` → `putImageData`
3. If preset has a gradient, paint it on top via `fillRect`

`applyPreset` merges preset base values with `state.editor` deltas — sliders are always additive deltas on top of the preset, never absolute. The "original" preset has all-zero/all-one values so editor-only edits work without a preset.

## Preset System

- All presets live in `PRESET_FOLDERS` in `presets.js`
- Each preset: `{ id, name, brightness, saturation, tint:{r,g,b}, fade, warmth?, highlights?, shadows?, contrast?, grain?, gradient? }`
- `grain` is preset-only (not in editor) — random noise applied per pixel
- `gradient` is an array of `{pos, r, g, b, a}` stops painted over the canvas after pixel processing
- Selecting the same preset twice deselects it (toggle)
- Active preset name shown in header as `.preset-name-display` — tap to deselect

## Crop Tool

Crop overlay (`#crop-canvas`) is created dynamically over `.canvas-container` when crop opens, removed when closed. Key variables in render.js: `cropBox {x,y,w,h}`, `dragging`, `dragStart`.

- Corners: drag to resize (with optional aspect lock)
- Inside box: drag to pan the image
- `constrainPan()` must be called after every pan and after every corner resize clamp
- `state.crop.rotation` drives straightening; displayed via `#crop-straighten` slider
- `applyCrop()` bakes the current crop + rotation into a new `state.sourceImg`
- Auto straighten uses `detectHorizon()` — edge detection comparing left vs right columns
- Crop undo is isolated: only resets `state.crop.*` and the straighten slider — never touches editor or preset state

## CSS Design Tokens

```
--cream:      #faf7f4   (background, text on dark)
--text-dark:  #3a3035   (headings, bubble backgrounds)
--text-mid:   #8a7a80   (secondary text, icons)
--text-light: #b8acb0   (labels, values)
--blush/--peach/--mist/--lavender/--rose/--sage  (palette accents)
--radius:     18px
--radius-sm:  10px
--shadow / --shadow-sm
```

## UI Patterns

- **Bubbles**: `.editor-bubble` and `#crop-bubble` use `max-height: 0` → `max-height: 200px` transition for open/close. Class toggle: `.open`.
- **Preset strip**: `.preset-bubble` shrinks (`.shrunk`) when editor is open.
- **Intensity/Strength slider**: only visible when a non-original preset is active and editor is closed.
- **Undo**: `btnUndo.dataset.mode` is set to `'crop'` during crop mode. The click handler checks this — if `'crop'`, undo only crop state; otherwise `resetEditorState()`.
- **Preset name display**: uses `display: none` / `display: block` (NOT opacity transition) — iOS Safari compositor layer caching causes opacity-transitioned elements to not repaint immediately.

## iOS Safari Gotchas

- **Text selection during touch drag**: add `-webkit-user-select: none; user-select: none; -webkit-touch-callout: none` to any element the user drags. Both `#main-canvas` and `#crop-canvas` need this.
- **`display: none` vs `opacity: 0` for show/hide**: Elements with `transition: opacity` get GPU-composited on iOS. Removing a class that sets `opacity: 1` back to `opacity: 0` may not visually update until a major DOM repaint. Use `display: none` / `display: block` for anything that needs to disappear reliably.
- **PWA status bar**: `apple-mobile-web-app-status-bar-style: black-translucent` — safe area insets needed for notch/Dynamic Island (not yet wired up, see TODO).
- **`-webkit-tap-highlight-color: transparent`** is set globally in variables.css reset.

## Key Helper Functions

| Function | File | Purpose |
|---|---|---|
| `render()` | render.js | Full canvas redraw |
| `scheduleRender()` | render.js | rAF-debounced render |
| `applyPreset(imageData, preset, intensity)` | render.js | Pixel-loop filter engine |
| `showCropOverlay()` / `hideCropOverlay()` | render.js | Create/destroy crop canvas |
| `drawCropOverlay()` | render.js | Redraw crop UI |
| `constrainPan()` | render.js | Clamp pan so image covers crop box |
| `applyCrop()` | render.js | Bake crop into new sourceImg |
| `detectHorizon()` | render.js | Auto-straighten angle detection |
| `closeCropClean()` | ui.js | Full crop teardown (close bubble, hide overlay, reset state/UI) |
| `resetEditorState()` | ui.js | Reset all editor sliders + preset to original |
| `loadImage(file)` | app.js | Load new image, reset all state |
| `selectPreset(id)` | navigation.js | Activate/deactivate a preset |
| `enterFolder(id)` / `exitFolder()` | navigation.js | Folder navigation with animation |
| `buildPresetThumbnails()` | navigation.js | Render current view (folders or presets) |
| `setActivePresetUI(id)` | navigation.js | Toggle `.active` on preset items |

## What's Next (from TODO.md)

- Fix top gap on iPhone — `viewport-fit=cover` + `env(safe-area-inset-top)`
- Code cleanup pass (no functionality changes)
- Custom folder — save up to 5 user styles to localStorage
- Preset stacking (one per folder, layers)
- Icon update — more blue at bottom of gradient
- App look and feel refresh + glass UI pass
- Long-term: React Native rebuild with Core Image GPU pipeline
