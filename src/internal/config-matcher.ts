import type { SetOptional } from "type-fest";
import type { ResourceAnnotationsPayload } from "./providers/resource-annotation-payload.js";

export type ConfigableResourceAnnotationPayload = SetOptional<ResourceAnnotationsPayload, "env" | "slot" | "site">;

export class ConfigMatcher<
  TDefaultBasePayload extends Partial<ResourceAnnotationsPayload>,
  TDefaultTargetPayload extends Partial<ResourceAnnotationsPayload>,
  TDefaultPayload extends Partial<ResourceAnnotationsPayload>,
  TResourceAnnotationsPayload extends ResourceAnnotationsPayload = ResourceAnnotationsPayload
> {
  configResourceAnnotation<TResourceAnnotationsPayload extends ResourceAnnotationsPayload>() {
    return this as unknown as ConfigMatcher<
      TDefaultBasePayload,
      TDefaultTargetPayload,
      TDefaultPayload,
      TResourceAnnotationsPayload
    >;
  }

  configDefault<
    LocalDefaultBasePayload extends Partial<TResourceAnnotationsPayload>,
    LocalDefaultTargetPayload extends Partial<ResourceAnnotationsPayload>,
    LocalDefaultPayload extends Partial<TResourceAnnotationsPayload>
  >(options: {
    defaultResourceAnnotation: LocalDefaultPayload;
    defaultPair: {
      /**
       * Config which key will be flagged as a match for the expected key
       * e.g. `{ site: 'dr' }`
       */
      base: LocalDefaultBasePayload;
      /**
       * Config which key will be flagged as a match for the actual key
       * e.g. `{ site: 'active' }`
       */
      target: LocalDefaultTargetPayload;
    };
  }) {
    return this as ConfigMatcher<
      LocalDefaultBasePayload,
      LocalDefaultTargetPayload,
      LocalDefaultPayload,
      TResourceAnnotationsPayload
    >;
  }

  createResourceMatcher<JsonResourceKey extends string>(
    payload: Omit<TResourceAnnotationsPayload, keyof TDefaultBasePayload | keyof TDefaultPayload>
  ): ResourceMatcher<JsonResourceKey> {
    return new ResourceMatcher<JsonResourceKey>(payload as TResourceAnnotationsPayload);
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
type InvertProperties<T, U> = {
  [K in keyof T]: T[K] extends U[keyof U] ? undefined : T[K];
};

export interface Animal {
  name: string;
  age: number;
  type: string;
}

type AnimalType = Omit<Animal, "age">;
// Expected: { name: string, type: string }

const aaa: AnimalType = {
  name: "name",
  type: "type",
};
