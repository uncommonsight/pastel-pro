// ============================================
//  UI — DOM refs, events, image loading
// ============================================

const screenHome   = document.getElementById('screen-home');
const screenEditor = document.getElementById('screen-editor');
const btnPick      = document.getElementById('btn-pick');
const btnBack      = document.getElementById('btn-back');
const btnDownload  = document.getElementById('btn-download');
const fileInput    = document.getElementById('file-input');
const downloadAnchor = document.getElementById('download-anchor');
const canvas       = document.getElementById('main-canvas');
const ctx          = canvas.getContext('2d');
const presetsTrack = document.getElementById('presets-track');
const intensitySlider  = document.getElementById('intensity-slider');
const intensityDisplay = document.getElementById('intensity-display');

function showScreen(screenEl) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  screenEl.classList.add('active');
}

function updateSliderTrack(value) {
  intensitySlider.style.setProperty('--val', value + '%');
}

function downloadImage() {
  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  downloadAnchor.href = dataUrl;
  downloadAnchor.download = 'pastelyou-edit.jpg';
  downloadAnchor.click();
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

      canvas.width  = w;
      canvas.height = h;
      document.documentElement.style.setProperty('--canvas-width', w + 'px');

      ctx.drawImage(img, 0, 0, w, h);
      state.originalImageData = ctx.getImageData(0, 0, w, h);
      state.activePresetId    = 'original';
      state.intensity         = 100;
      state.currentFolderId   = null;

      intensitySlider.value        = 100;
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

// Events
btnPick.addEventListener('click', () => {
  fileInput.value = '';
  fileInput.removeAttribute('capture'); // for mobile, to allow picking from gallery instead of camera
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) loadImage(file);
});

btnBack.addEventListener('click', () => {
  state.originalImageData = null;
  state.currentFolderId   = null;
  presetsTrack.innerHTML  = '';
  canvas.width  = 0;
  canvas.height = 0;
  showScreen(screenHome);
});

btnDownload.addEventListener('click', downloadImage);

intensitySlider.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  state.intensity = val;
  intensityDisplay.textContent = val;
  updateSliderTrack(val);
  render();
});
