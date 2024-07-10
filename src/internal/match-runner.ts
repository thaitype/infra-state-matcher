import { cons } from "effect/List";
import type { ResourceAnnotation } from "./providers/resource-annotation.js";
import { StateMatcher, type StateMatcherOptions } from "./state-matcher.js";

export type Constructor<T = {}> = new (...args: any[]) => T;

export class MatchRunner {
  private stateMatcher!: StateMatcher;

  constructor(
    public readonly args: {
      annotation: Constructor<ResourceAnnotation>;
      stateMather: Constructor<StateMatcher>;
      options: Partial<StateMatcherOptions>;
    }
  ) {}

  init(runtimeOptions?: Partial<StateMatcherOptions>) {
    const annotationObj = new this.args.annotation();
    const stateMatcherOptions = Object.assign({}, runtimeOptions, this.args.options);
    this.stateMatcher = new this.args.stateMather(annotationObj, stateMatcherOptions);
  }

  run() {
    this.stateMatcher.match();
  }

  async labelResources() {
    await this.stateMatcher.labelResources();
  }
}
