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
    if (preset.clarity && preset.clarity !== 0) {
      const lumC = 0.299 * r + 0.587 * g + 0.114 * b;
      const midtoneFactor = 1 - Math.abs(lumC - 128) / 128;
      const clarityAdj = 1 + (preset.clarity * midtoneFactor * t);
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

// ============================================
//  CROP OVERLAY
// ============================================

let cropCanvas = null;
let cropCtx = null;
let cropBox = { x: 0, y: 0, w: 0, h: 0 };
let dragging = null;
let dragStart = { x: 0, y: 0 };
const HANDLE_SIZE = 22;

function showCropOverlay() {
  const container = document.querySelector('.canvas-container');
  const rect = canvas.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const displayW = rect.width;
  const displayH = rect.height;

  cropCanvas = document.createElement('canvas');
  cropCanvas.id = 'crop-canvas';
  cropCanvas.width = Math.round(displayW * dpr);
  cropCanvas.height = Math.round(displayH * dpr);
  cropCanvas.style.position = 'absolute';
  cropCanvas.style.left = (rect.left - containerRect.left) + 'px';
  cropCanvas.style.top = (rect.top - containerRect.top) + 'px';
  cropCanvas.style.width = displayW + 'px';
  cropCanvas.style.height = displayH + 'px';

  container.appendChild(cropCanvas);

  cropCtx = cropCanvas.getContext('2d');
  cropCtx.scale(dpr, dpr);

  resetCropBox();
  drawCropOverlay();

  cropCanvas.addEventListener('pointerdown', onCropPointerDown);
  cropCanvas.addEventListener('pointermove', onCropPointerMove);
  cropCanvas.addEventListener('pointerup', onCropPointerUp);
}

function hideCropOverlay() {
  if (cropCanvas) {
    cropCanvas.remove();
    cropCanvas = null;
    cropCtx = null;
  }
}

function resetCropBox() {
  if (!cropCanvas) return;
  const pad = 20;
  const w = cropCanvas.offsetWidth;
  const h = cropCanvas.offsetHeight;
  cropBox = { x: pad, y: pad, w: w - pad * 2, h: h - pad * 2 };
  state.crop.pan = { x: 0, y: 0 };
}

function updateCropOverlay() {
  drawCropOverlay();
}

function drawCropOverlay() {
  if (!cropCtx) return;
  const cw = cropCanvas.offsetWidth;
  const ch = cropCanvas.offsetHeight;
  const angle = (state.crop.rotation * Math.PI) / 180;

  cropCtx.clearRect(0, 0, cw, ch);

  // Solid dark backdrop — covers the main canvas behind and any pan/rotation gaps
  cropCtx.fillStyle = 'rgba(0, 0, 0, 0.72)';
  cropCtx.fillRect(0, 0, cw, ch);

  // Draw the live image ONLY inside the crop box (clip so outside stays solid dark)
  cropCtx.save();
  cropCtx.beginPath();
  cropCtx.rect(cropBox.x, cropBox.y, cropBox.w, cropBox.h);
  cropCtx.clip();
  cropCtx.translate(cw / 2 + state.crop.pan.x, ch / 2 + state.crop.pan.y);
  cropCtx.rotate(angle);
  cropCtx.drawImage(canvas, -cw / 2, -ch / 2, cw, ch);
  cropCtx.restore();

  // Crop box border
  cropCtx.strokeStyle = 'rgba(250, 247, 244, 0.9)';
  cropCtx.lineWidth = 1.5;
  cropCtx.strokeRect(cropBox.x, cropBox.y, cropBox.w, cropBox.h);

  // Rule of thirds
  cropCtx.strokeStyle = 'rgba(250, 247, 244, 0.2)';
  cropCtx.lineWidth = 0.5;
  const thirdW = cropBox.w / 3;
  const thirdH = cropBox.h / 3;
  for (let i = 1; i < 3; i++) {
    cropCtx.beginPath();
    cropCtx.moveTo(cropBox.x + thirdW * i, cropBox.y);
    cropCtx.lineTo(cropBox.x + thirdW * i, cropBox.y + cropBox.h);
    cropCtx.stroke();
    cropCtx.beginPath();
    cropCtx.moveTo(cropBox.x, cropBox.y + thirdH * i);
    cropCtx.lineTo(cropBox.x + cropBox.w, cropBox.y + thirdH * i);
    cropCtx.stroke();
  }

  // L-shaped corner handles
  const handleLen = 16;
  cropCtx.strokeStyle = 'rgba(250, 247, 244, 0.95)';
  cropCtx.lineWidth = 2.5;

  const corners = [
    { x: cropBox.x, y: cropBox.y, dx: 1, dy: 1 },
    { x: cropBox.x + cropBox.w, y: cropBox.y, dx: -1, dy: 1 },
    { x: cropBox.x, y: cropBox.y + cropBox.h, dx: 1, dy: -1 },
    { x: cropBox.x + cropBox.w, y: cropBox.y + cropBox.h, dx: -1, dy: -1 },
  ];

  corners.forEach(c => {
    cropCtx.beginPath();
    cropCtx.moveTo(c.x + c.dx * handleLen, c.y);
    cropCtx.lineTo(c.x, c.y);
    cropCtx.lineTo(c.x, c.y + c.dy * handleLen);
    cropCtx.stroke();
  });
}

function constrainPan() {
  if (!cropCanvas) return;
  const cw = cropCanvas.offsetWidth;
  const ch = cropCanvas.offsetHeight;
  // Image occupies [pan.x, pan.x+cw] x [pan.y, pan.y+ch] in display space (ignoring rotation).
  // Crop box must stay fully inside the image — clamp pan accordingly.
  state.crop.pan.x = Math.max(cropBox.x + cropBox.w - cw, Math.min(cropBox.x, state.crop.pan.x));
  state.crop.pan.y = Math.max(cropBox.y + cropBox.h - ch, Math.min(cropBox.y, state.crop.pan.y));
}

function getCorners() {
  return [
    { x: cropBox.x, y: cropBox.y, pos: 'tl' },
    { x: cropBox.x + cropBox.w, y: cropBox.y, pos: 'tr' },
    { x: cropBox.x, y: cropBox.y + cropBox.h, pos: 'bl' },
    { x: cropBox.x + cropBox.w, y: cropBox.y + cropBox.h, pos: 'br' },
  ];
}

function onCropPointerDown(e) {
  e.preventDefault();
  cropCanvas.setPointerCapture(e.pointerId);
  const rect = cropCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (const c of getCorners()) {
    if (Math.abs(x - c.x) < HANDLE_SIZE && Math.abs(y - c.y) < HANDLE_SIZE) {
      dragging = c.pos;
      dragStart = { x, y };
      return;
    }
  }

  if (x > cropBox.x && x < cropBox.x + cropBox.w &&
    y > cropBox.y && y < cropBox.y + cropBox.h) {
    dragging = 'pan';
    dragStart = { x, y };
  }
}

function onCropPointerMove(e) {
  if (!dragging) return;
  const rect = cropCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const dx = x - dragStart.x;
  const dy = y - dragStart.y;
  dragStart = { x, y };

  const maxW = cropCanvas.offsetWidth;
  const maxH = cropCanvas.offsetHeight;
  const locked = state.crop.locked && state.crop.lockedAspect;
  const aspect = locked ? state.crop.lockedAspect : null;

  if (dragging === 'pan') {
    state.crop.pan.x += dx;
    state.crop.pan.y += dy;
    constrainPan();
  } else if (dragging === 'tl') {
    const bottom = cropBox.y + cropBox.h;
    cropBox.x += dx; cropBox.w -= dx;
    if (locked) {
      cropBox.h = cropBox.w / aspect;
      cropBox.y = bottom - cropBox.h;
    } else {
      cropBox.y += dy; cropBox.h -= dy;
    }
  } else if (dragging === 'tr') {
    const bottom = cropBox.y + cropBox.h;
    cropBox.w += dx;
    if (locked) {
      cropBox.h = cropBox.w / aspect;
      cropBox.y = bottom - cropBox.h;
    } else {
      cropBox.y += dy; cropBox.h -= dy;
    }
  } else if (dragging === 'bl') {
    cropBox.x += dx; cropBox.w -= dx;
    if (locked) {
      cropBox.h = cropBox.w / aspect;
    } else {
      cropBox.h += dy;
    }
  } else if (dragging === 'br') {
    cropBox.w += dx;
    if (locked) {
      cropBox.h = cropBox.w / aspect;
    } else {
      cropBox.h += dy;
    }
  }

  cropBox.w = Math.max(50, cropBox.w);
  cropBox.h = Math.max(50, cropBox.h);
  constrainPan();

  drawCropOverlay();
}

function onCropPointerUp() {
  dragging = null;
}

function applyCrop() {
  if (!state.sourceImg || !cropCanvas) return;

  const displayW = cropCanvas.offsetWidth;
  const displayH = cropCanvas.offsetHeight;

  // Skip if nothing changed from the default full-image box
  const pad = 20;
  const unchanged =
    state.crop.rotation === 0 &&
    state.crop.pan.x === 0 &&
    state.crop.pan.y === 0 &&
    Math.abs(cropBox.x - pad) < 1 &&
    Math.abs(cropBox.y - pad) < 1 &&
    Math.abs(cropBox.w - (displayW - pad * 2)) < 1 &&
    Math.abs(cropBox.h - (displayH - pad * 2)) < 1;
  if (unchanged) return;

  // Capture values synchronously before overlay is removed
  const box = { ...cropBox };
  const pan = { ...state.crop.pan };
  const angle = (state.crop.rotation * Math.PI) / 180;
  const srcImg = state.sourceImg;
  const srcW = srcImg.naturalWidth;
  const srcH = srcImg.naturalHeight;
  const scaleX = srcW / displayW;
  const scaleY = srcH / displayH;
  const panX = pan.x * scaleX;
  const panY = pan.y * scaleY;

  // Rotate + pan source image (mirrors the overlay transform)
  const rotCanvas = document.createElement('canvas');
  rotCanvas.width = srcW;
  rotCanvas.height = srcH;
  const rotCtx = rotCanvas.getContext('2d');
  rotCtx.imageSmoothingEnabled = true;
  rotCtx.imageSmoothingQuality = 'high';
  rotCtx.translate(srcW / 2 + panX, srcH / 2 + panY);
  rotCtx.rotate(angle);
  rotCtx.drawImage(srcImg, -srcW / 2, -srcH / 2, srcW, srcH);

  // Map crop box from display space to source pixel space
  const srcCropX = Math.max(0, Math.round(box.x * scaleX));
  const srcCropY = Math.max(0, Math.round(box.y * scaleY));
  const srcCropW = Math.min(srcW - srcCropX, Math.round(box.w * scaleX));
  const srcCropH = Math.min(srcH - srcCropY, Math.round(box.h * scaleY));

  const outCanvas = document.createElement('canvas');
  outCanvas.width = srcCropW;
  outCanvas.height = srcCropH;
  const outCtx = outCanvas.getContext('2d');
  outCtx.imageSmoothingEnabled = true;
  outCtx.imageSmoothingQuality = 'high';
  outCtx.drawImage(rotCanvas, srcCropX, srcCropY, srcCropW, srcCropH, 0, 0, srcCropW, srcCropH);

  outCanvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const newImg = new Image();
    newImg.onload = () => {
      URL.revokeObjectURL(url);
      state.sourceImg = newImg;

      const maxDim = 1200;
      let w = newImg.naturalWidth;
      let h = newImg.naturalHeight;
      if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      canvas.width = w;
      canvas.height = h;
      document.documentElement.style.setProperty('--canvas-width', w + 'px');
      state.crop.rotation = 0;
      state.crop.pan = { x: 0, y: 0 };
      render();
    };
    newImg.src = url;
  }, 'image/png');
}

