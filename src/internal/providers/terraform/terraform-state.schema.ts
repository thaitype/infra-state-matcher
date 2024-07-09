import { z } from "zod";
import { baseResourceAnnotation } from "../resource-annotation.schema.js";

export const terraformResourceSchema = z.object({
  mode: z.string(),
  type: z.string(),
  name: z.string(),
  provider_name: z.string(),
  schema_version: z.number(),
  values: z.record(z.unknown()),
  sensitive_values: z.record(z.unknown()),
  depends_on: z.array(z.string()).optional(),
  ...baseResourceAnnotation,
});

export type TerraformResource = z.infer<typeof terraformResourceSchema>;

/**
 * The schema for the JSON output from command `terraform show -json`.
 * @see https://developer.hashicorp.com/terraform/cli/commands/show
 */
export const terraformStateOutputSchema = z.object({
  format_version: z.string(),
  terraform_version: z.string(),
  values: z.object({
    root_module: z.object({
      resources: z.array(terraformResourceSchema),
    }),
  }),
});

export type TerraformStateOutput = z.infer<typeof terraformStateOutputSchema>;
