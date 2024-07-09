import type { GenericResourceAnnotation } from './providers/resource-annotation.schema.js';

export class ConfigMatcherType {
  constructor(public readonly resourceMap: Map<string, GenericResourceAnnotation>) {}

  public toString() {
    return 'xxx';
  }
}
