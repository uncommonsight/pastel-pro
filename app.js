// ============================================
//  PASTEL You — app.js
//  Three-file iPhone PWA build
// ============================================

// --------------------------------------------
//  PRESET FOLDERS
//  Organize presets into folders with drill-down navigation.
//
//  Each preset defines a color matrix + adjustments.
//  Matrix layout (applied per pixel):
//  [ rR, rG, rB, rA, rConst,
//    gR, gG, gB, gA, gConst,
//    bR, bG, bB, bA, bConst,
//    aR, aG, aB, aA, aConst ]
//
//  brightness: multiplier (1.0 = unchanged, 1.1 = +10%)
//  saturation: multiplier (1.0 = unchanged, 0.8 = less saturated)
//  tint: { r, g, b } additive offset per channel (0–30 typical range)
// --------------------------------------------

const PRESET_FOLDERS = [
  {
    id: 'pastels',
    name: 'Pastels',
    presets: [
      {
        id: 'original',
        name: 'Original',
        brightness: 1.0,
        saturation: 1.0,
        tint: { r: 0, g: 0, b: 0 },
        fade: 0,
      },
      {
        id: 'blush',
        name: 'Blush',
        brightness: 1.08,
        saturation: 1.25,
        tint: { r: 28, g: 8, b: 12 },
        fade: 10,
      },
      {
        id: 'dusty-rose',
        name: 'Dusty Rose',
        brightness: 1.02,
        saturation: 1.10,
        tint: { r: 30, g: 10, b: 14 },
        fade: 12,
      },
      {
        id: 'peach',
        name: 'Peach',
        brightness: 1.10,
        saturation: 1.15,
        tint: { r: 30, g: 20, b: 4 },
        fade: 8,
      },
      {
        id: 'mist',
        name: 'Mist',
        brightness: 1.06,
        saturation: 0.95,
        tint: { r: 4, g: 16, b: 24 },
        fade: 10,
      },
      {
        id: 'lavender',
        name: 'Lavender',
        brightness: 1.04,
        saturation: 1.00,
        tint: { r: 17, g: 8, b: 24 },
        fade: 10,
      },
      {
        id: 'sage',
        name: 'Sage',
        brightness: 1.03,
        saturation: 1.05,
        tint: { r: 6, g: 20, b: 10 },
        fade: 10,
      },
      {
        id: 'cream',
        name: 'Cream',
        brightness: 1.12,
        saturation: 0.85,
        tint: { r: 28, g: 20, b: 10 },
        fade: 12,
      },
      {
        id: 'sky',
        name: 'Sky',
        brightness: 1.07,
        saturation: 1.05,
        tint: { r: 4, g: 18, b: 28 },
        fade: 10,
      },
      {
        id: 'apricot',
        name: 'Apricot',
        brightness: 1.06,
        saturation: 1.15,
        tint: { r: 28, g: 16, b: 4 },
        fade: 8,
      },
      {
        id: 'petal',
        name: 'Petal',
        brightness: 1.04,
        saturation: 0.85,
        tint: { r: 24, g: 10, b: 18 },
        fade: 13,
      },
      {
        id: 'cotton-candy',
        name: 'Cotton Candy',
        brightness: 1.08,
        saturation: 1.10,
        tint: { r: 24, g: 10, b: 23 },
        fade: 10,
      }
    ]
  },
  {
    id: 'gradients',
    name: 'Gradients',
    presets: [
      {
        id: 'original',
        name: 'Original',
        brightness: 1.0,
        saturation: 1.0,
        tint: { r: 0, g: 0, b: 0 },
        fade: 0,
      },
      {
        id: 'golden-hour',
        name: 'Golden Hour',
        brightness: 1.05,
        saturation: 1.10,
        tint: { r: 10, g: 6, b: 0 },
        fade: 5,
        gradient: {
          type: 'linear-top',
          stops: [
            { pos: 0.0, r: 255, g: 180, b: 80, a: 0.30 },
            { pos: 0.5, r: 255, g: 160, b: 60, a: 0.08 },
            { pos: 1.0, r: 0, g: 0, b: 0, a: 0.0 },
          ]
        }
      },
      {
        id: 'blue-hour',
        name: 'Blue Hour',
        brightness: 1.02,
        saturation: 0.95,
        tint: { r: 4, g: 8, b: 20 },
        fade: 8,
        gradient: {
          type: 'linear-top',
          stops: [
            { pos: 0.0, r: 40, g: 60, b: 160, a: 0.30 },
            { pos: 0.5, r: 20, g: 40, b: 120, a: 0.08 },
            { pos: 1.0, r: 0, g: 0, b: 0, a: 0.0 },
          ]
        }
      },
      {
        id: 'rose-sky',
        name: 'Rose Sky',
        brightness: 1.04,
        saturation: 1.05,
        tint: { r: 20, g: 8, b: 12 },
        fade: 8,
        gradient: {
          type: 'linear-top',
          stops: [
            { pos: 0.0, r: 220, g: 100, b: 140, a: 0.30 },
            { pos: 0.5, r: 200, g: 80, b: 120, a: 0.08 },
            { pos: 1.0, r: 0, g: 0, b: 0, a: 0.0 },
          ]
        }
      },
    ]
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    presets: [
      {
        id: 'original',
        name: 'Original',
        brightness: 1.0,
        saturation: 1.0,
        tint: { r: 0, g: 0, b: 0 },
        fade: 0,
        contrast: 1.0,
      },
      {
        id: 'classic-bw',
        name: 'Classic',
        brightness: 1.25,
        saturation: 0.0,
        tint: { r: 0, g: 0, b: 0 },
        fade: 0,
        contrast: 1.0,
      },
      {
        id: 'soft-bw',
        name: 'Soft',
        brightness: 1.25,
        saturation: 0.0,
        tint: { r: 4, g: 4, b: 4 },
        fade: 12,
        contrast: 0.90,
      },
      {
        id: 'dramatic-bw',
        name: 'Dramatic',
        brightness: 1.10,
        saturation: 0.0,
        tint: { r: 0, g: 0, b: 0 },
        fade: 0,
        contrast: 1.25,
      },

    ]
  }
];

