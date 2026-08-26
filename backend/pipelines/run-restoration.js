import { diagnoseImage } from '../analysis/diagnostics.js'
import { correctImage } from '../correction/correct-image.js'
import { validateResult } from '../qc/validate-result.js'

export async function runRestoration(inputPath, outputPath) {
  const startedAt = Date.now()

  const analysis = await diagnoseImage(inputPath)

  const correction = await correctImage(
    inputPath,
    outputPath,
    analysis.diagnostics
  )

  const validation = await validateResult(
    inputPath,
    outputPath
  )

  const processingTimeMs = Date.now() - startedAt

  return {
    architecture: 'restoration-v1',

    source: {
      path: inputPath,
      preserved: true,
    },

    analysis,

    correction,

    validation,

    processing: {
      processingTimeMs,
    },

    status: validation.passed
      ? 'passed'
      : 'failed',
  }
}
