import { AWS } from "@serverless/typescript";
import { helloWorldEndpointSchema, submitAnalyticsEventEndpointSchema } from "./routes";

type AWSFunction = AWS["functions"] & {
  [k: string]: {
    schema: any;
  };
};
export const data: AWSFunction = {
  helloWorld: {
    handler: `helloWorld/index`,
    schema: helloWorldEndpointSchema,
    events: [
      {
        http: {
          method: "POST",
          path: "/api/helloworld",
        },
      },
    ],
  },
  submitAnalyticsEvent: {
    handler: `submitAnalyticsEvent/index`,
    schema: submitAnalyticsEventEndpointSchema,
    events: [
      {
        http: {
          method: "POST",
          path: "/api/submitAnalyticsEvent",
        },
      },
    ],
  },
  swaggerUI: {
    handler: `swaggerHandlerRoute/index`,
    schema: null,
    events: [
      {
        http: {
          method: "GET",
          path: "/swagger-docs",
        },
      },
    ],
  },
  swaggerJson: {
    handler: `swaggerJSONStringRoute/index`,
    schema: null,
    events: [
      {
        http: {
          method: "GET",
          path: "/swagger-json",
        },
      },
    ],
  },
};

for (const fKey of Object.keys(data)) {
  const routeName = data[fKey].handler;
  data[fKey].handler = `routes/${routeName}.handler`;
}

const functions = { ...data };

export default functions;
