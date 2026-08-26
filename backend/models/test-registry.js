import { getModel, listModels } from './registry.js'

console.log('Available models:')
console.log(JSON.stringify(listModels(), null, 2))

console.log('\nSwinIR:')
console.log(JSON.stringify(
  getModel('swinir').describe(),
  null,
  2
))
