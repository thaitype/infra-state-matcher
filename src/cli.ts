import { Command, Options } from "@effect/cli";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Console, Effect } from "effect";
import { startLabelResources } from "./internal/cli/label-resources.js";

const testGlobPattern = Options.file("test-pattern").pipe(
  Options.withAlias("p"),
  /**
   * The default value for the test pattern is "**\/*.match.ts"
   */
  Options.withDefault("**/*.match.ts"),
  Options.withDescription("The directory where the state files are located")
);

// Create a command that logs the provided text argument to the console
const command = Command.make("main", { testGlobPattern }, args =>
  Effect.tryPromise({
    try: () => startLabelResources(args),
    catch: error => {
      console.error(error);
      // return Effect.dieMessage("An error occurred while running the command");
    },
  })
);

// Set up the CLI application
const cli = Command.run(command, {
  name: "Infra State Matcher CLI",
  // TODO: Fix version later
  version: "v0.0.0",
});

// Prepare and run the CLI application
cli(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain);
