/**
 * Resource Annotations Payload
 */
export interface ResourceAnnotationsPayload<
  TPayload extends {
    env: string;
    site: string;
    slot: string;
    scope: string;
    service: string;
    resource_type: string;
    metadata?: Record<string, string>;
  } = {
    env: string;
    site: string;
    slot: string;
    scope: string;
    service: string;
    resource_type: string;
    metadata?: Record<string, string>;
  }
> {
  /**
   * Logical Environment Name, e.g. dev, uat, prod
   */
  env: TPayload["env"];
  /**
   * Logical Site Name, e.g. active_site, dr_site
   */
  site: TPayload["site"];
  /**
   * Logical Slot Name, e.g. staging, prod
   */
  slot: TPayload["slot"];
  /**
   * Logical Scope Name, e.g. tenant, customer, group
   */
  scope: TPayload["scope"];
  /**
   * Logical Service Name, e.g. api_gateway
   */
  service: TPayload["service"];
  /**
   * Infra Resource Type, e.g. Terraform Azurerm Provider
   * Example value: `azurerm_virtual_network`
   */
  resource_type: TPayload["resource_type"];
  /**
   * Metadata for the resource
   * Example value: `{ name: 'my-vnet', location: 'eastus' }`
   */
  metadata?: TPayload["metadata"];
}


