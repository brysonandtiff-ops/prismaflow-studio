export interface ExportOptions {
  quality?: 'standard' | 'high';
  transparent?: boolean;
  includeTitle?: boolean;
  includePalette?: boolean;
}

export const exportArtwork = async (
  pageId: string,
  svgElement: SVGSVGElement,
  brushCanvas?: HTMLCanvasElement | null,
  options: ExportOptions = {}
) => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = options.quality === 'high' ? 8 : 4;
    const viewBox = svgElement.viewBox.baseVal;
    canvas.width = viewBox.width * scale;
    canvas.height = viewBox.height * scale;

    // 1. Background
    if (options.transparent) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

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

    // 4. Optional title
    if (options.includeTitle) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(24 * scale / 4)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(pageId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), canvas.width / 2, canvas.height - 20);
    }

    // 5. Download
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
