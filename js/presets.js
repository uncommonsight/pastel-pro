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
            { pos: 0.0, r: 255, g: 180, b: 80,  a: 0.30 },
            { pos: 0.5, r: 255, g: 160, b: 60,  a: 0.08 },
            { pos: 1.0, r: 0,   g: 0,   b: 0,   a: 0.0  },
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
            { pos: 0.0, r: 40,  g: 60,  b: 160, a: 0.30 },
            { pos: 0.5, r: 20,  g: 40,  b: 120, a: 0.08 },
            { pos: 1.0, r: 0,   g: 0,   b: 0,   a: 0.0  },
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
            { pos: 0.5, r: 200, g: 80,  b: 120, a: 0.08 },
            { pos: 1.0, r: 0,   g: 0,   b: 0,   a: 0.0  },
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
