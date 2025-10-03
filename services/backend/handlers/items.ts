import type { Handler } from "aws-lambda";

import { getItems, createItem } from "../utils/items";
import { apiResponse } from "../utils/response";

export const handler: Handler = async (event) => {
  const email = event.requestContext.authorizer.claims.email;
  const method = event.httpMethod;
  const body = JSON.parse(event.body);

  const noBodyResponse = apiResponse(400, "Error: Invalid Request Body", null);

  try {
    switch (method) {
      case "POST":
        if (!body) return noBodyResponse;
        return await createItem(email, body.value);
      case "GET":
        return await getItems(email);
      default:
        return apiResponse(400, "Error: Invalid Method", null);
    }
  } catch (error) {
    console.error(error);
    return apiResponse(400, "Error: Could not complete task", error);
  }
};
