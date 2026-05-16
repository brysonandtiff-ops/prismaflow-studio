export const exportArtwork = async (
  pageId: string,
  svgElement: SVGSVGElement,
  brushCanvas?: HTMLCanvasElement | null
) => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const viewBox = svgElement.viewBox.baseVal;
    canvas.width = viewBox.width * 5; // Upscale for quality
    canvas.height = viewBox.height * 5;

    // 1. Draw Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw SVG
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);

    // 3. Draw Brush Overlay
    if (brushCanvas) {
      ctx.drawImage(brushCanvas, 0, 0, canvas.width, canvas.height);
    }

    // 4. Download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `prismaflow-${pageId}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    
    return true;
  } catch (error) {
    console.error('Export failed', error);
    return false;
  }
};
