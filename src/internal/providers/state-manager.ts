import fs from "node:fs";
import type { GenericResourceAnnotation } from "./resource-annotation.schema.js";

export abstract class StateManager {
  /**
   * Read the state file and return the state object, e.g. Terraform State
   * @param path
   */
  abstract read(path: string): Promise<unknown>;

  /**
   * Serelize the state object to a list of GenericResourceAnnotation
   * @param state
   */
  abstract serialize(state: unknown): GenericResourceAnnotation[];

  /**
   * Read the state file and serialize it to a list of GenericResourceAnnotation
   */
  abstract readAndSerialize(path: string): Promise<GenericResourceAnnotation[]>;
}
