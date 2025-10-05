import { vendureDashboardPlugin } from "@vendure/dashboard/vite";
import { pathToFileURL } from "url";
import { defineConfig } from "vite";
import { resolve, join } from "path";
export default defineConfig({
  build: {
    outDir: join(__dirname, "dist/dashboard"),
  },
  // base: "/dashboard/",
  plugins: [
    vendureDashboardPlugin({
      // The vendureDashboardPlugin will scan your configuration in order
      // to find any plugins which have dashboard extensions, as well as
      // to introspect the GraphQL schema based on any API extensions
      // and custom fields that are configured.
      vendureConfigPath: pathToFileURL("./src/vendure-config.ts"),
      // Points to the location of your Vendure server.
      // api: { host: "https://api.caloriecounter.lk", port: 443 },
      api: { host: "http://localhost", port: 3001 },
      // When you start the Vite server, your Admin API schema will
      // be introspected and the types will be generated in this location.
      // These types can be used in your dashboard extensions to provide
      // type safety when writing queries and mutations.
      gqlOutputPath: "./src/gql",
      theme: {
        light: {
          // Core brand identity
          primary: "#fdb326", // primary brand
          "primary-foreground": "#333333", // readable dark text on yellow

          secondary: "#064e3b", // deep green
          "secondary-foreground": "#f5f5f5", // white/light text on green

          // Optional lighter tone for secondary use
          "secondary-light": "#d6e4d3",
        },
        dark: {
          primary: "#fdb326", // same brand color
          "primary-foreground": "#f5f5f5", // light text for dark mode

          secondary: "#064e3b",
          "secondary-foreground": "#f5f5f5",

          "secondary-light": "#d6e4d3",
        },
      },
      hideVendureBranding: true,
    }),
    ,
  ],
  resolve: {
    alias: {
      // This allows all plugins to reference a shared set of
      // GraphQL types.
      "@/gql": resolve(__dirname, "./src/gql/graphql.ts"),
    },
  },
});
