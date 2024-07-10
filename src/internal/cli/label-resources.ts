import { logger } from "../libs/logger.js";

export interface LabelResourcesOptions {
  stateDir: string;
}

export async function startLabelResources(options: LabelResourcesOptions) {
  const { stateDir } = options;
  logger.info(`Starting Infra State Matcher...`);
  logger.info(`State directory: ${stateDir}`);
  logger.log("Labeling resources...");
}
