export const restorationPipeline = {
  id: 'restore',
  name: 'Restore',
  description: 'Prioritises maximum visual restoration.',
  stages: [
    'analysis',
    'damage-reduction',
    'denoise',
    'face-restoration',
    'generative-restoration',
    'super-resolution',
    'quality-control',
  ],
}
