import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
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
  VerificationEmailStyle,
  AccountRecovery,
  DateTimeAttribute,
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
      runtime: Runtime.NODEJS_22_X,
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    const itemLambda = new NodejsFunction(this, "GLAServerlessItemLambda", {
      entry: "services/backend/handlers/item.ts",
      handler: "handler",
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

    const userPool = new UserPool(this, "GLAServerlessUserPool", {
      userPoolName: "GLAServerlessUserPool",
      signInAliases: {
        email: true,
      },
      selfSignUpEnabled: true,
      autoVerify: {
        email: true,
      },
      userVerification: {
        emailSubject: "You need to verify your email",
        emailBody: "Thanks for signing up Your verification code is {####}", //
        emailStyle: VerificationEmailStyle.CODE,
      },
      standardAttributes: {
        familyName: {
          mutable: false,
          required: true,
        },
        address: {
          mutable: true,
          required: false,
        },
      },
      customAttributes: {
        createdAt: new DateTimeAttribute(),
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    userPool.addClient("GLAServerlessAppClient", {
      userPoolClientName: "GLAServerlessAppClient",
      authFlows: {
        userPassword: true,
      },
    });

    const auth = new CognitoUserPoolsAuthorizer(
      this,
      "GLAServerlessAPIAuthorizer",
      {
        cognitoUserPools: [userPool],
      }
    );

    /* -------------------------------------------------- */
    /* --- --- --- API Routes, Methods & Auth --- --- --- */
    /* -------------------------------------------------- */

    const items = api.root.addResource("items");
    const item = items.addResource("{id}");

    const itemsIntegration = new LambdaIntegration(itemsLambda);
    const itemIntegration = new LambdaIntegration(itemLambda);

    // Use Cognito for User/API Auth
    const authOptions = {
      authorizer: auth,
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
