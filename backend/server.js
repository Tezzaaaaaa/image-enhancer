import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { processImage } from './jobs/process-image.js'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const JOB_ROOT = path.join(ROOT, '.runtime', 'jobs')
const PORT = Number(process.env.PORT || 8787)
const MAX_UPLOAD = 25 * 1024 * 1024
const API_ORIGIN = `http://127.0.0.1:${PORT}`

const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

async function readBody(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > MAX_UPLOAD) throw new Error('Image is larger than the 25 MB upload limit.')
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

function headers(contentType = 'application/json; charset=utf-8') {
  return {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function sendJson(response, status, payload) {
  response.writeHead(status, headers())
  response.end(JSON.stringify(payload))
}

async function handleEnhance(request, response) {
  const contentType = request.headers['content-type']?.split(';')[0]
  const extension = MIME_TO_EXT[contentType]
  if (!extension) {
    sendJson(response, 415, { error: 'Supported formats are JPEG, PNG and WebP.' })
    return
  }

  const input = await readBody(request)
  if (!input.length) {
    sendJson(response, 400, { error: 'No image data was received.' })
    return
  }

  const id = crypto.randomUUID()
  const jobDir = path.join(JOB_ROOT, id)
  const inputPath = path.join(jobDir, `input${extension}`)
  const outputPath = path.join(jobDir, 'enhanced.png')
  await fs.mkdir(jobDir, { recursive: true })
  await fs.writeFile(inputPath, input)

  const report = await processImage({
    inputPath,
    outputPath,
    restorationIntensity: 'balanced',
    sourceFidelity: 'balanced',
  })

  sendJson(response, 200, {
    jobId: id,
    status: report.status,
    report,
    outputUrl: `${API_ORIGIN}/api/output/${id}`,
  })
}

async function handleOutput(id, response) {
  const outputPath = path.join(JOB_ROOT, id, 'enhanced.png')
  try {
    const data = await fs.readFile(outputPath)
    response.writeHead(200, {
      ...headers('image/png'),
      'Content-Length': data.length,
    })
    response.end(data)
  } catch {
    sendJson(response, 404, { error: 'Enhanced image not found.' })
  }
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === 'OPTIONS') {
      response.writeHead(204, headers())
      response.end()
      return
    }

    const url = new URL(request.url, API_ORIGIN)
    if (request.method === 'GET' && url.pathname === '/api/health') {
      sendJson(response, 200, { status: 'ok', service: 'image-enhancer-engine' })
      return
    }
    if (request.method === 'POST' && url.pathname === '/api/enhance') {
      await handleEnhance(request, response)
      return
    }
    if (request.method === 'GET' && url.pathname.startsWith('/api/output/')) {
      await handleOutput(url.pathname.split('/').pop(), response)
      return
    }
    sendJson(response, 404, { error: 'Not found.' })
  } catch (error) {
    sendJson(response, 500, { error: error instanceof Error ? error.message : 'Unexpected server error.' })
  }
})

await fs.mkdir(JOB_ROOT, { recursive: true })
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Image Enhancer API listening on ${API_ORIGIN}`)
})
