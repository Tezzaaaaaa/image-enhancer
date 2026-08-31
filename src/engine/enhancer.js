// Pure JS – no dependencies, no network, instant
export function runEnhancement(image, params, onProgress) {
  return new Promise((resolve) => {
    onProgress(0.1);

    const scale = params.scale || 2;
    const w = image.width * scale;
    const h = image.height * scale;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // High‑quality upscaling (bicubic‑like)
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, 0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const output = new Uint8ClampedArray(data);

    onProgress(0.4);

    // 1) Noise reduction (median filter, subtle)
    const denoiseStrength = 0.2;
    if (denoiseStrength > 0) {
      const temp = new Uint8ClampedArray(data);
      for (let y = 2; y < h - 2; y++) {
        for (let x = 2; x < w - 2; x++) {
          const idx = (y * w + x) * 4;
          const r = [], g = [], b = [];
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              const ni = ((y + dy) * w + (x + dx)) * 4;
              r.push(data[ni]);
              g.push(data[ni + 1]);
              b.push(data[ni + 2]);
            }
          }
          r.sort((a, b) => a - b);
          g.sort((a, b) => a - b);
          b.sort((a, b) => a - b);
          const median = (arr) => arr[Math.floor(arr.length / 2)];
          const blend = denoiseStrength;
          output[idx] = output[idx] * (1 - blend) + median(r) * blend;
          output[idx + 1] = output[idx + 1] * (1 - blend) + median(g) * blend;
          output[idx + 2] = output[idx + 2] * (1 - blend) + median(b) * blend;
        }
      }
      // Copy back for next steps
      for (let i = 0; i < output.length; i++) data[i] = output[i];
    }

    onProgress(0.6);

    // 2) Unsharp mask (strong, crisp)
    const sharpenStrength = 0.8;
    const kernel = [
      0, -0.3, 0,
      -0.3, 2.2, -0.3,
      0, -0.3, 0
    ];
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;
        let r = 0, g = 0, b = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const ni = ((y + ky) * w + (x + kx)) * 4;
            const k = kernel[(ky + 1) * 3 + (kx + 1)];
            r += data[ni] * k;
            g += data[ni + 1] * k;
            b += data[ni + 2] * k;
          }
        }
        output[idx] = Math.min(255, Math.max(0, r));
        output[idx + 1] = Math.min(255, Math.max(0, g));
        output[idx + 2] = Math.min(255, Math.max(0, b));
        output[idx + 3] = data[idx + 3];
      }
    }

    onProgress(0.8);

    // 3) Contrast stretch (auto)
    let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
    for (let i = 0; i < output.length; i += 4) {
      if (output[i] < minR) minR = output[i];
      if (output[i] > maxR) maxR = output[i];
      if (output[i + 1] < minG) minG = output[i + 1];
      if (output[i + 1] > maxG) maxG = output[i + 1];
      if (output[i + 2] < minB) minB = output[i + 2];
      if (output[i + 2] > maxB) maxB = output[i + 2];
    }
    const stretch = 0.6;
    for (let i = 0; i < output.length; i += 4) {
      output[i] = Math.min(255, Math.max(0, (output[i] - minR) / (maxR - minR + 1) * 255 * stretch + output[i] * (1 - stretch)));
      output[i + 1] = Math.min(255, Math.max(0, (output[i + 1] - minG) / (maxG - minG + 1) * 255 * stretch + output[i + 1] * (1 - stretch)));
      output[i + 2] = Math.min(255, Math.max(0, (output[i + 2] - minB) / (maxB - minB + 1) * 255 * stretch + output[i + 2] * (1 - stretch)));
    }

    onProgress(0.9);
    ctx.putImageData(new ImageData(output, w, h), 0, 0);
    onProgress(1.0);
    resolve(canvas.toDataURL('image/png'));
  });
}