import sharp from 'sharp'

export async function analyzeImage(inputPath) {
  const metadata = await sharp(inputPath).metadata()

  const width = metadata.width ?? 0
  const height = metadata.height ?? 0
  const pixels = width * height

  const aspectRatio = height > 0 ? width / height : 0

  return {
    source: {
      format: metadata.format ?? 'unknown',
      width,
      height,
      pixels,
      channels: metadata.channels ?? null,
      hasAlpha: metadata.hasAlpha ?? false,
      space: metadata.space ?? null,
      density: metadata.density ?? null,
    },

    characteristics: {
      resolution:
        pixels < 500_000
          ? 'low'
          : pixels < 2_000_000
            ? 'medium'
            : pixels < 12_000_000
              ? 'high'
              : 'very-high',

      orientation:
        width > height
          ? 'landscape'
          : height > width
            ? 'portrait'
            : 'square',

      aspectRatio,
    },

    analysis: {
      blur: 'unknown',
      noise: 'unknown',
      compression: 'unknown',
      faces: 'pending',
      text: 'pending',
      damage: 'pending',
    },

    integrity: {
      sourcePreserved: true,
      analysedWithoutModification: true,
    },
  }
}
