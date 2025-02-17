import {
  QueryCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

import { getClient } from "../../../config/db";

import { apiResponse } from "./response";

type ItemProps = {
  PK: string;
  SK: string;
  VALUE: string;
  CHECKED: boolean;
};

type GetItemsProps = {
  user: {
    email: string;
  };
};

// GET /items
export const getItems = async (email: string) => {
  const client = getClient();

  if (!email) throw new Error("User Not Found");

  const getItemsCommand = new QueryCommand({
    TableName: process.env.AWS_DYNAMODB_TABLENAME,
    KeyConditionExpression: "#PK = :PK and begins_with(#SK,:SK)",
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":PK": `USER#${email}`,
      ":SK": "ITEM#",
    },
    ConsistentRead: true,
  });

  const result = await client.send(getItemsCommand);

  return apiResponse(200, "Successfully Retrieved Items", result);
};

// POST /items
export const createItem = async (email: string, value: string) => {
  const client = getClient();
  const uuid = randomUUID();

  if (!value) throw new Error("Invalid Item");

  const item = {
    PK: `USER#${email}`,
    SK: `ITEM#${uuid}`,
    VALUE: value,
    CHECKED: false,
  };

  const createItemCommand = new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: item,
    ConditionExpression:
      "attribute_not_exists(PK) and attribute_not_exists(SK)",
  });

  const result = await client.send(createItemCommand);

  return apiResponse(200, "Successfully Created Item", result);
};

// GET /items/{id}
export const getItem = async (email: string, id: string) => {
  const client = getClient();

  if (!email || !id) throw new Error("Cannot get Item");

  const item = {
    PK: `USER#${email}`,
    SK: `ITEM#${id}`,
  };

  const getSingleitem = new GetCommand({
    TableName: process.env.TABLE_NAME,
    Key: item,
  });

  const result = await client.send(getSingleitem);

  return apiResponse(200, "Successfully Retrieved Item", result);
};

// DELETE /items/{id}
export const deleteItem = async (email: string, id: string) => {
  const client = getClient();

  if (!id) throw new Error("Invalid ID");

  const item = {
    PK: `USER#${email}`,
    SK: `ITEM#${id}`,
  };

  const deleteItemCommand = new DeleteCommand({
    TableName: process.env.TABLE_NAME,
    Key: item,
  });

  const result = await client.send(deleteItemCommand);

  return apiResponse(200, "Successfully Deleted Item", result);
};

// PATCH /items/{id}
// TODO: fix any
export const updateItem = async (email: string, id: string, body: any) => {
  const client = getClient();
  if (!email || !id || !body) throw new Error("Cannot Update Item");

  const itemKeys = Object.keys(body);

  const item = {
    PK: `USER#${email}`,
    SK: `RECIPE#${id}`,
  };

  const updateItem = new UpdateCommand({
    TableName: process.env.TABLE_NAME,
    Key: item,
    UpdateExpression: `SET ${itemKeys
      .map((_k, index) => `#field${index} = :value${index}`)
      .join(", ")}`,
    ExpressionAttributeNames: itemKeys.reduce(
      (accumulator, k, index) => ({
        ...accumulator,
        [`#field${index}`]: k,
      }),
      {}
    ),
    ExpressionAttributeValues: itemKeys.reduce(
      (accumulator, k, index) => ({
        ...accumulator,
        [`:value${index}`]: body[k],
      }),
      {}
    ),
    ReturnValues: "ALL_NEW",
  });

  const result = await client.send(updateItem);

  return apiResponse(200, "Successfully Updated Item", result);
};
