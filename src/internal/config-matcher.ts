import type { SetOptional } from "type-fest";
import type { ResourceAnnotationsPayload } from "./providers/resource-annotation-payload.js";

export type DefaultResourceAnnotationsPayload = Pick<ResourceAnnotationsPayload, "env" | "slot">;
export type ConfigableResourceAnnotationPayload = SetOptional<ResourceAnnotationsPayload, "env" | "slot" | "site">;

export interface IConfigMatcher {
  defaultResourceAnnotation: DefaultResourceAnnotationsPayload;
  defaultPair: {
    /**
     * Config which key will be flagged as a match for the expected key
     * @default `{ site: 'active' }`
     */
    expected: Partial<ResourceAnnotationsPayload>;
    /**
     * Config which key will be flagged as a match for the actual key
     * @default `{ site: 'dr' }`
     */
    actual: Partial<ResourceAnnotationsPayload>;
  };
}

export class ConfigMatcher {
  public readonly defaultResourceAnnotation: DefaultResourceAnnotationsPayload;
  public readonly expected: Partial<ResourceAnnotationsPayload>;
  public readonly actual: Partial<ResourceAnnotationsPayload>;

  constructor(options?: Partial<IConfigMatcher>) {
    this.expected = options?.defaultPair?.expected ?? {
      site: "active",
    };
    this.actual = options?.defaultPair?.actual ?? {
      site: "dr",
    };
    this.defaultResourceAnnotation = options?.defaultResourceAnnotation ?? {
      env: "prod-mt",
      slot: "prod",
    };
  }

  createResourceMatcher<JsonResourceKey extends string>(
    payload: ConfigableResourceAnnotationPayload
  ): ResourceMatcher<JsonResourceKey> {
    return new ResourceMatcher<JsonResourceKey>(payload);
  }
}

export class ResourceMatcher<JsonResourceKey extends string> {
  constructor(public readonly payload: ConfigableResourceAnnotationPayload) {}

  expectKey(key: JsonResourceKey) {
    return new WithMatcher();
  }
}

export class WithMatcher {
  /**
   * Match with Default Pair of expected and actual
   * @param comparator
   */
  match(comparator?: (context: any) => boolean) {
    console.log("default");
  }

  matchConstant<T>(value: T) {
    console.log("constant");
  }

  matchWith<JsonResourceKey extends string>(
    key: JsonResourceKey,
    stormAttribute?: Partial<Pick<ResourceAnnotationsPayload, "resource_type" | "metadata">>
  ) {
    console.log("custom");
  }
}
