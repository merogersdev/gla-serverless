import type { Handler } from "aws-lambda";

import {
  getUserProfile,
  deleteUserProfile,
  updateUserProfile,
  createUserProfile,
} from "../utils/user";
import { apiResponse } from "../utils/response";

export const handler: Handler = async (event) => {
  const email = event.requestContext.authorizer.claims.email;
  const method = event.httpMethod;
  const body = JSON.parse(event.body);

  const noEmailResponse = apiResponse(
    400,
    "Error: Invalid or No User Email",
    null
  );

  try {
    switch (method) {
      case "POST":
        return await createUserProfile(email, body);
      case "DELETE":
        if (!email) return noEmailResponse;
        return await deleteUserProfile(email);
      case "GET":
        if (!email) return noEmailResponse;
        return await getUserProfile(email);
      case "PATCH":
        if (!email) return noEmailResponse;
        return await updateUserProfile(email, body);
      default:
        return apiResponse(400, "Error: Invalid Method", null);
    }
  } catch (error) {
    return apiResponse(400, "Error: Could not complete task", error);
  }
};
