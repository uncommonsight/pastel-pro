// ============================================
//  NAVIGATION — folder and preset view logic
// ============================================

function buildPresetThumbnails() {
  if (state.currentFolderId) {
    renderPresetsView();
  } else {
    renderFoldersView();
  }
}

function renderFoldersView() {
  presetsTrack.innerHTML = '';
  presetsTrack.classList.remove('presets-view');
  presetsTrack.classList.add('folders-view');
  presetsTrack.dataset.state = 'folders';
  document.getElementById('btn-back-folder').style.display = 'none';
  document.getElementById('edit-icon-wrap').classList.add('visible');

  PRESET_FOLDERS.forEach((folder, index) => {
    const item = document.createElement('div');
    item.className = 'folder-item';
    item.dataset.id = folder.id;
    item.dataset.folderType = folder.id;
    item.dataset.folderIndex = index;

    const visual = document.createElement('div');
    visual.className = 'folder-visual';

    const label = document.createElement('span');
    label.className = 'folder-name';
    label.textContent = folder.name;

    const count = document.createElement('span');
    count.className = 'folder-count';
    count.textContent = folder.presets.length;

    item.appendChild(visual);
    item.appendChild(label);
    item.appendChild(count);
    item.addEventListener('click', () => enterFolder(folder.id, index));

    presetsTrack.appendChild(item);

    const presetsScroll = document.querySelector('.presets-scroll');
    if (presetsScroll) presetsScroll.scrollLeft = 0;
  });
}

function renderPresetsView() {
  presetsTrack.innerHTML = '';
  presetsTrack.classList.remove('folders-view');
  presetsTrack.classList.add('presets-view');
  presetsTrack.dataset.state = 'presets';

  const folder = PRESET_FOLDERS.find(f => f.id === state.currentFolderId);
  if (!folder) return;

  const folderIndicator = document.createElement('div');
  folderIndicator.className = 'folder-indicator';
  folderIndicator.dataset.folderType = folder.id;

  const visual = document.createElement('div');
  visual.className = 'folder-visual folder-visual-small';
  visual.dataset.folderType = folder.id;

  const label = document.createElement('span');
  label.className = 'folder-name';
  label.textContent = folder.name;

  folderIndicator.appendChild(visual);
  folderIndicator.appendChild(label);
  folderIndicator.addEventListener('click', exitFolder);
  presetsTrack.appendChild(folderIndicator);

  const presetsContainer = document.createElement('div');
  presetsContainer.className = 'presets-container';

  const thumbW = 72;
  const thumbH = 72;
  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = thumbW;
  thumbCanvas.height = thumbH;
  const tCtx = thumbCanvas.getContext('2d');

  const src = state.originalImageData;
  const srcSize = Math.min(src.width, src.height);
  const srcX = (src.width - srcSize) / 2;
  const srcY = (src.height - srcSize) / 2;

  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = src.width;
  srcCanvas.height = src.height;
  srcCanvas.getContext('2d').putImageData(src, 0, 0);

  tCtx.drawImage(srcCanvas, srcX, srcY, srcSize, srcSize, 0, 0, thumbW, thumbH);
  const thumbBase = tCtx.getImageData(0, 0, thumbW, thumbH);
  document.getElementById('btn-back-folder').style.display = 'block';

  folder.presets.forEach(preset => {
    const item = document.createElement('div');
    item.className = 'preset-item';
    item.dataset.id = preset.id;

    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = thumbW;
    previewCanvas.height = thumbH;
    previewCanvas.className = 'preset-thumb';

    const pCtx = previewCanvas.getContext('2d');
    const filtered = applyPreset(thumbBase, preset, 100);
    pCtx.putImageData(filtered, 0, 0);

    const labelEl = document.createElement('span');
    labelEl.className = 'preset-name';
    labelEl.textContent = preset.name;

    item.appendChild(previewCanvas);
    item.appendChild(labelEl);
    item.addEventListener('click', () => selectPreset(preset.id));

    presetsContainer.appendChild(item);
  });

  presetsTrack.appendChild(presetsContainer);
  // Reset scroll to start
  presetsTrack.scrollLeft = 0;
  const presetsScroll = document.querySelector('.presets-scroll');
  if (presetsScroll) presetsScroll.scrollLeft = 0;
}

function enterFolder(folderId, folderIndex) {
  if (state.isTransitioning) return;
  state.isTransitioning = true;

  state.currentFolderId = folderId;
  state.activeFolderIndex = folderIndex;

  presetsTrack.classList.add('carousel-transition');
  presetsTrack.dataset.direction = 'enter';

  requestAnimationFrame(() => {
    renderPresetsView();
    updateFolderHeader();
  });

  setTimeout(() => {
    presetsTrack.classList.remove('carousel-transition');
    presetsTrack.dataset.direction = '';
    state.isTransitioning = false;
    updateGradientRotateBtn();
  }, 600);
}

function exitFolder() {
  if (state.isTransitioning) return;
  state.isTransitioning = true;

  presetsTrack.classList.add('carousel-transition');
  presetsTrack.dataset.direction = 'exit';

  requestAnimationFrame(() => {
    state.currentFolderId = null;
    state.activeFolderIndex = null;
    renderFoldersView();
    updateFolderHeader();
  });

  setTimeout(() => {
    presetsTrack.classList.remove('carousel-transition');
    presetsTrack.dataset.direction = '';
    state.isTransitioning = false;
    state.gradientDirection = 0;
    updateGradientRotateBtn();
  }, 500);
}

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
