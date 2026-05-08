# Pastel You — Todo

## Next Up (in order)

- [ ] Fix top gap on iPhone
      viewport-fit=cover + env(safe-area-inset-top)
      Test carefully with Dynamic Island

- [ ] Code cleanup pass
      Remove dead/commented code
      Consolidate duplicate CSS rules
      Split controls.css → controls.css + editor.css
      Split layout.css → layout.css + home.css
      Add comments to new JS sections
      No functionality changes — purely organizational

- [ ] Custom folder — save up to 5 user styles
      localStorage persistence
      Name your style
      Thumbnail preview
      Delete/replace slots

- [ ] Preset stacking — one per folder, renders as layers

- [ ] Icon update — more blue at bottom of gradient

- [ ] App look and feel refresh + full glass UI pass

## React Native Todo

- [ ] Full pipeline rebuild — Core Image, GPU filters
      Smooth 60fps, no pixel loop lag
      True lossless JPEG/HEIC output
- [ ] Direct photo library access
      Limited access, skip picker
- [ ] Auto save to camera roll
      "Image saved!" toast notification
      Return to home after save
- [ ] iOS Photos Editing Extension
      Plug into Photos app edit flow
      Non destructive editing + revert
      Requires App Store distribution
- [ ] Native glass UI — full iOS 26 treatment
      Haptic feedback on interactions
      Native gestures
- [ ] True split tone (warm highlights cool shadows)
      Per channel color curves
- [ ] Full grain and texture overlays for retro presets
      CRT scanlines, pixelation artifacts

## App Store Roadmap

- [ ] TestFlight beta
- [ ] App Store launch
- [ ] Photos Editing Extension (post launch)
- [ ] Pastel You Pro tier

## Completed

- [x] Pastel presets tuned
- [x] Cotton Candy preset
- [x] Gradient presets (Golden Hour, Blue Hour, Rose Sky)
- [x] Lavender Sky + Cotton Sky gradients
- [x] Monochrome → Noir folder, Classic, Soft, Dramatic
- [x] Vibrant folder (Rose, Peach, Violet, Electric Sky, Jade, Fuchsia)
- [x] Glow folder (Neon, Electric, Ember, Midnight, Haze)
- [x] Contrast parameter in preset engine
- [x] Warmth, Highlights, Shadows parameters in preset engine
- [x] Fade slider added to editor
- [x] Noir black and white fixed (saturation 0 bug)
- [x] Folder navigation with animations
- [x] Preset strip centered on desktop
- [x] Folders start at beginning on iPhone
- [x] Preset sticky — tap same preset to deselect
- [x] Preset name shows in header, tap to deselect
- [x] Undo clears editor deltas only, preset stays
- [x] Tap image to see original, release to return
- [x] Editor bubble — dark charcoal, cream text
- [x] Preset bubble — dark, cream text, shrinks in editor mode
- [x] Delta system — sliders at 0, preset base underneath
- [x] Color channel saturation (HSL per color)
- [x] Double tap slider to reset individual
- [x] Strength slider renamed, moved between editor and presets
- [x] Strength only shows when preset active
- [x] Editor opens with edit icon, preset bubble shrinks
- [x] Compare tap — hold image to see original
- [x] Long press text selection prevented on canvas
- [x] JS modular refactor (state, presets, render, navigation, ui, app)
- [x] CSS modular refactor (variables, layout, controls, presets)
- [x] Manifest + PWA icons
- [x] Location hard coded off
- [x] Save uses native iOS share sheet
- [x] PNG output at 4096px on save
- [x] imageSmoothingQuality high on canvas
- [x] sourceImg stored in state for cleaner renders
- [x] Reset on new image load (editor, preset name, sliders)
- [x] gitignore + clean repo
- [x] README + TODO
- [x] Add grain parameter to preset engine
      Preset-only — NOT in editor
      Pixel loop grain texture
      Range: 0–30
      Build before retro folder

- [x] Retro folder — 6-8 presets
      Film era: Kodak, Polaroid, Cross
      Digital era: Digicam, CRT, Gameboy, VHS, SVGA
      Requires grain parameter first

- [x] Crop tool
      Crop icon next to edit icon
      Drag corners to crop
      Straightener/rotation inside crop
      Non destructive until save
