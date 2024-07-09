import type { GenericResourceAnnotation } from "../resource-annotation.schema.js";
import { StateManager } from "../state-manager.js";
import { terraformStateOutputSchema, type TerraformStateOutput } from "./terraform-state.schema.js";
import fs from "node:fs";

export class TerraformStateManager extends StateManager {
  /**
   * Read the state file and return the state object, e.g. Terraform State
   *
   * The terraform state from `terraform show -json`
   */
  async read(path: string): Promise<TerraformStateOutput> {
    const rawData = await fs.promises.readFile(path, "utf8");
    const state = JSON.parse(rawData);
    const jsonState = terraformStateOutputSchema.parse(state);
    return jsonState;
  }

  serialize(state: TerraformStateOutput): GenericResourceAnnotation[] {
    return state.values.root_module.resources.map(resource => resource);
  }

  async readAndSerialize(path: string): Promise<GenericResourceAnnotation[]> {
    const state = await this.read(path);
    return this.serialize(state);
  }
}
