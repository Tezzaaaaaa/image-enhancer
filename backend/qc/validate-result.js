import sharp from 'sharp'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import fs from 'node:fs/promises'

async function getMetadata(path) {
  return sharp(path).metadata()
}

async function getPng(path) {
  const buffer = await sharp(path)
    .png()
    .toBuffer()

  return PNG.sync.read(buffer)
}

export async function validateResult(sourcePath, outputPath) {
  const source = await getMetadata(sourcePath)
  const output = await getMetadata(outputPath)

  const checks = {
    sourceReadable: true,
    outputReadable: true,
    dimensionsPresent:
      Boolean(source.width && source.height) &&
      Boolean(output.width && output.height),
    aspectRatioPreserved: false,
    outputLargerThanZero: false,
  }

  const sourceRatio = source.width / source.height
  const outputRatio = output.width / output.height

  checks.aspectRatioPreserved =
    Math.abs(sourceRatio - outputRatio) < 0.001

  checks.outputLargerThanZero =
    output.width > 0 && output.height > 0

  let similarity = null

  if (
    source.width === output.width &&
    source.height === output.height
  ) {
    const sourcePng = await getPng(sourcePath)
    const outputPng = await getPng(outputPath)

    const diff = new PNG({
      width: source.width,
      height: source.height,
    })

    const differentPixels = pixelmatch(
      sourcePng.data,
      outputPng.data,
      diff.data,
      source.width,
      source.height,
      {
        threshold: 0.1,
      }
    )

    const totalPixels = source.width * source.height

    similarity =
      1 - differentPixels / totalPixels

    await fs.writeFile(
      `${outputPath}.diff.png`,
      PNG.sync.write(diff)
    )
  }

  const passed =
    Object.values(checks).every(Boolean)

  return {
    passed,
    checks,
    similarity,
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