// ============================================
//  AUTO HORIZON DETECTION
// ============================================

function detectHorizon() {
  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // Sample rows looking for strong horizontal edge
  const sampleRows = 20;
  const rowStep = Math.floor(h / sampleRows);
  let bestRow = Math.floor(h / 2);
  let bestContrast = 0;

  for (let row = rowStep; row < h - rowStep; row += rowStep) {
    let contrast = 0;
    for (let col = 0; col < w; col += 4) {
      const idx = (row * w + col) * 4;
      const idxAbove = ((row - 2) * w + col) * 4;
      const diff = Math.abs(data[idx] - data[idxAbove]) +
        Math.abs(data[idx + 1] - data[idxAbove + 1]) +
        Math.abs(data[idx + 2] - data[idxAbove + 2]);
      contrast += diff;
    }
    if (contrast > bestContrast) {
      bestContrast = contrast;
      bestRow = row;
    }
  }

  // Check if horizon is tilted by comparing left vs right side
  const leftY = findEdgeInColumn(data, w, h, Math.floor(w * 0.2));
  const rightY = findEdgeInColumn(data, w, h, Math.floor(w * 0.8));
  const deltaY = rightY - leftY;
  const deltaX = Math.floor(w * 0.6);
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  return Math.max(-45, Math.min(45, -angle));
}

function findEdgeInColumn(data, w, h, col) {
  let bestRow = Math.floor(h / 2);
  let bestContrast = 0;
  const step = 2;

  for (let row = step; row < h - step; row += step) {
    const idx = (row * w + col) * 4;
    const idxAbove = ((row - step) * w + col) * 4;
    const diff = Math.abs(data[idx] - data[idxAbove]) +
      Math.abs(data[idx + 1] - data[idxAbove + 1]) +
      Math.abs(data[idx + 2] - data[idxAbove + 2]);
    if (diff > bestContrast) {
      bestContrast = diff;
      bestRow = row;
    }
  }
  return bestRow;
}
