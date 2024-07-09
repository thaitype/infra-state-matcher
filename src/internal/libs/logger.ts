import pc from "picocolors"

export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  debug(message: string): void;
  error(message: string): void;
}

export class ConsoleLogger implements Logger {
  info(message: string): void {
    console.log(`[INFO] ${message}`);
  }

  warn(message: string): void {
    console.warn(`[WARN] ${message}`);
  }

  debug(message: string): void {
    if (process.env.DEBUG === 'true') console.debug(pc.blue(`[DEBUG] ${message}`));
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

export const logger = new ConsoleLogger();
