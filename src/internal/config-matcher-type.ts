import { getAllKeyPaths } from "./helpers.js";
import type { GenericResourceAnnotation } from "./providers/resource-annotation.schema.js";

export class ConfigMatcherType {
  constructor(public readonly resourceMap: Map<string, GenericResourceAnnotation>) {}

  public getAllPossibleKeys(): Map<string, string[]> {
    const possibleKeys: Map<string, string[]> = new Map();
    for (const [key, value] of this.resourceMap) {
      if(value.ism_annotations_payload === undefined) continue;
      if(value.ism_annotation_id === undefined) continue;
      possibleKeys.set(key, getAllKeyPaths(value));
    }
    return possibleKeys;
  }

  /**
   * Stringify a TypeScript Union
   * @param key 
   * @param values 
   */
  public stringifyTypeScriptUnion(key: string, values: string[]): string {
    return `  '${key}': \n    | ${values.map(value => `'${value}' `).join('\n    | ')};`
  }

  public toString() {
    const possibleKeys = this.getAllPossibleKeys();
    const result: string[] = [];
    for (const [key, value] of possibleKeys) {
      result.push(this.stringifyTypeScriptUnion(key, value));
    }
    return result.join('\n');
  }
}
