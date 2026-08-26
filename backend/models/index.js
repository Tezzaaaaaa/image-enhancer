export const models = {
  baseline: {
    id: 'baseline',
    name: 'Baseline',
    type: 'deterministic',
    capabilities: [
      'orientation',
      'format-normalisation',
    ],
  },

  swinir: {
    id: 'swinir',
    name: 'SwinIR',
    type: 'transformer',
    capabilities: [
      'super-resolution',
      'denoising',
      'jpeg-artifact-reduction',
      'image-restoration',
    ],
    status: 'candidate',
  },

  realesrgan: {
    id: 'realesrgan',
    name: 'Real-ESRGAN',
    type: 'cnn',
    capabilities: [
      'real-world-super-resolution',
      'degradation-recovery',
    ],
    status: 'candidate',
  },

  hat: {
    id: 'hat',
    name: 'HAT',
    type: 'transformer',
    capabilities: [
      'super-resolution',
      'detail-reconstruction',
    ],
    status: 'candidate',
  },

  drct: {
    id: 'drct',
    name: 'DRCT',
    type: 'transformer',
    capabilities: [
      'super-resolution',
      'detail-reconstruction',
      'artifact-control',
    ],
    status: 'candidate',
  },
}
