export async function analyzeImage(file) {
  const bitmap = await createImageBitmap(file)

  const pixels = bitmap.width * bitmap.height
  const aspectRatio = bitmap.width / bitmap.height

  return {
    width: bitmap.width,
    height: bitmap.height,
    pixels,
    aspectRatio,
    megapixels: pixels / 1_000_000,
    type: file.type,
    size: file.size,
    hasAlpha: file.type === 'image/png' || file.type === 'image/webp',
    category: classifyImage(bitmap.width, bitmap.height, aspectRatio),
  }
}

function classifyImage(width, height, aspectRatio) {
  const pixels = width * height

  if (pixels < 500_000) {
    return 'low-resolution'
  }

  if (aspectRatio > 1.8 || aspectRatio < 0.55) {
    return 'wide-or-tall'
  }

  if (width >= 3000 || height >= 3000) {
    return 'high-resolution'
  }

  return 'photograph'
}
