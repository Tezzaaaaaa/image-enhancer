export function selectPipeline(analysis, mode = 'auto') {
  if (mode === 'forensic') {
    return 'forensic'
  }

  if (mode === 'faithful') {
    return 'faithful'
  }

  if (mode === 'restore') {
    return 'restore'
  }

  if (analysis.category === 'low-resolution') {
    return 'restore'
  }

  return 'faithful'
}
