import baseHandler from "../../helpers/baseHandler";
import { baseHandlerCallback, Roles } from "../../types";
import { createError } from "../../helpers/utils/createError";
import { submitAnalyticsEventController } from "../../controllers/anayticsEventController";
import {
  submitAnalyticsEventRequestSchema,
  submitAnalyticsEventResponseSchema,
  SubmitAnalyticsEventRequestType,
  SubmitAnalyticsEventResponseType,
} from "./schema";

const submitAnalyticsEvent: baseHandlerCallback<SubmitAnalyticsEventResponseType> = async (event, _context) => {
  try {
    const body = event.body as unknown as SubmitAnalyticsEventRequestType;

    const message = await submitAnalyticsEventController(body);
    return {
      statusCode: 200,
      body: {
        message,
      },
    };
  } catch (error) {
    return createError(error, 400);
  }
};

export const handler = baseHandler(
  submitAnalyticsEvent,
  {
    inputSchema: submitAnalyticsEventRequestSchema,
    outputSchema: submitAnalyticsEventResponseSchema,
  },
  [Roles.ANONYMOUS]
);
