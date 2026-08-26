export const architectures = [
  {
    id: 'A01',
    name: 'Conservative Baseline',
    strategy: ['correction', 'denoise', 'sharpen'],
  },
  {
    id: 'A02',
    name: 'Super Resolution First',
    strategy: ['correction', 'super-resolution', 'denoise'],
  },
  {
    id: 'A03',
    name: 'Denoise First',
    strategy: ['denoise', 'correction', 'super-resolution'],
  },
  {
    id: 'A04',
    name: 'Deblur First',
    strategy: ['deblur', 'denoise', 'super-resolution'],
  },
  {
    id: 'A05',
    name: 'Restore Then Upscale',
    strategy: ['restore', 'denoise', 'super-resolution'],
  },
  {
    id: 'A06',
    name: 'Upscale Then Restore',
    strategy: ['super-resolution', 'restore', 'refine'],
  },
  {
    id: 'A07',
    name: 'Face Specialist',
    strategy: ['analysis', 'face-restoration', 'super-resolution', 'qc'],
  },
  {
    id: 'A08',
    name: 'Detail Specialist',
    strategy: ['analysis', 'detail-recovery', 'super-resolution', 'qc'],
  },
  {
    id: 'A09',
    name: 'Forensic Conservative',
    strategy: ['analysis', 'correction', 'deterministic-restoration', 'qc'],
  },
  {
    id: 'A10',
    name: 'Forensic Hybrid',
    strategy: ['analysis', 'correction', 'restoration', 'qc'],
  },
  {
    id: 'A11',
    name: 'Generative Conservative',
    strategy: ['correction', 'restoration', 'generative-refinement', 'qc'],
  },
  {
    id: 'A12',
    name: 'Generative Maximum',
    strategy: ['correction', 'super-resolution', 'generative-restoration', 'qc'],
  },
  {
    id: 'A13',
    name: 'Multi-Pass Restoration',
    strategy: ['analysis', 'correction', 'restore', 'refine', 'qc'],
  },
  {
    id: 'A14',
    name: 'Multi-Model Ensemble',
    strategy: ['analysis', 'model-a', 'model-b', 'model-c', 'ensemble', 'qc'],
  },
  {
    id: 'A15',
    name: 'Source-Guided',
    strategy: ['analysis', 'source-guidance', 'restoration', 'qc'],
  },
  {
    id: 'A16',
    name: 'Structure-Preserving',
    strategy: ['analysis', 'structure-preservation', 'restoration', 'qc'],
  },
  {
    id: 'A17',
    name: 'Adaptive Router',
    strategy: ['analysis', 'dynamic-model-selection', 'qc'],
  },
  {
    id: 'A18',
    name: 'Dual-Pass Validation',
    strategy: ['restoration', 'qc', 'correction', 'qc'],
  },
  {
    id: 'A19',
    name: 'Hybrid Ensemble',
    strategy: ['analysis', 'correction', 'specialist-models', 'ensemble', 'qc'],
  },
  {
    id: 'A20',
    name: 'Adaptive Maximum',
    strategy: ['analysis', 'adaptive-routing', 'multi-model-restoration', 'qc'],
  },
]
