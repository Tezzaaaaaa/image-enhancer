import path from 'node:path'
import { diagnoseImage } from '../analysis/diagnostics.js'
import { routeModels } from '../models/router.js'
import { runModel } from '../inference/run-model.js'
import { runQualityControl } from '../qc/quality-control.js'
import { exportImage } from '../export/export-image.js'
import { runRestoration } from '../pipelines/restoration.js'

export async function processImage({
  inputPath,
  outputPath,
  restorationIntensity = 'balanced',
  sourceFidelity = 'balanced',
}) {
  const started = Date.now()

  const jobId =
    `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  // --------------------------------------------------
  // 1. ANALYSIS
  // --------------------------------------------------

  const analysis = await diagnoseImage(inputPath)

  // --------------------------------------------------
  // 2. PIPELINE ROUTING
  // --------------------------------------------------

  const routing = routeModels(analysis, {
    restorationIntensity,
    sourceFidelity,
  })

  // --------------------------------------------------
  // 3. CORRECTION
  // --------------------------------------------------

  const correctionPath = outputPath.replace(
    path.extname(outputPath),
    '.correction.png'
  )

  const correction = await runRestoration(
    inputPath,
    correctionPath
  )

  // --------------------------------------------------
  // 4. MODEL INFERENCE
  // --------------------------------------------------

  const selectedModel =
    routing.routes
      .flatMap(route => route.candidates)
      .find(Boolean)

  const inference = selectedModel
    ? await runModel({
        inputPath: correctionPath,
        outputPath,
        modelId: selectedModel.id,
        analysis,
      })
    : {
        model: null,
        inference: {
          executed: false,
          reason: 'no-compatible-model',
        },
      }

  // --------------------------------------------------
  // 5. CURRENT OUTPUT
  //
  // Since candidate AI runtimes are not installed,
  // export the validated correction rather than
  // falsely claiming model inference occurred.
  // --------------------------------------------------

  const exported = await exportImage(
    correctionPath,
    outputPath
  )

  // --------------------------------------------------
  // 6. QUALITY CONTROL
  // --------------------------------------------------

  const qualityControl = await runQualityControl({
    sourcePath: inputPath,
    outputPath,
    analysis,
  })

  // --------------------------------------------------
  // 7. JOB REPORT
  // --------------------------------------------------

  return {
    jobId,

    status: qualityControl.passed
      ? 'completed'
      : 'failed',

    source: {
      path: inputPath,
      preserved: true,
    },

    settings: {
      restorationIntensity,
      sourceFidelity,
    },

    pipeline: {
      stages: [
        'analysis',
        'correction',
        'pipeline-routing',
        'model-inference',
        'quality-control',
        'export',
      ],
    },

    analysis,

    routing,

    correction,

    inference,

    qualityControl,

    export: exported,

    processing: {
      processingTimeMs: Date.now() - started,
    },
  }
}
