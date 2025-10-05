import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSchedulerPlugin,
  DefaultSearchPlugin,
  VendureConfig,
} from "@vendure/core";
import {
  defaultEmailHandlers,
  EmailPlugin,
  FileBasedTemplateLoader,
} from "@vendure/email-plugin";
import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import { GraphiqlPlugin } from "@vendure/graphiql-plugin";
import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import "dotenv/config";
import path from "path";
import { CaloriecounterPlugin } from "./plugins/caloriecounter/caloriecounter.plugin";

const IS_DEV = process.env.APP_ENV === "dev";
const serverPort = +process.env.PORT || 3000;

export const config: VendureConfig = {
  apiOptions: {
    port: serverPort,
    adminApiPath: "admin-api",
    shopApiPath: "api",
    cors: {
      origin: [
        "https://caloriecounter.lk",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "https://admin.caloriecounter.lk",
      ],
      credentials: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "vendure-token", // 👈 add your custom header
      ],
    },
  },
  authOptions: {
    tokenMethod: ["bearer", "cookie"],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME,
      password: process.env.SUPERADMIN_PASSWORD,
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET,
    },
    sessionDuration: "3d",
  },
  dbConnectionOptions: {
    type: "better-sqlite3",
    // See the README.md "Migrations" section for an explanation of
    // the `synchronize` and `migrations` options.
    synchronize: false,
    migrations: [path.join(__dirname, "./migrations/*.+(js|ts)")],
    logging: false,
    database: path.join(__dirname, "../vendure.sqlite"),
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  // When adding or altering custom field definitions, the database will
  // need to be updated. See the "Migrations" section in README.md.
  customFields: {
    Product: [
      { name: "nutrition_info", type: "string", nullable: true },
      { name: "ingredients", type: "string", nullable: true },
      { name: "tags", type: "string", nullable: true },
      { name: "styles", type: "string", nullable: true },
    ],

    Customer: [{ name: "run", type: "boolean", defaultValue: false }],
  },
  plugins: [
    GraphiqlPlugin.init(),
    AdminUiPlugin,
    AssetServerPlugin.init({
      route: "assets",
      assetUploadDir: path.join(__dirname, "../static/assets"),
      // For local dev, the correct value for assetUrlPrefix should
      // be guessed correctly, but for production it will usually need
      // to be set manually to match your production url.
      assetUrlPrefix: IS_DEV
        ? `http://localhost:${serverPort}/assets/`
        : process.env.PUBLICASSESTPREFIX,
    }),
    DefaultSchedulerPlugin.init(),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init({
      handlers: defaultEmailHandlers,
      templateLoader: new FileBasedTemplateLoader(
        path.join(__dirname, "../static/email/templates"),
      ),
      transport: {
        type: "smtp",
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      globalTemplateVars: {
        fromAddress: process.env.FROM_ADDRESS,
        verifyEmailAddressUrl: process.env.VERIFY_EMAIL_URL,
        passwordResetUrl: process.env.PASSWORD_RESET_URL,
        changeEmailAddressUrl: process.env.CHANGE_EMAIL_URL,
      },
    }),
    CaloriecounterPlugin,
  ],
};
