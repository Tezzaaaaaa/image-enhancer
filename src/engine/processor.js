import { analyzeImage } from './analyzer'
import { selectPipeline } from './router'

export async function processImage(file, mode = 'auto') {
  const analysis = await analyzeImage(file)
  const pipeline = selectPipeline(analysis, mode)

  return {
    analysis,
    pipeline,
    status: 'ready',
    message: 'Image analysed and processing pipeline selected.',
  }
}
