import glob from "tiny-glob";
import { logger } from "../libs/logger.js";
import path from "node:path";
import { MatchRunner } from "../match-runner.js";

export interface LabelResourcesOptions {
  testGlobPattern: string;
}

function validateMatchFile(matchImport: unknown, file: string): matchImport is { default: MatchRunner } {
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

export async function startLabelResources(options: LabelResourcesOptions) {
  const { testGlobPattern } = options;
  logger.info(`Starting Infra State Matcher...`);
  logger.info(`State directory: ${testGlobPattern}`);
  logger.log("Labeling resources...");

  const files = await glob(testGlobPattern);
  console.log(files);
  for (const file of files) {
    const match = (await import(path.resolve(file))) as unknown;
    if (!validateMatchFile(match, file)) {
      continue;
    }
    const matchRunner = match.default;
    // console.log(matchRunner); 
    // logger.info(`matchRunner: ${JSON.stringify(matchRunner)}`);
    matchRunner.init({
      debug: true,
    });
    await matchRunner.labelResources();
  }
}
