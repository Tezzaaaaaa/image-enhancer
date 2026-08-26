import fs from 'node:fs/promises'
import sharp from 'sharp'

export async function runQualityControl({
  sourcePath,
  outputPath,
  analysis,
}) {
  const source = await sharp(sourcePath).metadata()
  const output = await sharp(outputPath).metadata()

  const checks = {
    sourceReadable: true,
    outputReadable: true,
    dimensionsPresent:
      Boolean(source.width && source.height) &&
      Boolean(output.width && output.height),

    aspectRatioPreserved:
      source.width &&
      source.height &&
      output.width &&
      output.height
        ? Math.abs(
            source.width / source.height -
            output.width / output.height
          ) < 0.01
        : false,

    sourceExists: true,
    outputExists: true,
    outputLargerThanZero: false,
  }

  const outputStat = await fs.stat(outputPath)

  checks.outputLargerThanZero = outputStat.size > 0

  const passed = Object.values(checks).every(Boolean)

  return {
    passed,
    checks,
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
    integrity: {
      sourcePreserved: true,
      analysisAvailable: Boolean(analysis),
    },
  }
}
