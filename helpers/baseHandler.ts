import "reflect-metadata";
import middy from "@middy/core";
import admin from "firebase-admin";

import { APIGatewayProxyEvent, Context } from "aws-lambda";

import jsonBodyParser from "@middy/http-json-body-parser";
import httpResponseSerializer from "@middy/http-response-serializer";
import httpErrorHandler from "@middy/http-error-handler";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import cors from "@middy/http-cors";
import httpSecurityHeaders from "@middy/http-security-headers";

import schemaValidator from "../middlewares/schemaValidator";
import firebaseAuthChecker from "../middlewares/firebaseAuthChecker";

import { z } from "zod";
import { Roles } from "../types";
import { createDataSource } from "../database";
import { createError } from "./utils/createError";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
const host = process.env.DS_HOST || "";
const port = parseInt(process.env.DS_PORT || "5432");
const username = process.env.DS_USERNAME || "";
const password = process.env.DS_PASSWORD || "";
const database = process.env.DS_DATABASE || "";

const appDataSource = createDataSource({
  host,
  port,
  username,
  password,
  database,
});

if (serviceAccount && serviceAccount != "") {
  !admin.apps.length
    ? admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount)),
      })
    : admin.app();
}
interface SchemaHandler {
  inputSchema?: z.AnyZodObject;
  outputSchema?: z.AnyZodObject;
}

const baseHandler = (cf: (e: APIGatewayProxyEvent, c: Context) => any, schemas?: SchemaHandler, roles?: Roles[]) => {
  require("reflect-metadata");
  const middyFunction = middy(cf)
    .use(httpHeaderNormalizer({ canonical: true }))
    .use(firebaseAuthChecker(roles))
    .use(jsonBodyParser())
    .use(
      httpResponseSerializer({
        serializers: [
          {
            regex: /^application\/json$/,
            serializer: ({ body }) => JSON.stringify(body),
          },
          {
            regex: /^text\/plain$/,
            serializer: ({ body }) => body,
          },
        ],
        default: "application/json",
      })
    )
    .use(schemaValidator(schemas?.inputSchema, schemas?.outputSchema))
    .use(httpErrorHandler({ fallbackMessage: "Looks like something went wrong, please contact support at support@ohealthng.com for help." }))
    .use(httpSecurityHeaders())
    .use(cors())
    .before(async (handler) => {
      try {
        handler.event["db"] = await appDataSource.initialize();
      } catch (error) {
        createError(error, 502);
      }
    });

  return middyFunction;
};
export const db = appDataSource;
export default baseHandler;
