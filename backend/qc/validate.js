import sharp from 'sharp'

export async function validateImage(inputPath, outputPath) {
  const source = await sharp(inputPath).metadata()
  const output = await sharp(outputPath).metadata()

  const sameAspectRatio =
    Math.abs(
      source.width / source.height -
      output.width / output.height
    ) < 0.001

  return {
    passed: sameAspectRatio,
    checks: {
      sourceReadable: true,
      outputReadable: true,
      dimensionsPresent: Boolean(output.width && output.height),
      aspectRatioPreserved: sameAspectRatio,
    },
    source: {
      width: source.width,
      height: source.height,
      format: source.format,
    },
    output: {
      width: output.width,
      height: output.height,
      format: output.format,
    },
  }
}
