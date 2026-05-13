// ============================================
//  COMPARE — hold canvas to preview original
// ============================================

// Compare to Original - hold to preview, release to restore
let compareTimeout = null;

canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  compareTimeout = setTimeout(() => {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(state.sourceImg, 0, 0, canvas.width, canvas.height);
  }, 100);
});

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('pointerup', () => {
  clearTimeout(compareTimeout);
  if (compareTimeout !== null) {
    render();
    compareTimeout = null;
  }
});
