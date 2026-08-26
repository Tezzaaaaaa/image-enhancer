import { routeModels } from './router.js'

const mockAnalysis = {
  characteristics: {
    resolution: 'low',
  },

  analysis: {
    blur: 'high',
    noise: 'high',
    compression: 'high',
    faces: 'pending',
    text: 'pending',
  },
}

const result = routeModels(mockAnalysis, {
  restorationIntensity: 'balanced',
})

console.log(JSON.stringify(result, null, 2))
