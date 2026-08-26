export class ModelAdapter {
  constructor(config) {
    this.id = config.id
    this.name = config.name
    this.version = config.version ?? 'unknown'
    this.capabilities = config.capabilities ?? []
  }

  supports(capability) {
    return this.capabilities.includes(capability)
  }

  describe() {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      capabilities: this.capabilities,
    }
  }

  async process() {
    throw new Error(
      `${this.name} does not implement process()`
    )
  }
}
