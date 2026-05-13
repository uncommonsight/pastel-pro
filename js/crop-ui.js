// ============================================
//  CROP UI — bubble toggle, lock, straighten,
//            auto-straighten, undo, closeCropClean
// ============================================

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
