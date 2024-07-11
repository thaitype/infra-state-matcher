import {
  ConfigMatcher,
  MatchRunner,
  ResourceAnnotation,
  StateMatcher,
  type GenericResourceAnnotation,
  type ResourceAnnotationsPayload,
} from "../src/index.js";
import type { State } from "../.gen/SimpleStateMatcher/types.js";

export type SimpleResourceAnnotationsPayload = ResourceAnnotationsPayload<{
  env: "dev" | "prod";
  site: "active" | "dr";
  slot: "staging" | "prod";
  scope: "contractor";
  service: "web" | "api";
  resource_type: "azurerm_app_service" | "azurerm_function_app";
  metadata: Record<string, unknown>;
}>;

// Step 1: Write your test code here
class SimpleStateMatcher extends StateMatcher {
  match() {
    console.log("SimpleStateMatcher is running");

    const matcher = new ConfigMatcher()
      // Config Resource Annotation Literal
      .configResourceAnnotation<SimpleResourceAnnotationsPayload>()
      // Config Default behavior
      .configDefault({
        defaultPair: {
          base: { site: "dr" },
          target: { site: "active" },
        },
        defaultResourceAnnotation: {
          env: "dev",
          slot: "prod",
        },
      });

    // Starting matching the resource `azurerm_app_service` with the service `web` and scope `contractor`
    const contractorWeb = matcher.createResourceMatcher<State["azurerm_app_service.contractor_dr_api"]>({
      resource_type: "azurerm_app_service",
      service: "web",
      scope: "contractor",
    });

    // Matching the resource `azurerm_app_service` with the service `api` and scope `contractor`
    contractorWeb
      .expectKey("values.app_settings.APPINSIGHTS_INSTRUMENTATIONKEY")
      .matchWith<State["azurerm_app_service.contractor_api"]>("values.app_settings.APPINSIGHTS_INSTRUMENTATIONKEY");
    // Short hand for the above
    contractorWeb.expectKey("values.app_settings.APPINSIGHTS_INSTRUMENTATIONKEY").match()

    // Matching with different resource type
    contractorWeb.expectKey("values.app_settings.AzureStorageContainers").matchWith<State["azurerm_app_service.contractor_api"]>(
      "values.app_settings.APPINSIGHTS_INSTRUMENTATIONKEY", {
        resource_type: "azure"
      })
    // Matching the resource `azurerm_app_service` with the service `web` and scope `contractor` with constant value
    contractorWeb.expectKey("values.app_settings.AzureStorageContainers").matchConstant("data");
  }
}

function isKeyString<TKey extends string>(
  data: Record<string, unknown>,
  key: TKey
): data is Record<string, unknown> & { [K in TKey]: string } {
  if (!data) return false;
  return typeof data[key] === "string";
}

// Step 2: Write how you want to label the resources
class SimpleResourceAnnotation extends ResourceAnnotation {
  public label(resources: GenericResourceAnnotation[]): GenericResourceAnnotation[] {
    console.log("SimpleResourceAnnotation is labeling resources... ");
    const INCLUDED_RESOURCE_TYPES = ["azurerm_function_app", "azurerm_app_service"];
    for (const resource of resources.filter(
      resource => isKeyString(resource, "type") && INCLUDED_RESOURCE_TYPES.includes(resource.type)
    )) {
      if (resource.mode !== "managed") continue;
      // Config for the resource based on resource metadata
      resource.ism_annotations_payload = {
        env: "dev",
        site: "us-west-2",
        slot: "blue",
        scope: "public",
        service: "s3",
        resource_type: "bucket",
        metadata: {
          key: "value",
        },
      };
      resource.ism_annotation_id = this.generateId(resource.ism_annotations_payload!);
    }
    return resources;
  }
}

// Step 3: Write how you want to run the state matcher
export default new MatchRunner({
  annotation: SimpleResourceAnnotation,
  stateMather: SimpleStateMatcher,
  options: {
    stateFile: ".state/prod.state.json",
  },
});
