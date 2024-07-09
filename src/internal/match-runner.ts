import type { ResourceAnnotation } from "./providers/resource-annotation.js";
import { StateMatcher, type StateMatcherOptions } from "./state-matcher.js";

export type Constructor<T = {}> = new (...args: any[]) => T;

export class MatchRunner {
  private stateMatcher!: StateMatcher;

  constructor(
    public readonly options: {
      annotation: Constructor<ResourceAnnotation>;
      stateMather: Constructor<StateMatcher>;
      options: Partial<StateMatcherOptions>;
    }
  ) {}

  init(runtimeOptions: StateMatcherOptions) {
    const annotationObj = new this.options.annotation();
    const options: StateMatcherOptions = Object.assign({}, runtimeOptions, this.options);
    this.stateMatcher = new this.options.stateMather(annotationObj, options);
  }

  run() {
    this.stateMatcher.test();
  }

  async labelResources() {
    await this.stateMatcher.labelResources();
  }
}
