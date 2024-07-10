import { z } from "zod";

export const envSchema = z.object({
  /**
   * Enable debug mode.
   */
  DEBUG: z
    .enum(["true", "false"])
    .transform(value => value === "true")
    .default("false"),
  /**
   * Path to the directory where the generated files will be stored.
   */
  GENERATE_DIR: z.string().default("./.gen"),
});

export type Env = z.infer<typeof envSchema>;
