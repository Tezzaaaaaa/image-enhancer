import { useState } from 'react'
import { Upload, Download, Sparkles, Image as ImageIcon } from 'lucide-react'
import { processImage } from './engine/processor'
import './App.css'

function App() {
  const [image, setImage] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [processing, setProcessing] = useState(false)

  const handleUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setProcessing(true)

    const result = await processImage(file)

    setImage({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    })

    setAnalysis(result)
    setProcessing(false)
  }

  return (
    <main className="app">
      <header className="header">
        <div className="brand">
          <Sparkles size={22} />
          <span>Image Enhancer</span>
        </div>

        <button className="download" disabled={!image}>
          <Download size={18} />
          Export
        </button>
      </header>

      <section className="hero">
        <h1>Enhance your images.</h1>
        <p>
          Intelligent image restoration designed to select the right
          enhancement pipeline for every image.
        </p>

        {!image ? (
          <label className="upload-card">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleUpload}
              hidden
            />

            <div className="upload-icon">
              <Upload size={28} />
            </div>

            <strong>Drop an image here</strong>
            <span>or click to browse</span>

            <small>PNG, JPEG or WebP</small>
          </label>
        ) : (
          <div className="workspace">
            <div className="preview">
              <img src={image.url} alt={image.name} />
            </div>

            <aside className="controls">
              <div className="file-info">
                <ImageIcon size={18} />
                <strong>{image.name}</strong>
              </div>

              {processing && (
                <div className="status">
                  Analysing image...
                </div>
              )}

              {analysis && !processing && (
                <div className="analysis">
                  <span>Detected</span>
                  <strong>{analysis.analysis.category}</strong>

                  <span>Resolution</span>
                  <strong>
                    {analysis.analysis.width} × {analysis.analysis.height}
                  </strong>

                  <span>Pipeline</span>
                  <strong>{analysis.pipeline}</strong>
                </div>
              )}

              <button className="enhance" disabled={processing}>
                <Sparkles size={18} />
                Enhance image
              </button>
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
