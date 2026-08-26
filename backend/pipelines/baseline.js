import { analyzeImage } from '../analysis/analyze.js'
import { basicCorrection } from '../correction/basic.js'
import { validateImage } from '../qc/validate.js'

export async function runBaseline(inputPath, outputPath) {
  const analysis = await analyzeImage(inputPath)

  const correction = await basicCorrection(
    inputPath,
    outputPath
  )

  const validation = await validateImage(
    inputPath,
    outputPath
  )

  return {
    architecture: 'baseline',
    analysis,
    correction,
    validation,
    status: validation.passed ? 'passed' : 'failed',
  }
}
