import { InitialData, LanguageCode } from "@vendure/core";

export const initdata: InitialData = {
  defaultLanguage: LanguageCode.en,
  defaultZone: "Asia",
  roles: [],
  taxRates: [
    {
      name: "Zero Tax",
      percentage: 0,
    },
  ],
  shippingMethods: [
    {
      name: "Standard Shipping",
      price: 500,
    },
  ],
  paymentMethods: [
    {
      name: "Standard Payment",
      handler: {
        code: "dummy-payment-handler",
        arguments: [
          {
            name: "automaticSettle",
            value: "false",
          },
        ],
      },
    },
  ],
  collections: [],
  countries: [
    {
      name: "Srilanka",
      code: "Lk",
      zone: "Asia",
    },
  ],
};
