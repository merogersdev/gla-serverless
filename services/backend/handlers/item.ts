import type { Handler } from "aws-lambda";

import { getItem, deleteItem, updateItem } from "../utils/items";
import { apiResponse } from "../utils/response";

export const handler: Handler = async (event) => {
  const id = event.pathParameters?.id;
  const email = event.requestContext.authorizer.claims.email;
  const method = event.httpMethod;
  const body = JSON.parse(event.body);

  if (!id) return apiResponse(400, "Error: Invalid ID", null);
  if (!email) return apiResponse(400, "Error: Invalid Email", null);

  const noBodyResponse = apiResponse(400, "Error: Invalid Request Body", null);

  try {
    switch (method) {
      case "DELETE":
        return await deleteItem(email, id);
      case "GET":
        return await getItem(email, id);
      case "PATCH":
        if (!body) return noBodyResponse;
        return await updateItem(email, id, body.checked);
      default:
        return apiResponse(400, "Error: Invalid Method", null);
    }
  } catch (error) {
    console.error(error);
    return apiResponse(400, "Error: Could not complete task", error);
  }
};
