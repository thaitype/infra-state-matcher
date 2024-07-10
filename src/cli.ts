import { Command, Options } from "@effect/cli";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Console, Effect } from "effect";
import { build } from "./internal/cli/build.js";
import { start } from "./internal/cli/start.js";

// Start test the matching of the state files
// ism [--version] [-h | --help] --test-pattern <test-pattern>
const testGlobPattern = Options.file("test-pattern").pipe(
  Options.withAlias("p"),
  /**
   * The default value for the test pattern is "**\/*.match.ts"
   */
  Options.withDefault("**/*.match.ts"),
  Options.withDescription("The directory where the state files are located")
);
const mainCommand = Command.make("main", { testGlobPattern }, args =>
  Effect.tryPromise({
    try: () => start(),
    catch: error => console.error(error),
  })
);

// Start the build mode
// ism build [--version] [-h | --help] --test-pattern <test-pattern>
const buildCommand = Command.make("build", { testGlobPattern }, args =>
  Effect.tryPromise({
    try: () => build(args),
    catch: error => console.error(error),
  })
);

// Combine all commands into the main 'minigit' command
const command = mainCommand.pipe(Command.withSubcommands([buildCommand]));

// Set up the CLI application
const cli = Command.run(command, {
  name: "Infra State Matcher CLI",
  // TODO: Fix version later
  version: "v0.0.0",
});

// Prepare and run the CLI application
cli(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain);
