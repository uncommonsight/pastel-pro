// ============================================
//  RENDER — filter engine and canvas drawing
// ============================================

let renderTimeout = null;

function scheduleRender() {
  if (renderTimeout) cancelAnimationFrame(renderTimeout);
  renderTimeout = requestAnimationFrame(render);
}

function applyPreset(imageData, preset, intensity) {
  const src = imageData.data;
  const out = new ImageData(new Uint8ClampedArray(src), imageData.width, imageData.height);
  const data = out.data;
  const t = intensity / 100;
  const ed = state.editor;

  const { tint } = preset;

  // Merge preset base + editor deltas
  const brightness = preset.brightness + ed.exposure;
  const saturation = (preset.saturation !== undefined ? preset.saturation : 1.0) + ed.saturation;
  const contrast = (preset.contrast !== undefined ? preset.contrast : 1.0) + ed.contrast;
  const fade = (preset.fade !== undefined ? preset.fade : 0) + ed.fade;
  const warmth = (preset.warmth !== undefined ? preset.warmth : 0) + ed.warmth;
  const highlights = (preset.highlights !== undefined ? preset.highlights : 0) + ed.highlights;
  const shadows = (preset.shadows !== undefined ? preset.shadows : 0) + ed.shadows;
  const clarity = (preset.clarity !== undefined ? preset.clarity : 0) + ed.clarity;

  for (let i = 0; i < data.length; i += 4) {
    let r = src[i];
    let g = src[i + 1];
    let b = src[i + 2];

    // --- Brightness + Exposure ---
    const bAdj = 1 + (brightness - 1) * t;
    r = r * bAdj;
    g = g * bAdj;
    b = b * bAdj;

    // --- Saturation ---
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const sAdj = 1 + (saturation - 1) * t;
    r = lum + (r - lum) * sAdj;
    g = lum + (g - lum) * sAdj;
    b = lum + (b - lum) * sAdj;

    // --- Tint ---
    r = r + tint.r * t;
    g = g + tint.g * t;
    b = b + tint.b * t;

    // --- Fade ---
    const fadeAmt = fade * t;
    r = r + (255 - r) * (fadeAmt / 255);
    g = g + (255 - g) * (fadeAmt / 255);
    b = b + (255 - b) * (fadeAmt / 255);

    // --- Contrast ---
    const cAdj = 1 + (contrast - 1) * t;
    r = (r - 128) * cAdj + 128;
    g = (g - 128) * cAdj + 128;
    b = (b - 128) * cAdj + 128;

    // --- Warmth ---
    const w = warmth * t;
    r = r + w;
    b = b - w;

    // --- Highlights ---
    const hAdj = highlights * t;
    if (r > 128) r = 128 + (r - 128) * (1 + hAdj);
    if (g > 128) g = 128 + (g - 128) * (1 + hAdj);
    if (b > 128) b = 128 + (b - 128) * (1 + hAdj);

    // --- Shadows ---
    const shAdj = shadows * t;
    if (r < 128) r = r * (1 + shAdj);
    if (g < 128) g = g * (1 + shAdj);
    if (b < 128) b = b * (1 + shAdj);

    // --- Whites (lifts very bright areas) ---
    const wh = ed.whites * t;
    if (r > 175) r = r + (255 - r) * wh;
    if (g > 175) g = g + (255 - g) * wh;
    if (b > 175) b = b + (255 - b) * wh;

    // --- Blacks (crushes very dark areas) ---
    const bl = ed.blacks * t;
    if (r < 95) r = r * (1 + bl);
    if (g < 95) g = g * (1 + bl);
    if (b < 95) b = b * (1 + bl);

    // --- Color Sat (HSL per channel) ---
    const colorSat = state.editor.colorSat;

    // Get hue of pixel to determine which channel it belongs to
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const delta = maxC - minC;

    if (delta > 10) {
      let hue = 0;
      if (maxC === r) hue = ((g - b) / delta) % 6;
      else if (maxC === g) hue = (b - r) / delta + 2;
      else hue = (r - g) / delta + 4;
      hue = Math.round(hue * 60);
      if (hue < 0) hue += 360;

      let satAdj = 0;
      if (hue >= 330 || hue < 20) satAdj = colorSat.red || 0;
      else if (hue < 50) satAdj = colorSat.orange || 0;
      else if (hue < 80) satAdj = colorSat.yellow || 0;
      else if (hue < 180) satAdj = colorSat.green || 0;
      else if (hue < 230) satAdj = colorSat.cyan || 0;
      else if (hue < 290) satAdj = colorSat.blue || 0;
      else if (hue < 330) satAdj = colorSat.purple || 0;

      if (satAdj !== 0) {
        const lum2 = 0.299 * r + 0.587 * g + 0.114 * b;
        const csAdj = 1 + (satAdj * 2);
        r = lum2 + (r - lum2) * csAdj;
        g = lum2 + (g - lum2) * csAdj;
        b = lum2 + (b - lum2) * csAdj;
      }
    }

    // --- Split Tone ---
    if (preset.splitTone) {
      const st = preset.splitTone;
      const lumST = 0.299 * r + 0.587 * g + 0.114 * b;
      const highlightBlend = Math.max(0, (lumST - 128) / 127) * t;
      const shadowBlend = Math.max(0, (128 - lumST) / 128) * t;

      if (highlightBlend > 0 && st.highlightTint) {
        r = r + st.highlightTint.r * highlightBlend;
        g = g + st.highlightTint.g * highlightBlend;
        b = b + st.highlightTint.b * highlightBlend;
      }
      if (shadowBlend > 0 && st.shadowTint) {
        r = r + st.shadowTint.r * shadowBlend;
        g = g + st.shadowTint.g * shadowBlend;
        b = b + st.shadowTint.b * shadowBlend;
      }
    }

    // --- Clarity (midtone contrast) ---
    if (clarity && clarity !== 0) {
      const lumC = 0.299 * r + 0.587 * g + 0.114 * b;
      const midtoneFactor = 1 - Math.abs(lumC - 128) / 128;
      const clarityAdj = 1 + (clarity * midtoneFactor * t);
      r = (r - 128) * clarityAdj + 128;
      g = (g - 128) * clarityAdj + 128;
      b = (b - 128) * clarityAdj + 128;
    }

    // --- Grain ---
    if (preset.grain && preset.grain > 0) {
      const grainAmt = preset.grain * t;
      const noise = (Math.random() - 0.5) * grainAmt;
      r = r + noise;
      g = g + noise;
      b = b + noise;
    }

    // --- Clamp ---
    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }

  return out;
}

