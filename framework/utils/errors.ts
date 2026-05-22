export class AutomationError extends Error {
  constructor(
    message: string,
    public readonly context?: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'AutomationError';
  }
}
