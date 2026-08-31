# Image Enhancer

A modern React + Vite image enhancement workspace for analysing, improving and exporting PNG, JPEG and WebP images.

## Demo

**Try the live browser demo:**

https://tezzaaaaaa.github.io/image-enhancer/

The demo runs the enhancement directly in the browser. Images are not uploaded to a remote processing service.

## What it does

1. Upload a PNG, JPEG or WebP image up to 25 MB.
2. Analyse dimensions, pixel count, aspect ratio, megapixels, format, size and image category.
3. Apply a conservative enhancement pass locally in the browser.
4. Review the processing report.
5. Export the enhanced result as a PNG.

The browser demo is deliberately self-contained so GitHub Pages can host a functional version without requiring a separate API server.

## Processing

The current public demo uses a conservative client-side correction pass:

- Exposure lift for darker sources
- Mild contrast improvement
- Resolution-aware adjustment
- Lossless PNG export

The repository also contains a Node/Sharp processing engine under `backend/` for the fuller server-side restoration architecture.

## Tech Stack

- React 19
- Vite 8
- JavaScript / ES modules
- TensorFlow.js
- ONNX Runtime Web
- Sharp
- Pixelmatch
- PNG.js
- Lucide React
- ESLint

## Local development

### Requirements

- Node.js
- npm

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

This starts the Vite web application and the local Node processing service.

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## GitHub Pages deployment

The repository includes `.github/workflows/pages.yml`, which builds the Vite application and deploys `dist/` to GitHub Pages on every push to `main`.

In the repository settings, GitHub Pages must use **GitHub Actions** as its publishing source.

## Repository

https://github.com/Tezzaaaaaa/image-enhancer

## Status

**Functional demo / active development.**

The public demo is usable now. The server-side engine remains available for extending the project into a more advanced restoration and model-inference workflow.
