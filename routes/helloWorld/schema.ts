import { generateSchema } from "@anatine/zod-openapi";
import { z } from "zod";

export const helloWorldRequestSchema = z.object({
  title: z.string(),
  message: z.string(),
});

export const helloWorldResponseSchema = z.object({
  text: z.string(),
});

export const helloWorldEndpointSchema = {
  tags: ["Hello World"],
  description: "hello world endpoint",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: generateSchema(helloWorldRequestSchema),
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: generateSchema(helloWorldResponseSchema),
        },
      },
    },
  },
};

export type HelloWorldRequestType = z.infer<typeof helloWorldRequestSchema>;
export type HelloWorldResponseType = z.infer<typeof helloWorldResponseSchema>;
