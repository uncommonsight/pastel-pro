# Pastel You — Todo

## Next Up (in order)
- [ ] Preset stacking — one per folder, renders as layers
- [ ] Custom preset saving
- [ ] Icon update — more blue at bottom of gradient
- [ ] App look and feel refresh + full glass UI pass

## React Native Todo
- [ ] Image pipeline refactor — proper solution in React Native
- [ ] True lossless image pipeline using Core Image
- [ ] GPU accelerated filters
- [ ] Maximum quality JPEG/HEIC output
- [ ] Direct photo library access — limited access only
- [ ] Auto save to camera roll with confirmation message
      "Image saved!" toast notification
- [ ] Save straight to Photos then return home

## Completed
- [x] Pastel presets tuned
- [x] Cotton Candy preset
- [x] Gradient presets (Golden Hour, Blue Hour, Rose Sky)
- [x] Monochrome presets (Classic, Soft, Dramatic)
- [x] Contrast parameter in preset engine
- [x] Folder navigation
- [x] Preset strip centered
- [x] JS modular refactor
- [x] CSS modular refactor
- [x] Manifest + PWA icons
- [x] Location hard coded off
- [x] Intensity slider hide/show
- [x] Intensity slider width matches image
- [x] Save uses native iOS share sheet
- [x] PNG output for quality
- [x] imageSmoothingQuality high
- [x] sourceImg stored in state for cleaner renders
- [x] gitignore + clean repo
- [x] README + TODO
- [x] Vibrant folder — same shades, no fade, contrast bump, punchy
- [x] Per-preset intensity slider — compact, resets per preset
- [x] Editor layer — delta system on top of preset base
      - Sliders always at 0 on surface
      - Preset values hidden underneath as base
      - User moves = delta from base
      - Swap preset = deltas reset, new base loads silently
      - Works on Original (base = 0) and any preset
      - Controls: Exposure, Highlights, Shadows,
        Whites, Blacks, Contrast, Sat, Vibrance
- [x] Night Glow folder — moody, new controls needed
- [x] Original power editor — HSL per color channel
