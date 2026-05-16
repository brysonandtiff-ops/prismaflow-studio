export interface RasterConvertOptions {
  lineStrength: number;
  contrast: number;
  brightness: number;
  simplification: number;
  invert: boolean;
}

export const DEFAULT_CONVERT_OPTIONS: RasterConvertOptions = {
  lineStrength: 50,
  contrast: 50,
  brightness: 50,
  simplification: 30,
  invert: false,
};

export async function convertImageToLineArt(
  imageFile: File,
  options: RasterConvertOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageFile);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Target output size
      const MAX_SIZE = 800;
      let w = img.width;
      let h = img.height;
      const ratio = Math.min(MAX_SIZE / w, MAX_SIZE / h, 1);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Draw original image
      ctx.drawImage(img, 0, 0, w, h);

      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      // 1. Grayscale
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }

      // 2. Apply brightness
      const brightness = (options.brightness - 50) * 5;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] + brightness));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightness));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightness));
      }

      // 3. Apply contrast
      const contrast = (options.contrast - 50) * 4;
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
        data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
        data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
      }

      // 4. Edge detection + threshold for line art
      const threshold = 255 - Math.round(options.lineStrength * 2.5);
      const edgeData = new Uint8ClampedArray(data.length);

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = (y * w + x) * 4;
          const left = data[idx - 4];
          const right = data[idx + 4];
          const up = data[idx - w * 4];
          const down = data[idx + w * 4];

          const dx = Math.abs(right - left);
          const dy = Math.abs(down - up);
          const edge = Math.min(255, (dx + dy) * 2);

          const gray = edge > threshold ? 0 : 255;
          edgeData[idx] = gray;
          edgeData[idx + 1] = gray;
          edgeData[idx + 2] = gray;
          edgeData[idx + 3] = 255;
        }
      }

      // 5. Invert if requested
      if (options.invert) {
        for (let i = 0; i < edgeData.length; i += 4) {
          edgeData[i] = 255 - edgeData[i];
          edgeData[i + 1] = 255 - edgeData[i + 1];
          edgeData[i + 2] = 255 - edgeData[i + 2];
        }
      }

      // 6. Simplification: blur slightly if simplification is high
      const blur = (options.simplification - 50) / 50;
      if (blur > 0) {
        const blurred = new Uint8ClampedArray(edgeData.length);
        const radius = Math.max(1, Math.round(blur * 2));
        for (let y = radius; y < h - radius; y++) {
          for (let x = radius; x < w - radius; x++) {
            let sum = 0;
            let count = 0;
            for (let dy = -radius; dy <= radius; dy++) {
              for (let dx = -radius; dx <= radius; dx++) {
                const ny = y + dy;
                const nx = x + dx;
                const nIdx = (ny * w + nx) * 4;
                sum += edgeData[nIdx];
                count++;
              }
            }
            const idx = (y * w + x) * 4;
            const avg = Math.round(sum / count);
            const val = avg > 180 ? 255 : 0;
            blurred[idx] = val;
            blurred[idx + 1] = val;
            blurred[idx + 2] = val;
            blurred[idx + 3] = 255;
          }
        }
        ctx.putImageData(new ImageData(blurred, w, h), 0, 0);
      } else {
        ctx.putImageData(new ImageData(edgeData, w, h), 0, 0);
      }

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}