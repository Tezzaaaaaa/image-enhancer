import { listModels } from './registry.js'

const capabilityPriority = [
  'face-restoration',
  'text-restoration',
  'denoising',
  'deblurring',
  'jpeg-artifact-reduction',
  'super-resolution',
  'detail-reconstruction',
]

function availableModelsFor(capability) {
  return listModels().filter((model) =>
    model.capabilities.includes(capability)
  )
}

export function routeModels(analysis, options = {}) {
  const requestedCapabilities = []

  if (analysis?.analysis?.faces === 'detected') {
    requestedCapabilities.push('face-restoration')
  }

  if (analysis?.analysis?.text === 'detected') {
    requestedCapabilities.push('text-restoration')
  }

  if (analysis?.analysis?.noise === 'high') {
    requestedCapabilities.push('denoising')
  }

  if (analysis?.analysis?.blur === 'high') {
    requestedCapabilities.push('deblurring')
  }

  if (analysis?.analysis?.compression === 'high') {
    requestedCapabilities.push('jpeg-artifact-reduction')
  }

  if (
    analysis?.characteristics?.resolution === 'low' ||
    options.restorationIntensity === 'maximum'
  ) {
    requestedCapabilities.push('super-resolution')
  }

  requestedCapabilities.push('detail-reconstruction')

  const uniqueCapabilities = [
    ...new Set(requestedCapabilities),
  ]

  const routes = uniqueCapabilities.map((capability) => ({
    capability,
    candidates: availableModelsFor(capability),
  }))

  return {
    capabilities: uniqueCapabilities,
    routes,
    priority: capabilityPriority.filter((capability) =>
      uniqueCapabilities.includes(capability)
    ),
  }
}
