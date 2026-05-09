// ============================================
//  UI — DOM refs, events, image loading
// ============================================

const screenHome = document.getElementById('screen-home');
const screenEditor = document.getElementById('screen-editor');
const btnPick = document.getElementById('btn-pick');
const btnDownload = document.getElementById('btn-download');
const btnBackFolder = document.getElementById('btn-back-folder');
const btnUndo = document.getElementById('btn-undo');
const btnClose = document.getElementById('btn-close');
const fileInput = document.getElementById('file-input');
const downloadAnchor = document.getElementById('download-anchor');
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
const presetsTrack = document.getElementById('presets-track');
const intensitySlider = document.getElementById('intensity-slider');
const intensityDisplay = document.getElementById('intensity-display');

// Compare to Original - hold to preview, release to restore
let compareTimeout = null;

canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  compareTimeout = setTimeout(() => {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(state.sourceImg, 0, 0, canvas.width, canvas.height);
  }, 100);
});

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('pointerup', () => {
  clearTimeout(compareTimeout);
  if (compareTimeout !== null) {
    render();
    compareTimeout = null;
  }
});

const editorSliders = [
  { id: 'edit-exposure', key: 'exposure', valId: 'edit-exposure-val', decimals: 2 },
  { id: 'edit-highlights', key: 'highlights', valId: 'edit-highlights-val', decimals: 2 },
  { id: 'edit-shadows', key: 'shadows', valId: 'edit-shadows-val', decimals: 2 },
  { id: 'edit-whites', key: 'whites', valId: 'edit-whites-val', decimals: 2 },
  { id: 'edit-blacks', key: 'blacks', valId: 'edit-blacks-val', decimals: 2 },
  { id: 'edit-contrast', key: 'contrast', valId: 'edit-contrast-val', decimals: 2 },
  { id: 'edit-fade', key: 'fade', valId: 'edit-fade-val', decimals: 1 },
  { id: 'edit-saturation', key: 'saturation', valId: 'edit-saturation-val', decimals: 2 },
  { id: 'edit-warmth', key: 'warmth', valId: 'edit-warmth-val', decimals: 0 },
];

function showScreen(screenEl) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  screenEl.classList.add('active');
}

function updateSliderTrack(value) {
  intensitySlider.style.setProperty('--val', value + '%');
}

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

function loadImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 1200;
      let w = img.naturalWidth;
      let h = img.naturalHeight;

      if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      canvas.width = w;
      canvas.height = h;
      document.documentElement.style.setProperty('--canvas-width', w + 'px');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      state.sourceImg = img;
      state.originalSourceImg = img;

      // Clean up any in-progress crop from a previous session
      if (cropBubble.classList.contains('open')) closeCropClean();

      ctx.drawImage(img, 0, 0, w, h);
      state.originalImageData = ctx.getImageData(0, 0, w, h);
      state.activePresetId = 'original';
      state.intensity = 100;
      state.currentFolderId = null;
      state.gradientDirection = 0;

      intensitySlider.value = 100;
      intensityDisplay.textContent = '100';
      updateSliderTrack(100);

      buildPresetThumbnails();
      updateFolderHeader();
      setActivePresetUI('original');
      render();
      showScreen(screenEditor);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ============================================
//  EDITOR SLIDER SETUP
// ============================================

function resetEditorState() {
  state.editor = {
    exposure: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    contrast: 0,
    fade: 0,
    saturation: 0,
    warmth: 0,
    colorSat: { red: 0, orange: 0, yellow: 0, green: 0, cyan: 0, blue: 0, purple: 0 },
  };

  editorSliders.forEach(({ id, valId, decimals }) => {
    const slider = document.getElementById(id);
    const display = document.getElementById(valId);
    if (slider) slider.value = 0;
    if (display) display.textContent = (0).toFixed(decimals);
  });

  const satSlider = document.getElementById('edit-color-sat');
  const satVal = document.getElementById('edit-color-sat-val');
  const satRow = document.getElementById('color-sat-row');
  if (satSlider) satSlider.value = 0;
  if (satVal) satVal.textContent = '0.00';
  if (satRow) satRow.style.display = 'none';
  document.querySelectorAll('.color-chip').forEach(c => c.classList.remove('active'));
  activeColorChip = null;

  scheduleRender();
}

