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

function showScreen(screenEl) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  screenEl.classList.add('active');
}

function updateSliderTrack(value) {
  intensitySlider.style.setProperty('--val', value + '%');
}

// ============================================
//  EVENTS
// ============================================

btnPick.addEventListener('click', () => {
  fileInput.value = '';
  fileInput.removeAttribute('capture');
  fileInput.click();
});

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
