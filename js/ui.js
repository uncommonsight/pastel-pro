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
    const grad = saveCtx.createLinearGradient(0, 0, 0, saveCanvas.height);
    preset.gradient.stops.forEach(stop => {
      grad.addColorStop(stop.pos, `rgba(${stop.r}, ${stop.g}, ${stop.b}, ${stop.a * (state.intensity / 100)})`);
    });
    saveCtx.fillStyle = grad;
    saveCtx.fillRect(0, 0, saveCanvas.width, saveCanvas.height);
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

      ctx.drawImage(img, 0, 0, w, h);
      state.originalImageData = ctx.getImageData(0, 0, w, h);
      state.activePresetId = 'original';
      state.intensity = 100;
      state.currentFolderId = null;

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

btnClose.addEventListener('click', () => {
  state.sourceImg = null;
  state.originalImageData = null;
  state.currentFolderId = null;
  state.activePresetId = 'original';
  presetsTrack.innerHTML = '';
  canvas.width = 0;
  canvas.height = 0;
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

btnUndo.addEventListener('click', resetEditorState);

const btnEdit = document.getElementById('btn-edit');
const editorBubble = document.getElementById('editor-bubble');

btnEdit.addEventListener('click', () => {
  const isOpen = editorBubble.classList.contains('open');
  const presetBubble = document.querySelector('.preset-bubble');
  const intensityWrap = document.querySelector('.intensity-wrap');

  if (isOpen) {
    editorBubble.classList.remove('open');
    presetBubble.classList.remove('shrunk');
    // Show strength only if preset is active
    if (state.activePresetId !== 'original') {
      intensityWrap.style.display = 'flex';
    }
  } else {
    editorBubble.classList.add('open');
    presetBubble.classList.add('shrunk');
    intensityWrap.style.display = 'none';
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
  if (state.activePresetId && state.activePresetId !== 'original') {
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
    render();
  }
});
