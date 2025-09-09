import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@aws-sdk/credential-provider-env";

let client: DynamoDBDocumentClient | null = null;

export const getClient = (): DynamoDBDocumentClient => {
  if (client) return client;

  client = DynamoDBDocumentClient.from(
    new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: fromEnv(),
    })
  );

  return client;
};
