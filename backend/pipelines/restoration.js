import { runRestoration as executeRestoration } from './run-restoration.js'

export async function runRestoration(
  inputPath,
  outputPath,
  options = {}
) {
  return await executeRestoration(
    inputPath,
    outputPath,
    options
  )
}
