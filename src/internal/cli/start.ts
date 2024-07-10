import { logger } from "../libs/logger.js";
import { executeMatchRunner, type BaseCommandOptions } from "./helper.js";

/**
 * Start the test runner.
 */
export async function start(options: BaseCommandOptions) {
  await executeMatchRunner(options, async matchRunner => {
    logger.log("Start matching...");
    matchRunner.run();
  });
}
