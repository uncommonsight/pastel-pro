// ============================================
//  PRESET FOLDERS — all preset data lives here
// ============================================

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
        saturation: 1.35,
        tint: { r: 30, g: 8, b: 14 },
        fade: 7,
      },
      {
        id: 'petal',
        name: 'Petal',
        brightness: 1.05,
        saturation: 1.00,
        tint: { r: 26, g: 10, b: 20 },
        fade: 8,
      },
      {
        id: 'lavender',
        name: 'Lavender',
        brightness: 1.04,
        saturation: 1.10,
        tint: { r: 18, g: 8, b: 26 },
        fade: 7,
      },
      {
        id: 'cotton-candy',
        name: 'Cotton Candy',
        brightness: 1.08,
        saturation: 1.20,
        tint: { r: 26, g: 10, b: 26 },
        fade: 7,
      },
      {
        id: 'mist',
        name: 'Mist',
        brightness: 1.06,
        saturation: 1.00,
        tint: { r: 4, g: 16, b: 26 },
        fade: 7,
      },
      {
        id: 'sky',
        name: 'Sky',
        brightness: 1.07,
        saturation: 1.15,
        tint: { r: 4, g: 18, b: 30 },
        fade: 7,
      },
      {
        id: 'cream',
        name: 'Cream',
        brightness: 1.10,
        saturation: 0.90,
        tint: { r: 30, g: 22, b: 10 },
        fade: 8,
      },
    ]
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
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
        id: 'rose',
        name: 'Rose',
        brightness: 1.02,
        saturation: 1.40,
        tint: { r: 35, g: 8, b: 14 },
        fade: 3,
        contrast: 1.15,
      },
      {
        id: 'coral',
        name: 'Coral',
        brightness: 1.05,
        saturation: 1.45,
        tint: { r: 38, g: 18, b: 8 },
        fade: 2,
        contrast: 1.20,
      },
      {
        id: 'tangerine',
        name: 'Tangerine',
        brightness: 1.06,
        saturation: 1.50,
        tint: { r: 40, g: 22, b: 0 },
        fade: 2,
        contrast: 1.20,
      },
      {
        id: 'violet',
        name: 'Violet',
        brightness: 1.03,
        saturation: 1.40,
        tint: { r: 22, g: 6, b: 32 },
        fade: 2,
        contrast: 1.15,
      },
      {
        id: 'electric-sky',
        name: 'Electric Sky',
        brightness: 1.08,
        saturation: 1.50,
        tint: { r: 2, g: 24, b: 40 },
        fade: 2,
        contrast: 1.15,
      },
      {
        id: 'jade',
        name: 'Jade',
        brightness: 1.03,
        saturation: 1.40,
        tint: { r: 4, g: 28, b: 14 },
        fade: 2,
        contrast: 1.15,
      },
      {
        id: 'fuchsia',
        name: 'Fuchsia',
        brightness: 1.04,
        saturation: 1.50,
        tint: { r: 38, g: 6, b: 28 },
        fade: 2,
        contrast: 1.20,
      },
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
        brightness: 1.08,
        saturation: 1.20,
        tint: { r: 14, g: 8, b: 0 },
        fade: 4,
        gradient: {
          type: 'linear-top',
          stops: [
            { pos: 0.0, r: 255, g: 175, b: 60, a: 0.50 },
            { pos: 0.5, r: 255, g: 155, b: 40, a: 0.15 },
            { pos: 1.0, r: 0, g: 0, b: 0, a: 0.0 },
          ]
        }
      },
      {
        id: 'blue-hour',
        name: 'Blue Hour',
        brightness: 1.03,
        saturation: 1.05,
        tint: { r: 4, g: 10, b: 28 },
        fade: 5,
        gradient: {
          type: 'linear-top',
          stops: [
            { pos: 0.0, r: 30, g: 50, b: 180, a: 0.50 },
            { pos: 0.5, r: 15, g: 35, b: 140, a: 0.15 },
            { pos: 1.0, r: 0, g: 0, b: 0, a: 0.0 },
          ]
        }
      },
      {
        id: 'rose-sky',
        name: 'Rose Sky',
        brightness: 1.06,
        saturation: 1.15,
        tint: { r: 24, g: 8, b: 14 },
        fade: 5,
        gradient: {
          type: 'linear-top',
          stops: [
            { pos: 0.0, r: 230, g: 90, b: 140, a: 0.50 },
            { pos: 0.5, r: 210, g: 70, b: 120, a: 0.15 },
            { pos: 1.0, r: 0, g: 0, b: 0, a: 0.0 },
          ]
        }
      },
    ]
  },
  {
    id: 'glow',
    name: 'Glow',
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
        id: 'neon-nights',
        name: 'Neon',
        brightness: 1.08,
        saturation: 1.60,
        tint: { r: 20, g: 0, b: 35 },
        fade: 0,
        contrast: 1.35,
      },
      {
        id: 'electric',
        name: 'Electric',
        brightness: 0.98,
        saturation: 1.60,
        tint: { r: 0, g: 6, b: 45 },
        fade: 0,
        contrast: 1.50,
      },
      {
        id: 'ember',
        name: 'Ember',
        brightness: 1.05,
        saturation: 1.45,
        tint: { r: 40, g: 10, b: 0 },
        fade: 0,
        contrast: 1.30,
      },
      {
        id: 'midnight',
        name: 'Midnight',
        brightness: 0.90,
        saturation: 1.20,
        tint: { r: 6, g: 8, b: 30 },
        fade: 0,
        contrast: 1.45,
      },
      {
        id: 'haze',
        name: 'Haze',
        brightness: 1.04,
        saturation: 1.30,
        tint: { r: 24, g: 0, b: 28 },
        fade: 4,
        contrast: 1.25,
      },
    ]
  },
  {
    id: 'noir',
    name: 'Noir',
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
