import { bootstrap, DefaultJobQueuePlugin } from "@vendure/core";
import { populate } from "@vendure/core/cli";
import path from "path";

import { config } from "../vendure-config";
import { initdata } from "./initial-data";

const productsCsvFile = path.join(__dirname, "./products.csv");

const populateConfig = {
  ...config,
  plugins: (config.plugins || []).filter(
    // Remove your JobQueuePlugin during populating to avoid
    // generating lots of unnecessary jobs as the Collections get created.
    (plugin) => plugin !== DefaultJobQueuePlugin
  ),
};

populate(
  () => bootstrap(populateConfig),
  initdata,
  productsCsvFile,
) // entities to the specified Channel
  .then((app) => {
    return app.close();
  })
  .then(
    () => process.exit(0),
    (err) => {
      console.log(err);
      process.exit(1);
    }
  );
