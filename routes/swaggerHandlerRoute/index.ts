import { htmlTemplate } from "../../static/swagger.html";
import schemaRoot from "../../schema";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import baseHandler from "../../helpers/baseHandler";

const swaggerHandler = async (_event: APIGatewayProxyEvent, _context: Context) => {
  const apiJsonString = JSON.stringify(schemaRoot());
  const swaggerHTML = htmlTemplate.replace("<% apiJson %>", `var spec = ${apiJsonString}`);
  return {
    headers: {
      "Content-Type": "text/html",
    },
    statusCode: 200,
    body: swaggerHTML,
  };
};

export const handler = baseHandler(swaggerHandler, {});
