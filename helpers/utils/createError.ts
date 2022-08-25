import { AxiosError } from "axios";
import { LocalError } from "./LocalError";

interface ResponseError {
  statusCode: number;
  body?: {
    message: string;
    [key: string]: any;
  };
}

export const createLocalError = (message: string, code = 400, errors?: any): LocalError => new LocalError(message, code, errors);

export function createError(errorItem: any, statusCode: number = 500, expose: boolean = false) {
  const err: ResponseError = {
    statusCode: statusCode,
  };

  if (errorItem instanceof LocalError) {
    return {
      statusCode: errorItem.statusCode,
      body: {
        error: true,
        ...errorItem,
      },
    };
  }

  const errorBody = errorItem?.message
    ? {
        message: errorItem?.message,
        ...errorItem,
      }
    : {
        message: errorItem,
      };

  errorBody["error"] = true;

  if (expose || statusCode < 500) {
    err["body"] = errorBody;
  } else {
    err["body"] = {
      message: "Please contact support at support@ohealthng.com",
      error: true,
    };

    console.error(errorItem);
  }

  return err;
}

export const unAuthError = (challange = false, message = "Unauthorized") => {
  const errReturn = {
    statusCode: 401,
    body: JSON.stringify({
      message,
    }),
    headers: {},
  };

  if (challange) {
    errReturn["headers"] = { "WWW-Authenticate": `Basic realm="User Visible Realm", charset="UTF-8"` };
  }

  return errReturn;
};

export const handleAxiosError = (error: AxiosError | any) => {
  try {
    const axiosApiError = error?.response?.data;
    if (!axiosApiError) {
      return error?.message || "Please contact support at support@ohealthng.com";
    }
    if (Array.isArray(axiosApiError) && axiosApiError.length) {
      return axiosApiError[0];
    }

    if (typeof axiosApiError === "string") {
      return axiosApiError;
    }

    if (Object.keys(axiosApiError).length && axiosApiError.message) {
      return axiosApiError.message;
    }

    throw new Error(axiosApiError);
  } catch (error) {
    // Log error
    throw error;
  }
};
