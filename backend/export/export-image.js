import sharp from 'sharp'

export async function exportImage(inputPath, outputPath) {
  await sharp(inputPath)
    .png({
      compressionLevel: 6,
      adaptiveFiltering: true,
    })
    .toFile(outputPath)

  return {
    outputPath,
    format: 'png',
    lossless: true,
  }
}
