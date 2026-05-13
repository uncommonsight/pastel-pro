// ============================================
//  DOWNLOAD — export/share rendered image
// ============================================

async function downloadImage() {
  const saveCanvas = document.createElement('canvas');
  const saveCtx = saveCanvas.getContext('2d');

  const maxSaveDim = 4096;
  let w = state.sourceImg.naturalWidth;
  let h = state.sourceImg.naturalHeight;

  if (w > maxSaveDim || h > maxSaveDim) {
    const ratio = Math.min(maxSaveDim / w, maxSaveDim / h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);
  }

  saveCanvas.width = w;
  saveCanvas.height = h;

  saveCtx.imageSmoothingEnabled = true;
  saveCtx.imageSmoothingQuality = 'high';
  saveCtx.drawImage(state.sourceImg, 0, 0, w, h);

  const freshData = saveCtx.getImageData(0, 0, w, h);

  let preset = null;
  for (const folder of PRESET_FOLDERS) {
    preset = folder.presets.find(p => p.id === state.activePresetId);
    if (preset) break;
  }
  if (!preset) preset = PRESET_FOLDERS[0].presets[0];

  const output = applyPreset(freshData, preset, state.intensity);
  saveCtx.putImageData(output, 0, 0);

  if (preset.gradient) {
    const sw = saveCanvas.width;
    const sh = saveCanvas.height;
    let grad;
    switch (state.gradientDirection) {
      case 1: grad = saveCtx.createLinearGradient(0, 0, sw, 0); break;
      case 2: grad = saveCtx.createLinearGradient(0, sh, 0, 0); break;
      case 3: grad = saveCtx.createLinearGradient(sw, 0, 0, 0); break;
      default: grad = saveCtx.createLinearGradient(0, 0, 0, sh); break;
    }
    preset.gradient.stops.forEach(stop => {
      grad.addColorStop(stop.pos, `rgba(${stop.r}, ${stop.g}, ${stop.b}, ${stop.a * (state.intensity / 100)})`);
    });
    saveCtx.fillStyle = grad;
    saveCtx.fillRect(0, 0, sw, sh);
  }

  const dataUrl = saveCanvas.toDataURL('image/png');
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File([blob], 'pastelyou-edit.png', { type: 'image/png' });

  if (navigator.share && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file] });
  } else {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'pastelyou-edit.png';
    a.click();
  }
}

btnDownload.addEventListener('click', downloadImage);
