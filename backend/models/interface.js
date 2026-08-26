export class EnhancementModel {
  constructor(config = {}) {
    this.id = config.id ?? 'unknown'
    this.name = config.name ?? 'Unknown Model'
    this.version = config.version ?? 'unknown'
    this.capabilities = config.capabilities ?? []
  }

  async process() {
    throw new Error(
      `${this.name} does not implement process()`
    )
  }

  describe() {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      capabilities: this.capabilities,
    }
  }
}
