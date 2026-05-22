type Level = 'info' | 'warn' | 'error';

function log(level: Level, message: string): void {
  console[level](`[${level.toUpperCase()}] ${message}`);
}

export const logger = {
  info: (message: string) => log('info', message),
  warn: (message: string) => log('warn', message),
  error: (message: string, err?: unknown) => {
    log('error', message);
    if (err !== undefined) console.error(err);
  },
};
