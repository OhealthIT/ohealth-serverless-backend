import { generateSchema } from "@anatine/zod-openapi";
import { z } from "zod";

export const submitAnalyticsEventRequestSchema = z.object({
  title: z.string().min(3).max(50),
  user_id: z.string(),
  properties: z.object({}).passthrough(),
});

export const submitAnalyticsEventResponseSchema = z.object({
  error: z.boolean().default(false),
  message: z.string(),
});

export const submitAnalyticsEventEndpointSchema = {
  tags: ["Analytics event"],
  description: "Submit a new analytic event for tracking",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: generateSchema(submitAnalyticsEventRequestSchema),
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: generateSchema(submitAnalyticsEventResponseSchema),
        },
      },
    },
  },
};

export type SubmitAnalyticsEventRequestType = z.infer<typeof submitAnalyticsEventRequestSchema>;
export type SubmitAnalyticsEventResponseType = z.infer<typeof submitAnalyticsEventResponseSchema>;
