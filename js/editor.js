// ============================================
//  EDITOR — slider config, reset, event wiring,
//           color chips, btnEdit bubble toggle
// ============================================

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
