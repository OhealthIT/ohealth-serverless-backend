import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { createError } from "../helpers/utils/createError";

export enum Roles {
  ANONYMOUS = "anonymous",
  CUSTOMER = "customer_basic",
  DOCTOR = "doctor_basic",
  ADMIN = "admin_basic",
}

export type baseHandlerCallback<T> = (
  event: APIGatewayProxyEvent,
  context: Context
) => Promise<
  | ReturnType<typeof createError>
  | {
      statusCode: number;
      body: T;
    }
>;

export enum AnalyticsPlatforms {
  MIXPANEL = "mixpanel",
}
