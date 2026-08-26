import { getModel } from '../models/registry.js'

export async function runModel({
  inputPath,
  outputPath,
  modelId,
  analysis,
}) {
  const model = getModel(modelId)

  if (!model) {
    throw new Error(`Unknown model: ${modelId}`)
  }

  /*
   * Model inference interface.
   *
   * The registered AI models are currently candidates.
   * Until their actual inference runtimes are installed,
   * the engine must not pretend that AI inference occurred.
   *
   * For now, preserve the image through the inference boundary.
   */
  return {
    model: model.describe(),
    inputPath,
    outputPath,
    analysis,
    inference: {
      executed: false,
      reason: 'model-runtime-not-installed',
    },
  }
}
