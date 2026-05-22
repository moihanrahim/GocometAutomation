type Level = 'info' | 'warn' | 'error' | 'step';

function emit(level: Level, message: string): void {
  const timestamp = new Date().toISOString();
  console[level === 'step' ? 'info' : level](`[${timestamp}] [${level.toUpperCase()}] ${message}`);
}

export const logger = {
  info: (message: string) => emit('info', message),
  warn: (message: string) => emit('warn', message),
  error: (message: string, err?: unknown) => {
    emit('error', message);
    if (err !== undefined) console.error(err);
  },
  step: (page: string, action: string) => emit('step', `${page} → ${action}`),
};
