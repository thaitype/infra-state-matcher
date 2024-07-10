import { MatchRunner, ResourceAnnotation, StateMatcher, type GenericResourceAnnotation } from "../src/index.js";

// Step 1: Write your test code here
class SimpleStateMatcher extends StateMatcher {
  test() {
    console.log("SimpleStateMatcher is running");
  }
}

// Step 2: Write how you want to label the resources
class SimpleResourceAnnotation extends ResourceAnnotation {
  public label(resources: GenericResourceAnnotation[]): GenericResourceAnnotation[] {
    console.log("SimpleResourceAnnotation is labeling resources... (DO NOTHING)");
    
    for (const resource of resources) {
      if (resource.mode !== 'managed') continue;
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
