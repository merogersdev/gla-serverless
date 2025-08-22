import { Stack, StackProps, RemovalPolicy, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AttributeType, Table, BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  Cors,
  LambdaIntegration,
  RestApi,
  ApiKeySourceType,
  CognitoUserPoolsAuthorizer,
  AuthorizationType,
} from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  UserPool,
  UserPoolClient,
  AccountRecovery,
  OAuthScope,
} from "aws-cdk-lib/aws-cognito";

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /* -------------------------------------- */
    /* --- --- --- DynamoDB Table --- --- --- */
    /* -------------------------------------- */

    const dbTable = new Table(this, "GLAServerlessTable", {
      partitionKey: { name: "PK", type: AttributeType.STRING },
      sortKey: { name: "SK", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    /* -------------------------------- */
    /* --- --- --- REST API --- --- --- */
    /* -------------------------------- */

    const api = new RestApi(this, "GLAServerlessRestAPI", {
      restApiName: "GLAServerlessRestAPI",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      apiKeySourceType: ApiKeySourceType.HEADER,
    });

    /* ---------------------------------------- */
    /* --- --- --- Lambda Functions --- --- --- */
    /* ---------------------------------------- */

    const itemsLambda = new NodejsFunction(this, "GLAServerlessItemsLambda", {
      entry: "services/backend/handlers/items.ts",
      handler: "handler",
      memorySize: 2048,
      runtime: Runtime.NODEJS_22_X,
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    const itemLambda = new NodejsFunction(this, "GLAServerlessItemLambda", {
      entry: "services/backend/handlers/item.ts",
      handler: "handler",
      memorySize: 2048,
      runtime: Runtime.NODEJS_22_X,
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    /* -------------------------------------------- */
    /* --- --- --- Database Permissions --- --- --- */
    /* -------------------------------------------- */

    dbTable.grantReadWriteData(itemsLambda);
    dbTable.grantReadWriteData(itemLambda);

    /* ------------------------------------------------ */
    /* --- --- --- Cognito User Pool & Auth --- --- --- */
    /* ------------------------------------------------ */

    // Cognito components:
    const userPool = new UserPool(this, "GLAServerlessUserPool", {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        username: false,
      },
      standardAttributes: {
        email: {
          required: true,
        },
        givenName: {
          required: true,
          mutable: true,
        },
        familyName: {
          required: true,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const userPoolClient = new UserPoolClient(this, "GLAServerlessClient", {
      userPool: userPool,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      generateSecret: false,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
        callbackUrls: ["http://localhost:5173"],
      },
    });

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "GLAServerlessUserAuthorizer",
      {
        cognitoUserPools: [userPool],
        identitySource: "method.request.header.Authorization",
      }
    );

    // outputs:
    new CfnOutput(this, "GLAServerlessUserPoolId", {
      value: userPool.userPoolId,
    });
    new CfnOutput(this, "GLAServerlessUserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });

    /* -------------------------------------------------- */
    /* --- --- --- API Routes, Methods & Auth --- --- --- */
    /* -------------------------------------------------- */

    const items = api.root.addResource("items");
    const item = items.addResource("{id}");

    const itemsIntegration = new LambdaIntegration(itemsLambda);
    const itemIntegration = new LambdaIntegration(itemLambda);

    // Use Cognito for User/API Auth
    const authOptions = {
      authorizer,
      authorizationType: AuthorizationType.COGNITO,
    };

    // ENDPOINT: /items
    items.addMethod("GET", itemsIntegration, authOptions);
    items.addMethod("POST", itemsIntegration, authOptions);

    // ENDPOINT: /items/{id}
    item.addMethod("GET", itemIntegration, authOptions);
    item.addMethod("PATCH", itemIntegration, authOptions);
    item.addMethod("DELETE", itemIntegration, authOptions);
  }
}
