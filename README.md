# Image Enhancer

A modern React + Vite image enhancement workspace designed to analyse an image, classify its characteristics, and automatically select an appropriate enhancement pipeline.

## Overview

Image Enhancer provides a simple workflow for preparing images for intelligent processing:

1. Upload a PNG, JPEG, or WebP image.
2. Analyse the image dimensions, format, size, aspect ratio, pixel count, megapixels, and alpha-channel capability.
3. Classify the image based on its resolution and aspect ratio.
4. Automatically select an enhancement pipeline.
5. Review the detected image information in the workspace.

The current implementation focuses on the analysis and pipeline-routing foundation. The enhancement and export controls are present in the interface but are not yet connected to a final image-processing/export operation.

## Pipeline Routing

The router currently supports three explicit processing modes:

- **Faithful** — preserves the source image characteristics.
- **Restore** — intended for restoration and lower-resolution sources.
- **Forensic** — reserved for forensic-oriented processing.
- **Auto** — selects a pipeline from the image analysis. Low-resolution images are routed to `restore`; other images currently default to `faithful`.

## Image Analysis

The analyser currently detects:

- Width and height
- Total pixel count
- Aspect ratio
- Megapixels
- MIME type
- File size
- Alpha-channel capability
- Image category

Images are currently classified as:

| Category | Detection |
| --- | --- |
| `low-resolution` | Fewer than 500,000 pixels |
| `wide-or-tall` | Aspect ratio above 1.8 or below 0.55 |
| `high-resolution` | Width or height of at least 3,000 pixels |
| `photograph` | Other images |

## Tech Stack

- React 19
- Vite 8
- JavaScript (ES modules)
- TensorFlow.js
- ONNX Runtime Web
- Sharp
- Pixelmatch
- PNG.js
- Lucide React
- ESLint

## Project Structure

```text
image-enhancer/
├── src/
│   ├── engine/
│   │   ├── analyzer.js
│   │   ├── processor.js
│   │   └── router.js
│   ├── App.jsx
│   └── App.css
├── package.json
└── README.md
```

## Getting Started

### Requirements

- Node.js
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Vite will start the local development server and provide the local URL in the terminal.

### Production Build

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Current Status

**Early development / foundation stage.**

The application shell, image upload flow, image analysis, classification, and pipeline selection are implemented. The actual enhancement engine and final export workflow remain to be connected.

## License

No license has currently been specified for this repository.
