import sharp from 'sharp'
import { analyzeQuality } from './analyze-quality.js'

export async function diagnoseImage(imagePath) {
  const image = sharp(imagePath, { failOn: 'none' })

  const metadata = await image.metadata()
  const quality = await analyzeQuality(imagePath)

  const width = metadata.width ?? 0
  const height = metadata.height ?? 0
  const pixels = width * height

  const resolution =
    pixels < 500000
      ? 'low'
      : pixels < 2000000
        ? 'medium'
        : 'high'

  const brightness = quality.statistics.meanLuma
  const contrastValue = Math.sqrt(quality.statistics.variance)

  const exposure =
    brightness < 55
      ? 'underexposed'
      : brightness > 200
        ? 'overexposed'
        : 'normal'

  const contrast =
    contrastValue < 35
      ? 'low'
      : contrastValue > 75
        ? 'high'
        : 'normal'

  const compression =
    metadata.format === 'jpeg'
      ? 'possible'
      : 'unlikely'

  return {
    source: {
      width,
      height,
      pixels,
      format: metadata.format ?? 'unknown',
      space: metadata.space ?? 'unknown',
      channels: metadata.channels ?? 0,
      hasAlpha: Boolean(metadata.hasAlpha),
    },

    diagnostics: {
      resolution,
      exposure,
      contrast,
      brightness,
      contrastValue: Number(contrastValue.toFixed(2)),
      blur: quality.indicators.blur,
      noise: quality.indicators.noise,
      compression,
      faces: 'pending',
      text: 'pending',
      damage: 'pending',
    },

    recommendations: {
      denoise: quality.indicators.noise !== 'low',
      deblur: quality.indicators.blur !== 'low',
      jpegArtifactReduction: compression === 'possible',
      superResolution: resolution === 'low',
      colourCorrection: exposure !== 'normal',
      faceRestoration: false,
      textProtection: false,
    },
  }
}
