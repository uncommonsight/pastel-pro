// ============================================
//  IMAGE LOAD — file reader, resize, state init
// ============================================

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

      canvas.width = w;
      canvas.height = h;
      document.documentElement.style.setProperty('--canvas-width', w + 'px');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      state.sourceImg = img;
      state.originalSourceImg = img;

      // Clean up any in-progress crop from a previous session
      if (cropBubble.classList.contains('open')) closeCropClean();

      ctx.drawImage(img, 0, 0, w, h);
      state.originalImageData = ctx.getImageData(0, 0, w, h);
      state.activePresetId = 'original';
      state.intensity = 100;
      state.currentFolderId = null;
      state.gradientDirection = 0;

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
