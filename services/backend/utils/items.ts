import {
  QueryCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

import { getClient } from "../../../config/db";

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

const itemsTable = process.env.AWS_DYNAMODB_TABLENAME || "";

// GET /items
export const getItems = async ({ user }: GetItemsProps) => {
  const client = getClient();

  if (!user) throw new Error("User Not Found");

  const getItemsCommand = new QueryCommand({
    TableName: itemsTable,
    KeyConditionExpression: "#PK = :PK and begins_with(#SK,:SK)",
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":PK": `USER#${user.email}`,
      ":SK": "ITEM#",
    },
    ConsistentRead: true,
  });

  return await client.send(getItemsCommand);
};

// POST /items
export const createItem = async ({ PK, SK, VALUE, CHECKED }: ItemProps) => {
  const client = getClient();

  if (!PK || !SK || !VALUE || !CHECKED) throw new Error("Invalid Item");

  const createItemCommand = new PutCommand({
    TableName: itemsTable,
    Item: {
      PK,
      SK,
      VALUE,
      CHECKED,
    },
    ConditionExpression:
      "attribute_not_exists(PK) and attribute_not_exists(SK)",
  });

  return await client.send(createItemCommand);
};

// GET /items/{id}
export const getItem = async ({ email, id }: { email: string; id: string }) => {
  const client = getClient();

  if (!email || !id) throw new Error("Cannot get Item");

  const item = {
    PK: `USER#${email}`,
    SK: `ITEM#${id}`,
  };

  const getSingleitem = new GetCommand({
    TableName: itemsTable,
    Key: item,
  });

  return await client.send(getSingleitem);
};

// DELETE /items/{id}
export const deleteItem = async ({
  email,
  id,
}: {
  email: string;
  id: string;
}) => {
  const client = getClient();

  if (!id) throw new Error("Invalid ID");

  const item = {
    PK: `USER#${email}`,
    SK: `ITEM#${id}`,
  };

  const deleteItemCommand = new DeleteCommand({
    TableName: itemsTable,
    Key: item,
  });

  return await client.send(deleteItemCommand);
};

// PATCH /items/{id}
export const updateItem = async ({
  email,
  id,
  input,
}: {
  email: string;
  id: string;
  input: string;
}) => {
  const client = getClient();
  if (!email || !id || !input) throw new Error("Cannot Update Item");

  const body = JSON.parse(input);
  const itemKeys = Object.keys(body);

  const item = {
    PK: `USER#${email}`,
    SK: `RECIPE#${id}`,
  };

  const updateItem = new UpdateCommand({
    TableName: itemsTable,
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

  return await client.send(updateItem);
};
