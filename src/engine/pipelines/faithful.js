export const faithfulPipeline = {
  id: 'faithful',
  name: 'Faithful',
  description: 'Prioritises preservation of the source image.',
  stages: [
    'analysis',
    'denoise',
    'deblur',
    'super-resolution',
    'quality-control',
  ],
}
