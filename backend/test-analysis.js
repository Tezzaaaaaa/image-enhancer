import { analyzeImage } from './analysis/analyze.js'

const imagePath = process.argv[2]

if (!imagePath) {
  console.error('Usage: npm run test-analysis -- /path/to/image.jpg')
  process.exit(1)
}

try {
  const result = await analyzeImage(imagePath)
  console.log(JSON.stringify(result, null, 2))
} catch (error) {
  console.error('Analysis failed:', error.message)
  process.exit(1)
}
