// ============================================
//  PRESET SELECT — preset selection, lookup, and UI state
// ============================================

function selectPreset(presetId) {
  // Toggle off if tapping the same preset
  if (state.activePresetId === presetId) {
    state.activePresetId = 'original';
    state.intensity = 100;
    intensitySlider.value = 100;
    intensityDisplay.textContent = '100';
    updateSliderTrack(100);
    setActivePresetUI(null);
    document.querySelector('.intensity-wrap').style.display = 'none';
    const nameDisplay = document.getElementById('preset-name-display');
    if (nameDisplay) {
      nameDisplay.textContent = '';
      nameDisplay.classList.remove('visible');
    }
    state.gradientDirection = 0;
    updateGradientRotateBtn();
    render();
    return;
  }

  state.gradientDirection = 0;
  state.activePresetId = presetId;
  state.intensity = 100;
  intensitySlider.value = 100;
  intensityDisplay.textContent = '100';
  updateSliderTrack(100);
  setActivePresetUI(presetId);

  // Show strength only if not original and editor closed
  const editorBubble = document.getElementById('editor-bubble');
  const intensityWrap = document.querySelector('.intensity-wrap');
  if (presetId !== 'original' && !editorBubble.classList.contains('open')) {
    intensityWrap.style.display = 'flex';
  } else {
    intensityWrap.style.display = 'none';
  }

  // Show preset name
  const nameDisplay = document.getElementById('preset-name-display');
  const preset = findPreset(presetId);
  if (nameDisplay && preset) {
    nameDisplay.textContent = preset.name.toLowerCase();
    nameDisplay.classList.add('visible');
  }

  updateGradientRotateBtn();
  render();
}

function findPreset(presetId) {
  for (const folder of PRESET_FOLDERS) {
    const found = folder.presets.find(p => p.id === presetId);
    if (found) return found;
  }
  return null;
}

function setActivePresetUI(presetId) {
  document.querySelectorAll('.preset-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === presetId);
  });
}

function updateFolderHeader() {
  // Reserved for future use
}

function updateGradientRotateBtn() {
  const btn = document.getElementById('btn-gradient-rotate');
  if (!btn) return;

  const inGradientsFolder = state.currentFolderId === 'gradients';
  const preset = findPreset(state.activePresetId);
  const gradientActive = !!(preset && preset.gradient);
  const editorOpen = document.getElementById('editor-bubble').classList.contains('open');
  const cropOpen = document.getElementById('crop-bubble').classList.contains('open');

  if (inGradientsFolder && gradientActive && !editorOpen && !cropOpen) {
    const canvasEl = document.getElementById('main-canvas');
    const containerEl = document.querySelector('.canvas-container');
    const canvasRect = canvasEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();
    btn.style.top = (canvasRect.top - containerRect.top + 8) + 'px';
    btn.style.left = (canvasRect.left - containerRect.left + 8) + 'px';
    btn.style.display = 'flex';
  } else {
    btn.style.display = 'none';
  }
}
