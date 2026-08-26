export const forensicPipeline = {
  id: 'forensic',
  name: 'Forensic',
  description: 'Prioritises repeatability and source fidelity.',
  stages: [
    'analysis',
    'deterministic-denoise',
    'deterministic-deblur',
    'multi-frame-reconstruction',
    'super-resolution',
    'quality-control',
    'processing-report',
  ],
}
