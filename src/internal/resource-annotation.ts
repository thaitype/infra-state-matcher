import { convertRecordToString } from "./helpers.js";
import { createDebugger } from "./utils.js";

const debug = createDebugger('ism:resource-annotation');

export interface ResourceAnnotationsPayload<
  TEnv extends string = string,
  TSite extends string = string,
  TSlot extends string = string,
  TScope extends string = string,
  TService extends string = string,
  TResourceType extends string = string,
  TMetadata extends Record<string, string> = Record<string, string>
> {
  /**
   * Logical Environment Name, e.g. dev, uat, prod
   */
  env: TEnv;
  /**
   * Logical Site Name, e.g. active_site, dr_site
   */
  site: TSite;
  /**
   * Logical Slot Name, e.g. staging, prod
   */
  slot: TSlot;
  /**
   * Logical Scope Name, e.g. tenant, customer, group
   */
  scope: TScope;
  /**
   * Logical Service Name, e.g. api_gateway
   */
  service: TService;
  /**
   * Infra Resource Type, e.g. Terraform Azurerm Provider
   * Example value: `azurerm_virtual_network`
   */
  resource_type: TResourceType;
  /**
   * Metadata for the resource
   * Example value: `{ name: 'my-vnet', location: 'eastus' }`
   */
  metadata?: TMetadata;
}

/**
 * Resource Annotation for adding metadata to a resource in the infra state
 */
export interface ResourceAnnotation {
  generateId(component: ResourceAnnotationsPayload): string;
}


export class DefaultResourceAnnotation implements ResourceAnnotation {
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

  
}
