import { z } from 'zod';

export const envSchema = z.object({
  /**
   * Path to the directory where the generated files will be stored.
   */
  GENERATE_DIR: z.string().default('./.gen'),
});

export type Env = z.infer<typeof envSchema>;
