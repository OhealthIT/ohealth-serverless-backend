import schemaRoot from "../../schema";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import baseHandler from "../../helpers/baseHandler";

const swaggerJsonString = async (_event: APIGatewayProxyEvent, _context: Context) => {
  return {
    statusCode: 200,
    body: schemaRoot(),
  };
};

export const handler = baseHandler(swaggerJsonString, {});