editorSliders.forEach(({ id, key, valId, decimals }) => {
  const slider = document.getElementById(id);
  const display = document.getElementById(valId);
  if (!slider || !display) return;

  let lastTap = 0;

  slider.addEventListener('input', () => {
    const val = parseFloat(slider.value);
    state.editor[key] = val;
    display.textContent = val.toFixed(decimals);
    scheduleRender();
  });

  slider.addEventListener('pointerdown', () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      slider.value = 0;
      state.editor[key] = 0;
      display.textContent = (0).toFixed(decimals);
      scheduleRender();
    }
    lastTap = now;
  });
});

// Color chip + sat slider
let activeColorChip = null;
let lastColorTap = 0;

document.querySelectorAll('.color-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.color-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeColorChip = chip.dataset.color;

    const satRow = document.getElementById('color-sat-row');
    const satLabel = document.getElementById('color-sat-label');
    const satSlider = document.getElementById('edit-color-sat');

    satRow.style.display = 'flex';
    satLabel.textContent = chip.dataset.color + ' sat';
    satSlider.value = state.editor.colorSat[activeColorChip] || 0;
    document.getElementById('edit-color-sat-val').textContent = Number(satSlider.value).toFixed(2);

    //Reset double tap timer when chip changes
    lastColorTap = 0;
  });
});

const colorSatSlider = document.getElementById('edit-color-sat');

colorSatSlider.addEventListener('input', (e) => {
  const val = parseFloat(e.target.value);
  if (activeColorChip) {
    state.editor.colorSat[activeColorChip] = val;
    document.getElementById('edit-color-sat-val').textContent = val.toFixed(2);
    scheduleRender();
  }
});

colorSatSlider.addEventListener('click', () => {
  const now = Date.now();
  if (now - lastColorTap < 400) {
    colorSatSlider.value = 0;
    if (activeColorChip) {
      state.editor.colorSat[activeColorChip] = 0;
    }
    document.getElementById('edit-color-sat-val').textContent = '0.00';
    scheduleRender();
  }
  lastColorTap = now;
});

// ============================================
//  EVENTS
// ============================================

btnPick.addEventListener('click', () => {
  fileInput.value = '';
  fileInput.removeAttribute('capture');
  fileInput.click();
});

function closeCropClean() {
  cropBubble.classList.remove('open');
  hideCropOverlay();
  document.getElementById('btn-undo').dataset.mode = '';
  const undoLbl = document.getElementById('btn-undo-label');
  undoLbl.textContent = '';
  undoLbl.classList.remove('visible');
  cropStraighten.value = 0;
  cropStraightenVal.textContent = '0°';
  state.crop.rotation = 0;
  state.crop.pan = { x: 0, y: 0 };
  autoActive = false;
  document.getElementById('btn-auto-straighten').classList.remove('active');
  document.querySelector('.preset-bubble').classList.remove('shrunk');
  updateGradientRotateBtn();
}

btnClose.addEventListener('click', () => {
  if (cropBubble.classList.contains('open')) closeCropClean();
  document.getElementById('editor-bubble').classList.remove('open');

  state.sourceImg = null;
  state.originalImageData = null;
  state.currentFolderId = null;
  state.activePresetId = 'original';
  presetsTrack.innerHTML = '';
  canvas.width = 0;
  canvas.height = 0;

  const nameDisplay = document.getElementById('preset-name-display');
  if (nameDisplay) {
    nameDisplay.textContent = '';
    nameDisplay.classList.remove('visible');
  }

  resetEditorState();

  document.querySelector('.intensity-wrap').style.display = 'none';
  document.querySelector('.preset-bubble').classList.remove('shrunk');

  showScreen(screenHome);
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) loadImage(file);
});

