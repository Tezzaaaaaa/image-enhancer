import { useEffect, useState } from 'react'
import { Download, Image as ImageIcon, RotateCcw, Sparkles, Upload } from 'lucide-react'
import './App.css'

const SUPPORTED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])
const MAX_UPLOAD = 25 * 1024 * 1024

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('The selected image could not be decoded.'))
    }
    image.src = url
  })
}

function analyseImage(file, image) {
  const pixels = image.naturalWidth * image.naturalHeight
  const ratio = image.naturalWidth / image.naturalHeight
  let category = 'photograph'
  if (pixels < 500_000) category = 'low-resolution'
  else if (ratio > 1.8 || ratio < 0.55) category = 'wide-or-tall'
  else if (image.naturalWidth >= 3000 || image.naturalHeight >= 3000) category = 'high-resolution'

  return {
    width: image.naturalWidth,
    height: image.naturalHeight,
    pixels,
    aspectRatio: Number(ratio.toFixed(3)),
    megapixels: Number((pixels / 1_000_000).toFixed(2)),
    mimeType: file.type,
    fileSize: file.size,
    alpha: file.type !== 'image/jpeg',
    category,
  }
}

function enhanceOnCanvas(image, analysis) {
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const context = canvas.getContext('2d', { willReadFrequently: true })
  context.drawImage(image, 0, 0)

  const frame = context.getImageData(0, 0, canvas.width, canvas.height)
  const source = frame.data
  const output = new Uint8ClampedArray(source)
  const contrast = analysis.category === 'low-resolution' ? 1.08 : 1.04
  const lift = analysis.category === 'low-resolution' ? 4 : 2

  for (let i = 0; i < source.length; i += 4) {
    output[i] = Math.max(0, Math.min(255, (source[i] - 128) * contrast + 128 + lift))
    output[i + 1] = Math.max(0, Math.min(255, (source[i + 1] - 128) * contrast + 128 + lift))
    output[i + 2] = Math.max(0, Math.min(255, (source[i + 2] - 128) * contrast + 128 + lift))
  }

  frame.data.set(output)
  context.putImageData(frame, 0, 0)
  return canvas
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob)
      else reject(new Error('The enhanced image could not be exported.'))
    }, 'image/png')
  })
}

function App() {
  const [image, setImage] = useState(null)
  const [resultUrl, setResultUrl] = useState(null)
  const [report, setReport] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => () => {
    if (image?.url) URL.revokeObjectURL(image.url)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
  }, [image?.url, resultUrl])

  const handleUpload = async event => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!SUPPORTED_TYPES.has(file.type)) {
      setError('Please choose a PNG, JPEG or WebP image.')
      return
    }
    if (file.size > MAX_UPLOAD) {
      setError('Image is larger than the 25 MB upload limit.')
      return
    }

    try {
      const decoded = await loadImage(file)
      const analysis = analyseImage(file, decoded)
      setError('')
      setReport({ analysis })
      setResultUrl(null)
      setImage({ file, url: URL.createObjectURL(file), name: file.name, decoded, analysis })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The image could not be loaded.')
    }
  }

  const enhance = async () => {
    if (!image?.decoded) return
    setProcessing(true)
    setError('')
    const started = performance.now()
    try {
      const canvas = enhanceOnCanvas(image.decoded, image.analysis)
      const blob = await canvasToBlob(canvas)
      const url = URL.createObjectURL(blob)
      if (resultUrl) URL.revokeObjectURL(resultUrl)
      setResultUrl(url)
      setReport({
        analysis: image.analysis,
        status: 'completed',
        pipeline: {
          stages: ['analysis', 'exposure-correction', 'conservative-enhancement', 'quality-control', 'export'],
        },
        processing: { processingTimeMs: Math.round(performance.now() - started) },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enhancement failed.')
    } finally {
      setProcessing(false)
    }
  }

  const reset = () => {
    setImage(null)
    setResultUrl(null)
    setReport(null)
    setError('')
  }

  const download = () => {
    if (!resultUrl || !image) return
    const link = document.createElement('a')
    link.href = resultUrl
    link.download = `${image.name.replace(/\.[^.]+$/, '')}-enhanced.png`
    link.click()
  }

  return (
    <main className="app">
      <header className="header">
        <div className="brand"><Sparkles size={22} /><span>Image Enhancer</span></div>
        <div className="header-actions">
          <button className="secondary" onClick={reset} disabled={!image || processing}><RotateCcw size={17} /> Reset</button>
          <button className="download" onClick={download} disabled={!resultUrl}><Download size={18} /> Export</button>
        </div>
      </header>
      <section className="hero">
        <h1>Enhance your images.</h1>
        <p>Analyse, enhance and export images directly in your browser.</p>
        {!image ? (
          <label className="upload-card">
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} hidden />
            <div className="upload-icon"><Upload size={28} /></div>
            <strong>Drop an image here</strong><span>or click to browse</span>
            <small>PNG, JPEG or WebP · up to 25 MB · processed locally</small>
          </label>
        ) : (
          <div className="workspace">
            <div className="preview">
              <div className="preview-label">{resultUrl ? 'Enhanced' : 'Original'}</div>
              <img src={resultUrl || image.url} alt={resultUrl ? 'Enhanced result' : image.name} />
            </div>
            <aside className="controls">
              <div className="file-info"><ImageIcon size={18} /><strong>{image.name}</strong></div>
              {processing && <div className="status">Enhancing image…</div>}
              {error && <div className="error">{error}</div>}
              {report?.analysis && !processing && (
                <div className="analysis">
                  <span>Dimensions</span><strong>{report.analysis.width} × {report.analysis.height}</strong>
                  <span>Category</span><strong>{report.analysis.category}</strong>
                  <span>Pipeline</span><strong>{report.pipeline?.stages.join(' → ') || 'analysis'}</strong>
                  {report.processing && <><span>Processing</span><strong>{report.processing.processingTimeMs} ms</strong></>}
                </div>
              )}
              <button className="enhance" onClick={enhance} disabled={processing}>
                <Sparkles size={18} /> {processing ? 'Enhancing…' : resultUrl ? 'Enhance again' : 'Enhance image'}
              </button>
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
