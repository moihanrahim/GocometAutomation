export class AutomationError extends Error {
  readonly page: string;
  readonly step: string;
  readonly cause?: unknown;

  constructor(message: string, page: string, step: string, cause?: unknown) {
    super(message);
    this.name = 'AutomationError';
    this.page = page;
    this.step = step;
    this.cause = cause;
  }

  static from(step: string, page: string, cause: unknown): AutomationError {
    const detail = cause instanceof Error ? cause.message : String(cause);
    return new AutomationError(`[${page}] ${step} failed: ${detail}`, page, step, cause);
  }
}