btnBackFolder.addEventListener('click', () => {
  if (state.currentFolderId) {
    exitFolder();
  } else {
    state.sourceImg = null;
    state.originalImageData = null;
    state.currentFolderId = null;
    state.activePresetId = 'original';
    presetsTrack.innerHTML = '';
    canvas.width = 0;
    canvas.height = 0;
    showScreen(screenHome);
  }
});

const btnEdit = document.getElementById('btn-edit');
const editorBubble = document.getElementById('editor-bubble');

btnEdit.addEventListener('click', () => {
  const isOpen = editorBubble.classList.contains('open');
  const presetBubble = document.querySelector('.preset-bubble');
  const intensityWrap = document.querySelector('.intensity-wrap');

  if (isOpen) {
    editorBubble.classList.remove('open');
    presetBubble.classList.remove('shrunk');
    if (state.activePresetId !== 'original') {
      intensityWrap.style.display = 'flex';
    }
  } else {
    // Close crop if open, without applying
    if (cropBubble.classList.contains('open')) {
      cropBubble.classList.remove('open');
      hideCropOverlay();
      document.getElementById('btn-undo').dataset.mode = '';
      const lbl = document.getElementById('btn-undo-label');
      lbl.textContent = '';
      lbl.classList.remove('visible');
    }
    editorBubble.classList.add('open');
    presetBubble.classList.add('shrunk');
    intensityWrap.style.display = 'none';
  }
  updateGradientRotateBtn();
});

const btnCrop = document.getElementById('btn-crop');
const cropBubble = document.getElementById('crop-bubble');
let cropLocked = false;
let autoActive = false;
let autoPreRotation = 0;

btnCrop.addEventListener('click', () => {
  const isOpen = cropBubble.classList.contains('open');
  const presetBubble = document.querySelector('.preset-bubble');
  const intensityWrap = document.querySelector('.intensity-wrap');
  const undoLbl = document.getElementById('btn-undo-label');

  if (isOpen) {
    applyCrop();
    cropBubble.classList.remove('open');
    presetBubble.classList.remove('shrunk');
    hideCropOverlay();
    document.getElementById('btn-undo').dataset.mode = '';
    undoLbl.textContent = '';
    undoLbl.classList.remove('visible');
    cropStraighten.value = 0;
    cropStraightenVal.textContent = '0°';
    autoActive = false;
    document.getElementById('btn-auto-straighten').classList.remove('active');
    if (state.activePresetId !== 'original') {
      intensityWrap.style.display = 'flex';
    }
    updateGradientRotateBtn();
  } else {
    // Close editor if open
    editorBubble.classList.remove('open');
    cropBubble.classList.add('open');
    presetBubble.classList.add('shrunk');
    intensityWrap.style.display = 'none';
    document.getElementById('btn-undo').dataset.mode = 'crop';
    updateGradientRotateBtn();
    undoLbl.textContent = 'crop';
    undoLbl.classList.add('visible');
    // Wait for the max-height transition to finish before measuring canvas position
    let overlayShown = false;
    const showWhenReady = () => {
      if (!overlayShown && cropBubble.classList.contains('open')) {
        overlayShown = true;
        showCropOverlay();
      }
    };
    cropBubble.addEventListener('transitionend', showWhenReady, { once: true });
    setTimeout(showWhenReady, 450);
  }
});

// Lock toggle
document.getElementById('btn-crop-lock').addEventListener('click', () => {
  cropLocked = !cropLocked;
  state.crop.locked = cropLocked;
  state.crop.lockedAspect = cropLocked ? (canvas.width / canvas.height) : null;
  const btn = document.getElementById('btn-crop-lock');
  btn.classList.toggle('locked', cropLocked);

  // Update lock icon to closed
  btn.innerHTML = cropLocked
    ? `<svg width="14" height="17" viewBox="0 0 14 17" fill="none">
      <rect x="2" y="8" width="10" height="8" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M4 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
     </svg>`
    : `<svg width="14" height="17" viewBox="0 0 14 17" fill="none">
      <rect x="2" y="8" width="10" height="8" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M4 8V6a3 3 1 0 1 9 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
     </svg>`;
});

