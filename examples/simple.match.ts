import { ConfigMatcher, MatchRunner, ResourceAnnotation, StateMatcher, type GenericResourceAnnotation } from "../src/index.js";
import type { State } from '../.gen/SimpleStateMatcher/types.js';

// Step 1: Write your test code here
class SimpleStateMatcher extends StateMatcher {
  match() {
    console.log("SimpleStateMatcher is running");

    const matcher = new ConfigMatcher({
      defaultPair: {
        actual: { site: 'dr' },
        expected: { site: 'active' },
      },
    });

    // Starting matching the resource `azurerm_app_service` with the service `web` and scope `contractor`
    const contractorWeb = matcher.createResourceMatcher<State['azurerm_app_service.common_auth_gateway']>({
      resource_type: 'azurerm_app_service',
      service: 'web',
      scope: 'contractor',
    });

    contractorWeb.expectKey('values.app_settings.APPLICATIONINSIGHTS_CONNECTION_STRING').matchConstant('value');
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
