# Pastel You — CLAUDE.md
Mobile-first PWA photo editor. Plain HTML/CSS/JS, no build step. Target: iPhone iOS Safari PWA.

## File Map (load order matters)
state.js → presets.js → ui.js → render.js → navigation.js → app.js
- index.html — single page, all screens inline
- js/state.js — global `state` object
- js/presets.js — PRESET_FOLDERS array
- js/render.js — filter engine, canvas draw, crop overlay
- js/navigation.js — folder/preset nav, thumbnails
- js/ui.js — DOM refs, event handlers, image load, undo, crop wiring
- js/app.js — init
- css/variables.css — design tokens
- css/layout.css — screen layout
- css/controls.css — buttons, sliders, bubbles
- css/presets.css — preset strip, thumbnails

## State Shape
state = {
  originalImageData, activePresetId, intensity,
  currentFolderId, isTransitioning, sourceImg, originalSourceImg,
  editor: { exposure, highlights, shadows, whites, blacks,
            contrast, fade, saturation, warmth, colorSat },
  crop: { active, x, y, width, height, rotation,
          locked, applied, lockedAspect, pan:{x,y} }
}

## Render Pipeline
1. Draw state.sourceImg to canvas
2. getImageData → applyPreset(data, preset, intensity) → putImageData
3. If preset has gradient, paint stops via fillRect
Editor sliders are additive deltas on top of preset — never absolute.
"original" preset = all zeros so editor-only edits work without a preset.

## Preset System
Each preset: { id, name, brightness, saturation, tint:{r,g,b}, fade,
               warmth?, highlights?, shadows?, contrast?, grain?, gradient? }
- grain = preset-only, random noise per pixel
- gradient = array of {pos,r,g,b,a} stops painted after pixel processing
- Selecting same preset twice deselects it
- Active preset shown in header .preset-name-display — tap to deselect

## Crop Tool
Overlay (#crop-canvas) created dynamically, removed on close.
- Corners: resize with optional aspect lock
- Inside box: pan the image
- constrainPan() required after every pan and corner resize
- applyCrop() bakes crop+rotation into new state.sourceImg
- Crop undo resets only state.crop.* — never touches editor/preset state

## CSS Tokens
--cream --text-dark --text-mid --text-light
--blush --peach --mist --lavender --rose --sage
--radius:18px --radius-sm:10px --shadow --shadow-sm

## UI Patterns
- Bubbles: max-height:0→200px transition, toggled with .open
- Preset strip: .shrunk when editor open
- Intensity slider: visible only when non-original preset active + editor closed
- Undo: dataset.mode==='crop' → crop-only, else resetEditorState()

## iOS Safari Rules
- Draggable elements MUST have -webkit-user-select:none; user-select:none; -webkit-touch-callout:none
- Use display:none/block NOT opacity for reliable hide/show
- -webkit-tap-highlight-color:transparent set globally in variables.css

## Refactor Rules (active)
- MOVE code only — never rewrite, improve, or optimize
- One file per session — finish completely before touching another
- Update script load order in index.html after every move
- No renaming, no formatting changes, no added comments

## Smoke Test (before every push)
1. Load a photo on iPhone
2. Apply a preset
3. Adjust a slider
4. Use crop tool
5. Export/share
All 5 must work before pushing.
