# Image Enhancer Processing Engine

## Core principle

The original image is always preserved.

Every processing pipeline must:

1. Analyse the source.
2. Record the source characteristics.
3. Apply corrections/restoration.
4. Validate the result against the source.
5. Produce a measurable processing report.
6. Never silently overwrite the original.

## Processing spectrum

The engine supports two independent user controls.

### Restoration intensity

Controls how aggressively the system attempts to recover or reconstruct detail.

`faithful → balanced → maximum`

### Source fidelity

Controls how strongly the output is constrained by information supported by the source.

`interpretive → balanced → source-faithful`

These controls determine pipeline behaviour but do not bypass safety and integrity checks.

## Pipeline contract

Every pipeline receives:

- source image
- image analysis
- restoration intensity
- source fidelity
- processing configuration

Every pipeline returns:

- output image
- processing stages
- model information
- quality metrics
- warnings
- processing time
- reproducibility information

## Validation principle

A result is not considered better simply because it is sharper.

Quality must consider:

- detail recovery
- source fidelity
- artifact generation
- facial integrity
- text integrity
- colour accuracy
- structural consistency
- processing reliability

## Architecture

Frontend
→ Job Manager
→ Analysis
→ Correction
→ Pipeline Router
→ Model Inference
→ Quality Control
→ Export
