// ============================================
//  RENDER — filter engine and canvas drawing
// ============================================

function applyPreset(imageData, preset, intensity) {
  const src  = imageData.data;
  const out  = new ImageData(new Uint8ClampedArray(src), imageData.width, imageData.height);
  const data = out.data;
  const t    = intensity / 100;

  const { brightness, saturation, tint, fade, contrast = 1.0 } = preset;

  for (let i = 0; i < data.length; i += 4) {
    let r = src[i];
    let g = src[i + 1];
    let b = src[i + 2];

    const bAdj = 1 + (brightness - 1) * t;
    r = r * bAdj;
    g = g * bAdj;
    b = b * bAdj;

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const sAdj = 1 + (saturation - 1) * t;
    r = lum + (r - lum) * sAdj;
    g = lum + (g - lum) * sAdj;
    b = lum + (b - lum) * sAdj;

    r = r + tint.r * t;
    g = g + tint.g * t;
    b = b + tint.b * t;

    const fadeAmt = fade * t;
    r = r + (255 - r) * (fadeAmt / 255);
    g = g + (255 - g) * (fadeAmt / 255);
    b = b + (255 - b) * (fadeAmt / 255);

    const cAdj = 1 + (contrast - 1) * t;
    r = (r - 128) * cAdj + 128;
    g = (g - 128) * cAdj + 128;
    b = (b - 128) * cAdj + 128;

    data[i]     = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }

  return out;
}

function render() {
  if (!state.originalImageData) return;

  let preset = null;
  for (const folder of PRESET_FOLDERS) {
    preset = folder.presets.find(p => p.id === state.activePresetId);
    if (preset) break;
  }
  if (!preset) preset = PRESET_FOLDERS[0].presets[0];

  const output = applyPreset(state.originalImageData, preset, state.intensity);
  ctx.putImageData(output, 0, 0);

  if (preset && preset.gradient) {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    preset.gradient.stops.forEach(stop => {
      grad.addColorStop(stop.pos, `rgba(${stop.r}, ${stop.g}, ${stop.b}, ${stop.a * (state.intensity / 100)})`);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}
