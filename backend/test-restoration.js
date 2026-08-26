import { runRestoration } from './pipelines/run-restoration.js'

const inputPath = process.argv[2]
const outputPath = process.argv[3]

if (!inputPath || !outputPath) {
  console.error(
    'Usage: node backend/test-restoration.js /path/to/input.jpg /path/to/output.png'
  )
  process.exit(1)
}

try {
  const result = await runRestoration(
    inputPath,
    outputPath
  )

  console.log(
    JSON.stringify(result, null, 2)
  )
} catch (error) {
  console.error(
    'Restoration failed:',
    error.message
  )

  process.exit(1)
}
