import pc from "picocolors";
import { Console } from "effect";

export interface Logger {
  log(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  debug(message: string): void;
  error(message: string): void;
}

export class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }

  info(message: string): void {
    console.info(`[INFO] ${message}`);
  }

  warn(message: string): void {
    console.warn(`[WARN] ${message}`);
  }

  debug(message: string): void {
    if (process.env.DEBUG === "true") console.debug(pc.blue(`[DEBUG] ${message}`));
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

/**
 * @deprecated Use ConsoleLogger instead
 */

export class EffectLogger implements Logger {
  log(message: string): void {
    Console.log(message);
  }

  info(message: string): void {
    Console.info(message);
  }

  warn(message: string): void {
    Console.warn(message);
  }

  debug(message: string): void {
    Console.debug(message);
  }

  error(message: string): void {
    Console.error(message);
  }
}

// Setting default logger
export const logger = new ConsoleLogger();
