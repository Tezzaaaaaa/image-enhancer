import { runBaseline } from './pipelines/baseline.js'

const inputPath = process.argv[2]
const outputPath = process.argv[3]

if (!inputPath || !outputPath) {
  console.error(
    'Usage: node backend/test-pipeline.js input.jpg output.png'
  )
  process.exit(1)
}

try {
  const result = await runBaseline(
    inputPath,
    outputPath
  )

  console.log(JSON.stringify(result, null, 2))
} catch (error) {
  console.error('Pipeline failed:', error.message)
  process.exit(1)
}
