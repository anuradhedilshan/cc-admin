export {};

// Here we declare the members of the process.env object, so that we
// can use them in our application code in a type-safe manner.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_ENV: string;
      PORT: string;
      COOKIE_SECRET: string;
      SUPERADMIN_USERNAME: string;
      SUPERADMIN_PASSWORD: string;
      PUBLICASSESTPREFIX: string;
      SES_ACCESS_KEY: string;
      SES_SECRET_KEY: string;
      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_USER: string;
      SMTP_PASS: string;
      FROM_ADDRESS: string;
      VERIFY_EMAIL_URL: string;
      PASSWORD_RESET_URL: string;
      CHANGE_EMAIL_URL: string;
    }
  }
}
