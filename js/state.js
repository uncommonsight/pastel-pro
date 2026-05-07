// ============================================
//  STATE — single source of truth
// ============================================

const state = {
  originalImageData: null,
  activePresetId: 'original',
  intensity: 100,
  currentFolderId: null,
  activeFolderIndex: null,
  isTransitioning: false,
  sourceImg: null,
  editor: {
    exposure: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    contrast: 0,
    saturation: 0,
    warmth: 0,
    colorSat: { red: 0, orange: 0, yellow: 0, green: 0, cyan: 0, blue: 0, purple: 0 },
  }
};