function render() {
  if (!state.sourceImg) return;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(state.sourceImg, 0, 0, canvas.width, canvas.height);

  const freshData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let preset = null;
  for (const folder of PRESET_FOLDERS) {
    preset = folder.presets.find(p => p.id === state.activePresetId);
    if (preset) break;
  }
  if (!preset) preset = PRESET_FOLDERS[0].presets[0];

  const output = applyPreset(freshData, preset, state.intensity);
  ctx.putImageData(output, 0, 0);

  // --- Gradient overlay ---
  if (preset.gradient) {
    const gw = canvas.width;
    const gh = canvas.height;
    let grad;
    switch (state.gradientDirection) {
      case 1: grad = ctx.createLinearGradient(0, 0, gw, 0); break;   // left → right
      case 2: grad = ctx.createLinearGradient(0, gh, 0, 0); break;   // bottom → top
      case 3: grad = ctx.createLinearGradient(gw, 0, 0, 0); break;   // right → left
      default: grad = ctx.createLinearGradient(0, 0, 0, gh); break;  // top → bottom
    }
    preset.gradient.stops.forEach(stop => {
      grad.addColorStop(stop.pos, `rgba(${stop.r}, ${stop.g}, ${stop.b}, ${stop.a * (state.intensity / 100)})`);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, gw, gh);
  }

  // --- Vignette (preset only) ---
  if (preset.vignette && preset.vignette > 0) {
    const vAmt = preset.vignette * (state.intensity / 100);
    const vGrad = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
      canvas.width / 2, canvas.height / 2, canvas.height * 0.85
    );
    vGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vGrad.addColorStop(1, `rgba(0,0,0,${vAmt})`);
    ctx.fillStyle = vGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // --- Bloom/Glow (preset only) ---
  if (preset.bloom && preset.bloom > 0) {
    const bloomAmt = preset.bloom * (state.intensity / 100);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.filter = `blur(${Math.round(canvas.width * 0.015)}px) brightness(${1 + bloomAmt})`;
    ctx.globalAlpha = bloomAmt * 0.6;
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
    ctx.filter = 'none';
  }
}