// --------------------------------------------
//  STATE
// --------------------------------------------

const state = {
  originalImageData: null,   // ImageData — never modified
  activePresetId: 'original',
  intensity: 100,            // 0–100
  currentFolderId: null,     // null = viewing all folders, 'pastels'|'gradients'|'monochrome' = in folder
  activeFolderIndex: null,   // Index of the active folder for carousel positioning
  isTransitioning: false,    // Animation in progress
};

// --------------------------------------------
//  DOM REFS
// --------------------------------------------

const screenHome = document.getElementById('screen-home');
const screenEditor = document.getElementById('screen-editor');
const btnPick = document.getElementById('btn-pick');
const btnBack = document.getElementById('btn-back');
const btnDownload = document.getElementById('btn-download');
const fileInput = document.getElementById('file-input');
const downloadAnchor = document.getElementById('download-anchor');
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
const presetsTrack = document.getElementById('presets-track');
const intensitySlider = document.getElementById('intensity-slider');
const intensityDisplay = document.getElementById('intensity-display');

// --------------------------------------------
//  SCREEN TRANSITIONS
// --------------------------------------------

function showScreen(screenEl) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  screenEl.classList.add('active');
}

// --------------------------------------------
//  FILTER ENGINE
//  Applies a preset to ImageData at a given intensity.
//  Returns a new ImageData — original is never touched.
// --------------------------------------------

function applyPreset(imageData, preset, intensity) {
  const src = imageData.data;
  const out = new ImageData(new Uint8ClampedArray(src), imageData.width, imageData.height);
  const data = out.data;
  const t = intensity / 100;  // 0.0 – 1.0 blend factor

  const { brightness, saturation, tint, fade, contrast = 1.0 } = preset;

  for (let i = 0; i < data.length; i += 4) {
    let r = src[i];
    let g = src[i + 1];
    let b = src[i + 2];

    // --- Brightness ---
    const bAdj = 1 + (brightness - 1) * t;
    r = r * bAdj;
    g = g * bAdj;
    b = b * bAdj;

    // --- Saturation ---
    // Luminance-weighted desaturation
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const sAdj = 1 + (saturation - 1) * t;
    r = lum + (r - lum) * sAdj;
    g = lum + (g - lum) * sAdj;
    b = lum + (b - lum) * sAdj;

    // --- Tint ---
    r = r + tint.r * t;
    g = g + tint.g * t;
    b = b + tint.b * t;

    // --- Fade (lifts shadows toward white — classic film look) ---
    const fadeAmt = fade * t;
    r = r + (255 - r) * (fadeAmt / 255);
    g = g + (255 - g) * (fadeAmt / 255);
    b = b + (255 - b) * (fadeAmt / 255);

    // --- Contrast ---
    const cAdj = 1 + (contrast - 1) * t;
    r = (r - 128) * cAdj + 128;
    g = (g - 128) * cAdj + 128;
    b = (b - 128) * cAdj + 128;

    // Clamp to 0–255
    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
    // alpha unchanged
  }

  return out;
}

// --------------------------------------------
//  RENDER
//  Draws the current state to the main canvas.
// --------------------------------------------

