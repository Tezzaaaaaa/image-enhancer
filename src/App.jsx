import { useEffect, useState } from 'react'
import { Download, Image as ImageIcon, RotateCcw, Sparkles, Upload } from 'lucide-react'
import './App.css'

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

  const handleUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError('Please choose a PNG, JPEG or WebP image.')
      return
    }
    setError('')
    setReport(null)
    setResultUrl(null)
    setImage({ file, url: URL.createObjectURL(file), name: file.name })
  }

  const enhance = async () => {
    if (!image?.file) return
    setProcessing(true)
    setError('')
    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': image.file.type },
        body: image.file,
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Enhancement failed.')
      const output = await fetch(payload.outputUrl)
      if (!output.ok) throw new Error('The enhanced image could not be retrieved.')
      setResultUrl(URL.createObjectURL(await output.blob()))
      setReport(payload.report)
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
        <p>Analyse, restore and export your image through the local enhancement engine.</p>
        {!image ? (
          <label className="upload-card">
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} hidden />
            <div className="upload-icon"><Upload size={28} /></div>
            <strong>Drop an image here</strong><span>or click to browse</span>
            <small>PNG, JPEG or WebP · up to 25 MB</small>
          </label>
        ) : (
          <div className="workspace">
            <div className="preview">
              <div className="preview-label">{resultUrl ? 'Enhanced' : 'Original'}</div>
              <img src={resultUrl || image.url} alt={resultUrl ? 'Enhanced result' : image.name} />
            </div>
            <aside className="controls">
              <div className="file-info"><ImageIcon size={18} /><strong>{image.name}</strong></div>
              {processing && <div className="status">Processing image…</div>}
              {error && <div className="error">{error}</div>}
              {report && !processing && (
                <div className="analysis">
                  <span>Status</span><strong>{report.status}</strong>
                  <span>Pipeline</span><strong>{report.pipeline.stages.join(' → ')}</strong>
                  <span>Processing</span><strong>{report.processing.processingTimeMs} ms</strong>
                </div>
              )}
              <button className="enhance" onClick={enhance} disabled={processing}>
                <Sparkles size={18} /> {processing ? 'Enhancing…' : 'Enhance image'}
              </button>
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
