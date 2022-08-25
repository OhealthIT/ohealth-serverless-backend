const logger = (filename: string) => {
  const log = require("serverless-logger")(__filename);
  return log;
};

export { logger };
