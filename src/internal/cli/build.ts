import { logger } from "../libs/logger.js";
import { executeMatchRunner, type BaseCommandOptions } from "./helper.js";

export async function build(options: BaseCommandOptions) {
  await executeMatchRunner(options, async matchRunner => {
    logger.log("Building resources...");
    await matchRunner.labelResources();
  });
}
