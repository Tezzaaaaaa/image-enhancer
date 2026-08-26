import sharp from 'sharp'

export async function correctImage(inputPath, outputPath, diagnostics) {
  const image = sharp(inputPath)

  const stages = []

  // Conservative exposure correction.
  if (diagnostics.exposure === 'overexposed') {
    image.modulate({
      brightness: 0.88,
      saturation: 0.98,
    })

    stages.push('exposure-reduction')
  } else if (diagnostics.exposure === 'underexposed') {
    image.modulate({
      brightness: 1.12,
    })

    stages.push('exposure-lift')
  }

  // Conservative denoise.
  if (diagnostics.blur !== 'low' || diagnostics.noise !== 'low') {
    image.median(3)
    stages.push('conservative-denoise')
  }

  // Mild sharpening only after denoising.
  if (diagnostics.blur !== 'low') {
    image.sharpen({
      sigma: 1.1,
      m1: 0.8,
      m2: 0.3,
    })

    stages.push('detail-recovery')
  }

  // Preserve original dimensions at this stage.
  await image
    .rotate()
    .png({
      compressionLevel: 6,
      adaptiveFiltering: true,
    })
    .toFile(outputPath)

  stages.push('lossless-output')

  return {
    outputPath,
    stages,
  }
}
