import type { Handler } from "aws-lambda";

import {
  getItems,
  getItem,
  deleteItem,
  updateItem,
  createItem,
} from "../utils/items";

import { apiResponse } from "../utils/response";

export const handler: Handler = async (event, _context) => {
  let body;
  try {
    switch (event.routeKey) {
      case "DELETE /items/{id}":
        body = deleteItem(event.pathParameters.id);
        break;
      case "GET /items/{id}":
        body = getItem(event.pathParameters.id);
        break;
      case "PATCH /items/{id}":
        body = updateItem(event.pathParameters.id);
        break;
      case "PUT /items/":
        body = createItem(event.body);
        break;
      case "GET /items/":
        body = getItems(event.body.user);
        break;
      default:
        throw new Error(`Unsupported Route: "${event.routeKey}"`);
    }
    return apiResponse(200, "Success", body);
  } catch (error) {
    return apiResponse(500, "Error: Could not delete item", error);
  }
};