// Straighten slider
const cropStraighten = document.getElementById('crop-straighten');
const cropStraightenVal = document.getElementById('crop-straighten-val');
let straightenLastTap = 0;

cropStraighten.addEventListener('input', () => {
  if (autoActive) {
    autoActive = false;
    document.getElementById('btn-auto-straighten').classList.remove('active');
  }
  const val = parseFloat(cropStraighten.value);
  state.crop.rotation = val;
  cropStraightenVal.textContent = val.toFixed(1) + '°';
  updateCropOverlay();
});

cropStraighten.addEventListener('pointerdown', () => {
  const now = Date.now();
  if (now - straightenLastTap < 300) {
    if (autoActive) {
      autoActive = false;
      document.getElementById('btn-auto-straighten').classList.remove('active');
    }
    cropStraighten.value = 0;
    state.crop.rotation = 0;
    cropStraightenVal.textContent = '0°';
    updateCropOverlay();
  }
  straightenLastTap = now;
});

// Auto straighten — toggles on/off
document.getElementById('btn-auto-straighten').addEventListener('click', () => {
  const autoBtn = document.getElementById('btn-auto-straighten');
  if (autoActive) {
    autoActive = false;
    state.crop.rotation = autoPreRotation;
    cropStraighten.value = autoPreRotation;
    cropStraightenVal.textContent = autoPreRotation.toFixed(1) + '°';
    autoBtn.classList.remove('active');
  } else {
    autoPreRotation = state.crop.rotation;
    const angle = detectHorizon();
    autoActive = true;
    state.crop.rotation = angle;
    cropStraighten.value = angle;
    cropStraightenVal.textContent = angle.toFixed(1) + '°';
    autoBtn.classList.add('active');
  }
  updateCropOverlay();
});

// Undo in crop mode
btnUndo.addEventListener('click', () => {
  if (btnUndo.dataset.mode === 'crop') {
    if (state.originalSourceImg && state.originalSourceImg !== state.sourceImg) {
      state.sourceImg = state.originalSourceImg;
      const maxDim = 1200;
      let w = state.originalSourceImg.naturalWidth;
      let h = state.originalSourceImg.naturalHeight;
      if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      canvas.width = w;
      canvas.height = h;
      document.documentElement.style.setProperty('--canvas-width', w + 'px');
      render();
    }
    state.crop.rotation = 0;
    state.crop.pan = { x: 0, y: 0 };
    cropStraighten.value = 0;
    cropStraightenVal.textContent = '0°';
    autoActive = false;
    document.getElementById('btn-auto-straighten').classList.remove('active');
    hideCropOverlay();
    showCropOverlay();
  } else {
    resetEditorState();
  }
});

btnDownload.addEventListener('click', downloadImage);

intensitySlider.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  state.intensity = val;
  intensityDisplay.textContent = val;
  updateSliderTrack(val);
  scheduleRender();
});

document.getElementById('preset-name-display').addEventListener('click', () => {
  state.activePresetId = 'original';
  state.intensity = 100;
  intensitySlider.value = 100;
  intensityDisplay.textContent = '100';
  updateSliderTrack(100);
  setActivePresetUI(null);
  document.querySelector('.intensity-wrap').style.display = 'none';
  const nameDisplay = document.getElementById('preset-name-display');
  nameDisplay.textContent = '';
  nameDisplay.classList.remove('visible');
  state.gradientDirection = 0;
  updateGradientRotateBtn();
  render();
});

document.getElementById('btn-gradient-rotate').addEventListener('click', () => {
  state.gradientDirection = (state.gradientDirection + 1) % 4;
  render();
});
