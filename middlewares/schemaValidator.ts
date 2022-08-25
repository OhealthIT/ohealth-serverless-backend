import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";

const validateSchema = (schema: z.AnyZodObject | undefined, body: any) => {
  if (schema) {
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return {
        statusCode: 500,

        //@ts-ignore
        body: JSON.stringify({ message: parsed.error }),
      };
    }
  }
};

const middleware = (
  inputSchema?: z.AnyZodObject,
  outputSchema?: z.AnyZodObject
): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async ({ event }): Promise<any> => {
    const results = validateSchema(inputSchema, event.body);
    if (results?.statusCode === 500) {
      results["statusCode"] = 400;
      return results;
    }
  };

  const after: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async ({ response }): Promise<any> => {
    if (response && response?.statusCode <= 200) {
      const results = validateSchema(outputSchema, response?.body);
      if (results?.statusCode === 500) {
        return results;
      }
    }
  };

  return {
    before,
    after,
  };
};

export default middleware;
