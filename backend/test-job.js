import { processImage } from './jobs/process-image.js'

const inputPath = process.argv[2]
const outputPath = process.argv[3]

if (!inputPath || !outputPath) {
  console.error(
    'Usage: node backend/test-job.js /path/to/input.jpg /path/to/output.png'
  )
  process.exit(1)
}

try {
  const result = await processImage({
    inputPath,
    outputPath,
    restorationIntensity: 'balanced',
    sourceFidelity: 'balanced',
  })

  console.log(JSON.stringify(result, null, 2))
} catch (error) {
  console.error('Job failed:', error.message)
  process.exit(1)
}
