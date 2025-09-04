import {
  PutCommand,
  DeleteCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

import { getClient } from "../../../config/db";

import { apiResponse } from "./response";

// POST /user
export const createUserProfile = async (
  email: string,
  body: { givenName: string; familyName: string }
) => {
  const client = getClient();

  if (!email || !body.givenName || !body.familyName)
    throw new Error("Invalid User");

  const newUser = {
    PK: `USER#${email}`,
    SK: `PROFILE#${email}`,
    GIVEN_NAME: body.givenName,
    FAMILY_NAME: body.familyName,
  };

  const createUserCommand = new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: newUser,
    ConditionExpression:
      "attribute_not_exists(PK) and attribute_not_exists(SK)",
  });

  const result = await client.send(createUserCommand);

  return apiResponse(200, "Successfully Created User Profile", result);
};

// GET /user
export const getUserProfile = async (email: string) => {
  const client = getClient();

  if (!email) throw new Error("Cannot get User");

  const user = {
    PK: `USER#${email}`,
    SK: `PROFILE#${email}`,
  };

  const getUserCommand = new GetCommand({
    TableName: process.env.TABLE_NAME,
    Key: user,
  });

  const result = await client.send(getUserCommand);

  if (!result.Item) return apiResponse(404, "User Not Found", null);

  return apiResponse(200, "Successfully Retrieved User profile", result);
};

// DELETE /user
export const deleteUserProfile = async (email: string) => {
  const client = getClient();

  if (!email) throw new Error("Invalid User");

  const user = {
    PK: `USER#${email}`,
    SK: `PROFILE#${email}`,
  };

  const deleteUserCommand = new DeleteCommand({
    TableName: process.env.TABLE_NAME,
    Key: user,
    ConditionExpression: "attribute_exists(PK) and attribute_exists(SK)",
    ReturnValues: "ALL_OLD",
  });

  const result = await client.send(deleteUserCommand);

  return apiResponse(200, "Successfully Deleted User", result);
};

// PATCH /user
export const updateUserProfile = async (
  email: string,
  body: { firstName: string; lastName: string }
) => {
  const client = getClient();
  if (!email || !body) throw new Error("Cannot Update User");

  if (!body.firstName || !body.lastName)
    return apiResponse(400, "Invalid Update of User", null);

  const user = {
    PK: `USER#${email}`,
    SK: `PROFILE#${email}`,
  };

  const updateItem = new UpdateCommand({
    TableName: process.env.TABLE_NAME,
    Key: user,
    UpdateExpression: `SET FIRST_NAME = :FIRST_NAME, LAST_NAME = :LAST_NAME`,
    ExpressionAttributeValues: {
      ":FIRST_NAME": body.firstName,
      ":LAST_NAME": body.lastName,
    },
  });

  const result = await client.send(updateItem);

  return apiResponse(200, "Successfully Updated Item", result);
};
