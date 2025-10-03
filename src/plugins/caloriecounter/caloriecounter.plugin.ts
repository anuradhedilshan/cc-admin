import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";
import * as path from "path";

import {
  customerEventRegistrationAdminApiExtensions,
  customerEventRegistrationShopApiExtensions,
} from "./api/api-extensions";
import { CustomerEventRegistrationAdminResolver } from "./api/customer-event-registration-admin.resolver";
import { CustomerEventRegistrationShopResolver } from "./api/customer-event-registration-shop.resolver";
import { CALORIECOUNTER_PLUGIN_OPTIONS } from "./constants";
import { CustomerEventRegistration } from "./entities/customer-event-registration.entity";
import { CustomerEventRegistrationShop } from "./services/customer-event-registration-shop";
import { CustomerEventRegistrationService } from "./services/customer-event-registration.service";
import { PluginInitOptions } from "./types";
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [
    {
      provide: CALORIECOUNTER_PLUGIN_OPTIONS,
      useFactory: () => CaloriecounterPlugin.options,
    },
    CustomerEventRegistrationService,
    CustomerEventRegistrationShop,
  ],
  configuration: (config) => {
    // Plugin-specific configuration
    // such as custom fields, custom permissions,
    // strategies etc. can be configured here by
    // modifying the `config` object.
    config.customFields.Customer.push({
      name: "event_registartion",
      type: "relation",
      list: true,
      entity: CustomerEventRegistration,
      internal: true,
    });
    return config;
  },
  compatibility: "^3.0.0",
  entities: [CustomerEventRegistration],
  adminApiExtensions: {
    schema: customerEventRegistrationAdminApiExtensions,
    resolvers: [CustomerEventRegistrationAdminResolver],
  },
  shopApiExtensions: {
    schema: customerEventRegistrationShopApiExtensions,
    resolvers: [CustomerEventRegistrationShopResolver],
  },
  dashboard: "./dashboard/index.tsx",
})
export class CaloriecounterPlugin {
  static options: PluginInitOptions;

  static init(options: PluginInitOptions): Type<CaloriecounterPlugin> {
    this.options = options;
    return CaloriecounterPlugin;
  }
}
