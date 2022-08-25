export default () => {
  const { data } = require("./handler");
  const paths: any = {};

  for (const routeKey of Object.keys(data)) {
    if (!data[routeKey].schema) {
      continue;
    }
    const httpInfo = data[routeKey].events[0].http;
    paths[httpInfo.path] = {
      [httpInfo.method.toLowerCase()]: data[routeKey].schema,
    };
  }

  return {
    openapi: "3.0.0",
    info: {
      title: "OHealth Backend",
      description: "Serverless API of all OHealth services",
      version: "0.1.0",
    },
    paths: paths,
    components: {
      securitySchemes: {
        Bearer: {
          type: "apiKey",
          description: "test",
          schema: "bearer",
          bearerFormat: "JWT",
          in: "header",
          name: "Authorization",
        },
      },
    },
    security: [
      {
        Bearer: [],
      },
    ],
  };
};
