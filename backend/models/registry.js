import { ModelAdapter } from './adapter.js'

const definitions = {
  baseline: {
    id: 'baseline',
    name: 'Baseline',
    version: '1.0.0',
    capabilities: [
      'orientation',
      'format-normalisation',
    ],
  },

  swinir: {
    id: 'swinir',
    name: 'SwinIR',
    version: 'candidate',
    capabilities: [
      'super-resolution',
      'denoising',
      'jpeg-artifact-reduction',
      'image-restoration',
    ],
  },

  realesrgan: {
    id: 'realesrgan',
    name: 'Real-ESRGAN',
    version: 'candidate',
    capabilities: [
      'real-world-super-resolution',
      'degradation-recovery',
    ],
  },

  hat: {
    id: 'hat',
    name: 'HAT',
    version: 'candidate',
    capabilities: [
      'super-resolution',
      'detail-reconstruction',
    ],
  },

  drct: {
    id: 'drct',
    name: 'DRCT',
    version: 'candidate',
    capabilities: [
      'super-resolution',
      'detail-reconstruction',
      'artifact-control',
    ],
  },
}

export function getModel(id) {
  const definition = definitions[id]

  if (!definition) {
    throw new Error(`Unknown model: ${id}`)
  }

  return new ModelAdapter(definition)
}

export function listModels() {
  return Object.values(definitions).map(
    (definition) => new ModelAdapter(definition).describe()
  )
}
