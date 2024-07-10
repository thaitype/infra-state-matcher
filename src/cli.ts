import { Command, Options } from "@effect/cli";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Effect } from "effect";
import { startLabelResources } from "./internal/cli/label-resources.js";

const stateDir = Options.directory("state-dir").pipe(
  Options.withAlias("p"),
  /**
   * @default "." (current directory)
   */
  Options.withDefault("."),
  Options.withDescription("The directory where the state files are located")
);

// Create a command that logs the provided text argument to the console
const command = Command.make("echo", { stateDir }, ({ stateDir }) =>
  Effect.tryPromise(() => startLabelResources({ stateDir }))
);

// Set up the CLI application
const cli = Command.run(command, {
  name: "Infra State Matcher CLI",
  version: "v0.0.0",
});

// Prepare and run the CLI application
cli(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain);


