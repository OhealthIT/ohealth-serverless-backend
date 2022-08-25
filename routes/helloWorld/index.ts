import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { helloWorldRequestSchema, HelloWorldRequestType, helloWorldResponseSchema, HelloWorldResponseType } from "./schema";
import { createError } from "../../helpers/utils/createError";
import baseHandler from "../../helpers/baseHandler";
import { logger } from "helpers/utils/logger";
import { baseHandlerCallback } from "types";
import { DataSource } from "typeorm/browser";
import { helloWorldController } from "controllers/helloWorldController";

const helloWorld: baseHandlerCallback<HelloWorldResponseType> = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const body = event.body as unknown as HelloWorldRequestType;
    const db = event["db"] as unknown as DataSource;
    const results = await helloWorldController(body, db);

    return {
      statusCode: 200,
      body: {
        text: results,
      },
    };
  } catch (error: any) {
    const log = logger(__filename);
    log("error", error);
    return createError(error, 400);
  }
};

export const handler = baseHandler(helloWorld, {
  inputSchema: helloWorldRequestSchema,
  outputSchema: helloWorldResponseSchema,
});
