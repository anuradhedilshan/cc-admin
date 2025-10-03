import { CustomerEventRegistration } from "./entities/customer-event-registration.entity";

/**
 * @description
 * The plugin can be configured using the following options:
 */
export interface PluginInitOptions {
  exampleOption?: string;
}

declare module "@vendure/core/dist/entity/custom-entity-fields" {
  interface CustomCustomerFields {
    event_registration: CustomerEventRegistration[];
  }
}
