/**
 * Resource Annotations Payload
 */
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
