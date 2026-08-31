import React, { useState, useRef, useCallback } from 'react';
import './App.css';
import { runEnhancement } from './engine/enhancer';

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Idle');
  const fileInputRef = useRef(null);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setOriginalImage(ev.target.result);
      setEnhancedImage(null);
      setStatus('Ready');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleEnhance = useCallback(async () => {
    if (!originalImage) return;
    setProcessing(true);
    setProgress(0);
    setStatus('Enhancing...');

    const img = new Image();
    img.src = originalImage;
    await new Promise((resolve) => (img.onload = resolve));

    try {
      const params = {};
      const result = await runEnhancement(img, params, (prog) => {
        setProgress(Math.round(prog * 100));
      });
      setEnhancedImage(result);
      setStatus('Done!');
      setProgress(100);
    } catch (err) {
      console.error(err);
      setStatus('Error: ' + err.message);
    } finally {
      setProcessing(false);
    }
  }, [originalImage]);

  const handleDownload = () => {
    if (!enhancedImage) return;
    const link = document.createElement('a');
    link.download = 'enhanced.png';
    link.href = enhancedImage;
    link.click();
  };

  const triggerFileInput = () => fileInputRef.current.click();

  return (
    <div className="app">
      {/* HEADER */}
      <header className="app-header">
        <div className="logo">
          {/* Simple Sparkle SVG Icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="#FFD700"/>
            <path d="M12 6L12.8 8.9L15.5 9.5L12.8 10.1L12 13L11.2 10.1L8.5 9.5L11.2 8.9L12 6Z" fill="#FFD700"/>
          </svg>
          <span>Enhancer</span>
        </div>
        <div className="actions">
          <button onClick={triggerFileInput} disabled={processing}>
            Upload Image
          </button>
          <button onClick={handleEnhance} disabled={!originalImage || processing}>
            {processing ? `Processing ${progress}%` : 'Enhance'}
          </button>
          {enhancedImage && (
            <button onClick={handleDownload}>Download PNG</button>
          )}
        </div>
      </header>

      {/* DROP ZONE */}
      <div className="drop-zone" onClick={triggerFileInput}>
        {originalImage ? (
          <img src={originalImage} alt="Original" style={{ maxHeight: '200px' }} />
        ) : (
          <p>📤 Drag & drop an image here, or click to upload</p>
        )}
      </div>

      {/* PREVIEW GRID */}
      <div className="preview-grid">
        <div className="preview-box">
          <h4>Original</h4>
          {originalImage ? (
            <img src={originalImage} alt="Original" />
          ) : (
            <div className="placeholder">No image loaded</div>
          )}
        </div>
        <div className="preview-box">
          <h4>Enhanced</h4>
          {enhancedImage ? (
            <img src={enhancedImage} alt="Enhanced" />
          ) : (
            <div className="placeholder">Enhancement result</div>
          )}
        </div>
      </div>

      {/* STATUS BAR */}
      <div className="status-bar">
        <span>Status: {status}</span>
        {processing && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;