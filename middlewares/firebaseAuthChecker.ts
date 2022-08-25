import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as admin from "firebase-admin";
import { Roles } from "../types";
import axios from "axios";

const isbasicAuthValid = async (email: string, password: string) => {
  try {
    const result = await axios({
      method: "post",
      url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      data: {
        email: email,
        password: password,
        returnSecureToken: true,
      },
    });

    const data: any = result.data;
    if (data.hasOwnProperty("idToken")) {
      return true;
    }
  } catch (error) {}

  return false;
};

const isApiKeyAuthValid = async (apiKey: string) => {
  try {
    const result = await axios({
      method: "post",
      url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.FIREBASE_API_KEY}`,
      data: {
        token: apiKey,
      },
    });

    const data: any = result.data;

    if (data.hasOwnProperty("idToken")) {
      return true;
    }
  } catch (error) {}

  return false;
};

const unAuthError = (challange = false) => {
  const errReturn = {
    statusCode: 401,
    body: JSON.stringify({
      message: "Unauthorized",
    }),
    headers: {},
  };

  if (challange) {
    errReturn["headers"] = { "WWW-Authenticate": `Basic realm="User Visible Realm", charset="UTF-8"` };
  }

  return errReturn;
};

const middleware = (roles: Roles[] = []): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async ({ event }): Promise<any> => {
    const token = event.headers["Authorization"];

    if (!token && roles != null && roles.length > 0 && !roles.includes(Roles.ANONYMOUS)) {
      return unAuthError(true);
    }

    if (token) {
      if (token.includes("Basic")) {
        const basicToken: string = token.replace("Basic ", "");
        const base64 = Buffer.from(basicToken, "base64");
        const username_password = base64.toString("ascii");
        const [username, password] = username_password.split(":");

        const isValid = await isbasicAuthValid(username, password);
        if (!isValid) {
          return unAuthError(true);
        }
      } else if (token.includes("Bearer")) {
        const bearerToken: any = token.replace("Bearer ", "");

        try {
          const claims = await admin.auth().verifyIdToken(bearerToken);
          if (roles && roles.length > 0 && !roles.includes(Roles.ANONYMOUS)) {
            if (!roles.find((r) => claims.hasOwnProperty(r))) {
              return unAuthError();
            }
          }
        } catch (error) {
          return unAuthError();
        }
      } else if (token.includes("APIKey")) {
        const apiKey: string = token.replace("APIKey ", "");
        const isValid = await isApiKeyAuthValid(apiKey);
        if (!isValid) {
          return unAuthError();
        }
      } else {
        return unAuthError();
      }
    }
  };

  return {
    before,
  };
};

export default middleware;
