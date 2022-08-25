export const logError = (message: string, body?: any, filename?: string) => {
  const stage = process.env.STAGE;
  // logger for development and staging, sentry for production
  if (stage != "production") {
    const log = require("serverless-logger")(filename || "/");
    log(message, body);
  } else {
    //sentry
  }
};

// log events
// log notifications
