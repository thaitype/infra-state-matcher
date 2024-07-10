import glob from "tiny-glob";
import { envSchema } from "../env.schema.js";
import { logger } from "../libs/logger.js";
import { MatchRunner } from "../match-runner.js";
import path from "node:path";

export type MaybePromise<T> = T | Promise<T>;

export interface BaseCommandOptions {
  testGlobPattern: string;
}

export function validateMatchFile(matchImport: unknown, file: string): matchImport is { default: MatchRunner } {
  if (!matchImport) {
    logger.warn(`No export found in '${file}'`);
    return false;
  }
  if (typeof matchImport !== "object") {
    logger.warn(`Export in '${file}' is not an object`);
    return false;
  }
  if (!("default" in matchImport)) {
    logger.warn(`No default export found in '${file}'`);
    return false;
  } else if (matchImport.default instanceof MatchRunner) {
    return true;
  }
  logger.warn(`Default export in '${file}' is not a MatchRunner`);
  return false;
}

export async function executeMatchRunner(
  options: BaseCommandOptions,
  fn: (matchRunner: MatchRunner) => MaybePromise<void>
): Promise<void> {
  const { testGlobPattern } = options;
  const env = envSchema.parse(process.env);
  logger.info(`Running with environment: ${JSON.stringify(env)}`);
  logger.info(`Test Match Pattern: '${testGlobPattern}'`);

  const files = await glob(testGlobPattern);
  console.log(files);
  for (const file of files) {
    const match = (await import(path.resolve(file))) as unknown;
    if (!validateMatchFile(match, file)) {
      continue;
    }
    const matchRunner = match.default;
    matchRunner.init({
      debug: env.DEBUG,
    });
    await fn(matchRunner);
  }
}
