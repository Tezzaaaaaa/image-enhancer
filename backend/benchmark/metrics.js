export function createBenchmarkResult({
  architecture,
  source,
  output,
  metrics = {},
  stages = [],
  warnings = [],
  durationMs = 0,
}) {
  return {
    architecture,
    source,
    output,

    metrics: {
      detailRecovery: metrics.detailRecovery ?? null,
      sourceFidelity: metrics.sourceFidelity ?? null,
      artifactScore: metrics.artifactScore ?? null,
      structuralConsistency: metrics.structuralConsistency ?? null,
      facialIntegrity: metrics.facialIntegrity ?? null,
      textIntegrity: metrics.textIntegrity ?? null,
      colourAccuracy: metrics.colourAccuracy ?? null,
      overall: metrics.overall ?? null,
    },

    stages,
    warnings,
    durationMs,

    reproducibility: {
      recorded: true,
      timestamp: new Date().toISOString(),
    },
  }
}
