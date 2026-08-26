import sharp from 'sharp'

export async function analyzeQuality(imagePath) {
  const image = sharp(imagePath, { failOn: 'none' })

  const { data, info } = await image
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })

  let sum = 0
  let sumSquared = 0

  for (const value of data) {
    sum += value
    sumSquared += value * value
  }

  const count = data.length
  const mean = sum / count
  const variance = Math.max(0, sumSquared / count - mean * mean)

  let edgeEnergy = 0
  let edgeSamples = 0

  for (let y = 1; y < info.height; y++) {
    for (let x = 1; x < info.width; x++) {
      const current = data[y * info.width + x]
      const previousX = data[y * info.width + x - 1]
      const previousY = data[(y - 1) * info.width + x]

      edgeEnergy += Math.abs(current - previousX)
      edgeEnergy += Math.abs(current - previousY)
      edgeSamples += 2
    }
  }

  const edgeMean = edgeEnergy / Math.max(edgeSamples, 1)

  return {
    statistics: {
      meanLuma: Number(mean.toFixed(2)),
      variance: Number(variance.toFixed(2)),
      edgeEnergy: Number(edgeMean.toFixed(2)),
    },

    indicators: {
      blur:
        edgeMean < 8
          ? 'high'
          : edgeMean < 16
            ? 'medium'
            : 'low',

      noise:
        variance > 2500
          ? 'high'
          : variance > 1200
            ? 'medium'
            : 'low',
    },
  }
}
