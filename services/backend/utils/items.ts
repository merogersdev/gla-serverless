import {
  QueryCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

import { getClient } from "../../../config/db";

import { apiResponse } from "./response";

// GET /items
export const getItems = async (email: string) => {
  const client = getClient();

  if (!email) throw new Error("User Not Found");

  const getItemsCommand = new QueryCommand({
    TableName: process.env.TABLE_NAME,
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

  const itemValue = value.toLowerCase();

  if (!itemValue) throw new Error("Invalid Item");

  const newItem = {
    PK: `USER#${email}`,
    SK: `ITEM#${itemValue}`,
    CHECKED: false,
    VALUE: itemValue,
  };

  const createItemCommand = new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: newItem,
    ConditionExpression:
      "attribute_not_exists(PK) and attribute_not_exists(SK)",
  });

  const result = await client.send(createItemCommand);

  return apiResponse(200, "Successfully Created Item", result);
};

// GET /item/{id}
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

  if (!result.Item) return apiResponse(404, "Item Not Found", null);

  return apiResponse(200, "Successfully Retrieved Item", result);
};

// DELETE /item/{id}
export const deleteItem = async (email: string, id: string) => {
  const client = getClient();

  if (!id) throw new Error("Invalid Item");

  const item = {
    PK: `USER#${email}`,
    SK: `ITEM#${id}`,
  };

  const deleteItemCommand = new DeleteCommand({
    TableName: process.env.TABLE_NAME,
    Key: item,
    ConditionExpression: "attribute_exists(PK) and attribute_exists(SK)",
    ReturnValues: "ALL_OLD",
  });

  const result = await client.send(deleteItemCommand);

  return apiResponse(200, "Successfully Deleted Item", result);
};

// PATCH /item/{id}
// TODO: fix any
export const updateItem = async (email: string, id: string, body: any) => {
  const client = getClient();
  if (!email || !id || !body) throw new Error("Cannot Update Item");

  if (body.checked !== true || body.checked !== false)
    return apiResponse(400, "Invalid Update of Item", null);

  const item = {
    PK: `USER#${email}`,
    SK: `ITEM#${id}`,
  };

  const updateItem = new UpdateCommand({
    TableName: process.env.TABLE_NAME,
    Key: item,
    UpdateExpression: `SET CHECKED = :CHECKED`,
    ExpressionAttributeValues: {
      ":CHECKED": body.checked,
    },
  });

  const result = await client.send(updateItem);

  return apiResponse(200, "Successfully Updated Item", result);
};
