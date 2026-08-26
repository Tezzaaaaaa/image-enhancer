import sharp from 'sharp'

export async function basicCorrection(inputPath, outputPath) {
  await sharp(inputPath)
    .autoOrient()
    .removeAlpha()
    .png({
      compressionLevel: 6,
      adaptiveFiltering: true,
    })
    .toFile(outputPath)

  return {
    outputPath,
    corrections: [
      'auto-orient',
      'alpha-normalisation',
      'lossless-png-output',
    ],
  }
}
