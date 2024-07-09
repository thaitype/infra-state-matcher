import { Csv } from "../libs/csv.js";
import { convertRecordToString } from "../helpers.js";
import type { BaseResourceAnnotation, GenericResourceAnnotation } from "./resource-annotation.schema.js";
import type { ResourceAnnotationsPayload } from "./resource-annotation-payload.js";

/**
 * Resource Annotation for adding metadata to a resource in the infra state
 */
export abstract class ResourceAnnotation  {
    /**
   * Generate a unique id for the resource for mapping to the infra state
   */
  public generateId(component: ResourceAnnotationsPayload): string {
    const baseId = `/env/${component.env}/site/${component.site}/slot/${component.slot}/scope/${component.scope}/service/${component.service}/resourceType/${component.resource_type}`;
    if (!component.metadata) {
      return baseId;
    }
    return `${baseId}/metadata/${convertRecordToString(component.metadata)}`;
  }

  /**
   * How your state matcher should label the resources, this is the main function that should be implemented
   * 
   * This is main function for state matcher can compare the state with the infra state
   * @param resources 
   */
  public abstract label(resources: GenericResourceAnnotation[]): GenericResourceAnnotation[];

  /**
   * Export the resource annotations payload to csv files
   */
  public async exportPayloadToCsv(outfile: string, resources: GenericResourceAnnotation[]): Promise<void> {
    const csv = new Csv(outfile, [
      "address",
      "id",
      "env",
      "site",
      "slot",
      "scope",
      "service",
      "resource_type",
      "metadata",
    ]);
    await csv.create();

    for (const resource of resources) {
      const payload = resource.ism_annotations_payload;
      if (!payload) {
        continue;
      }
      const row = [
        resource.address,
        resource.ism_annotation_id,
        payload.env,
        payload.site,
        payload.slot,
        payload.scope,
        payload.service,
        payload.resource_type,
        convertRecordToString(payload.metadata),
      ];
      await csv.append(row);
    }
  }
}