function render() {
  if (!state.originalImageData) return;

  // Find preset in folder structure
  let preset = null;
  for (const folder of PRESET_FOLDERS) {
    preset = folder.presets.find(p => p.id === state.activePresetId);
    if (preset) break;
  }
  if (!preset) preset = PRESET_FOLDERS[0].presets[0];

  const output = applyPreset(state.originalImageData, preset, state.intensity);
  ctx.putImageData(output, 0, 0);

  // Draw gradient overlay if preset has one
  if (preset && preset.gradient) {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    preset.gradient.stops.forEach(stop => {
      grad.addColorStop(stop.pos, `rgba(${stop.r}, ${stop.g}, ${stop.b}, ${stop.a * (state.intensity / 100)})`);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// --------------------------------------------
//  LOAD IMAGE onto canvas + store original
// --------------------------------------------

function loadImage(file) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // Size canvas to image (capped for mobile performance)
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

      ctx.drawImage(img, 0, 0, w, h);
      state.originalImageData = ctx.getImageData(0, 0, w, h);
      state.activePresetId = 'original';
      state.intensity = 100;
      state.currentFolderId = null;  // Start at folder view

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

// --------------------------------------------
//  PRESET THUMBNAILS / FOLDER VIEW
//  Renders either folder list or preset list with animations.
// --------------------------------------------

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
  });
}

function renderPresetsView() {
  presetsTrack.innerHTML = '';
  presetsTrack.classList.remove('folders-view');
  presetsTrack.classList.add('presets-view');
  presetsTrack.dataset.state = 'presets';

  const folder = PRESET_FOLDERS.find(f => f.id === state.currentFolderId);
  if (!folder) return;

  // Create folder indicator on the left with full visual
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

  // Create presets container
  const presetsContainer = document.createElement('div');
  presetsContainer.className = 'presets-container';

  // Downscale original to thumbnail size for performance
  const thumbW = 72;
  const thumbH = 72;
  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = thumbW;
  thumbCanvas.height = thumbH;
  const tCtx = thumbCanvas.getContext('2d');

  // Draw a square crop of the original
  const src = state.originalImageData;
  const srcSize = Math.min(src.width, src.height);
  const srcX = (src.width - srcSize) / 2;
  const srcY = (src.height - srcSize) / 2;

  // Temp canvas to hold original at full size for drawImage
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = src.width;
  srcCanvas.height = src.height;
  srcCanvas.getContext('2d').putImageData(src, 0, 0);

  tCtx.drawImage(srcCanvas, srcX, srcY, srcSize, srcSize, 0, 0, thumbW, thumbH);
  const thumbBase = tCtx.getImageData(0, 0, thumbW, thumbH);

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
}

// --------------------------------------------
//  FOLDER NAVIGATION
// --------------------------------------------

function enterFolder(folderId, folderIndex) {
  if (state.isTransitioning) return;
  state.isTransitioning = true;

  state.currentFolderId = folderId;
  state.activeFolderIndex = folderIndex;

  // Add transition class before changing view
  presetsTrack.classList.add('carousel-transition');
  presetsTrack.dataset.direction = 'enter';

  // Render on next frame so CSS animation can detect the state change
  requestAnimationFrame(() => {
    renderPresetsView();
    updateFolderHeader();
  });

  setTimeout(() => {
    presetsTrack.classList.remove('carousel-transition');
    presetsTrack.dataset.direction = '';
    state.isTransitioning = false;
  }, 600);
}

function exitFolder() {
  if (state.isTransitioning) return;
  state.isTransitioning = true;

  // Add transition class before changing view
  presetsTrack.classList.add('carousel-transition');
  presetsTrack.dataset.direction = 'exit';

  // Render on next frame so CSS animation can detect the state change
  requestAnimationFrame(() => {
    state.currentFolderId = null;
    state.activeFolderIndex = null;
    state.activePresetId = 'original';  // ← reset preset
    render();                            // ← redraw image to original
    renderFoldersView();
    updateFolderHeader();
  });

  setTimeout(() => {
    presetsTrack.classList.remove('carousel-transition');
    presetsTrack.dataset.direction = '';
    state.isTransitioning = false;
  }, 500);
}

// --------------------------------------------
//  SELECT PRESET
// --------------------------------------------

function selectPreset(presetId) {
  state.activePresetId = presetId;
  state.intensity = 100;
  intensitySlider.value = 100;
  intensityDisplay.textContent = '100';
  updateSliderTrack(100);
  setActivePresetUI(presetId);
  render();
}

function setActivePresetUI(presetId) {
  document.querySelectorAll('.preset-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === presetId);
  });
}

// Folder header no longer needed - using left-side folder indicator instead
function updateFolderHeader() {
  // Removed - folder indicator now built into presets view
}

// --------------------------------------------
//  SLIDER TRACK — updates the CSS fill
// --------------------------------------------

function updateSliderTrack(value) {
  intensitySlider.style.setProperty('--val', value + '%');
}

// --------------------------------------------
//  DOWNLOAD
// --------------------------------------------

function downloadImage() {
  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  downloadAnchor.href = dataUrl;
  downloadAnchor.download = 'pastelpro-edit.jpg';
  downloadAnchor.click();
}

// --------------------------------------------
//  EVENTS
// --------------------------------------------

btnPick.addEventListener('click', () => {
  fileInput.value = '';
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) loadImage(file);
});

btnBack.addEventListener('click', () => {
  state.originalImageData = null;
  state.currentFolderId = null;
  presetsTrack.innerHTML = '';
  canvas.width = 0;
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

// --------------------------------------------
//  INIT
// --------------------------------------------

showScreen(screenHome);
