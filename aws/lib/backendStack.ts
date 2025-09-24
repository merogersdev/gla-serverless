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
  EndpointType,
  BasePathMapping,
  DomainName,
} from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  UserPool,
  UserPoolClient,
  AccountRecovery,
  OAuthScope,
  UserPoolIdentityProviderGoogle,
  ProviderAttribute,
} from "aws-cdk-lib/aws-cognito";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { ARecord, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { ApiGatewayv2DomainProperties } from "aws-cdk-lib/aws-route53-targets";

import type { ConfigProps } from "./config/config";

interface BackendProps extends StackProps {
  stage: string;
  certificate: Certificate;
  zone: IHostedZone;
  config: ConfigProps;
}

export class backendStack extends Stack {
  public readonly userPool;
  public readonly userPoolClient;
  public readonly apiDomain;
  constructor(scope: Construct, id: string, props: BackendProps) {
    super(scope, id, props);

    const { certificate, zone, stage, config } = props;

    const domain = config.DOMAIN;
    const subDomain =
      stage.toLowerCase() === "dev"
        ? `dev.${config.SUBDOMAIN}`
        : config.SUBDOMAIN;

    const googleClientId = config.GOOGLE_CLIENT_ID;
    const googleClientSecret = config.GOOGLE_CLIENT_SECRET;

    const callbackUrl = config.COGNITO_CALLBACK_URL;
    const signoutUrl = config.COGNITO_SIGNOUT_URL;

    /* ------------------------------- */
    /* --- --- --- Secrets --- --- --- */
    /* ------------------------------- */

    // Domain for API
    const apiDomain = new DomainName(this, `GLAS-DomainName`, {
      domainName: `api.${subDomain}.${domain}`,
      certificate,
      endpointType: EndpointType.EDGE,
    });

    // Route53 Alias
    new ARecord(this, `GLAS-DomainNameApiAlias`, {
      recordName: `api.${subDomain}`,
      zone,
      target: RecordTarget.fromAlias(
        new ApiGatewayv2DomainProperties(
          apiDomain.domainNameAliasDomainName,
          apiDomain.domainNameAliasHostedZoneId
        )
      ),
    });

    /* -------------------------------------- */
    /* --- --- --- DynamoDB Table --- --- --- */
    /* -------------------------------------- */

    const dbTable = new Table(this, `GLAS-Table-${stage}`, {
      tableName: `GLAS-Table-${stage}`,
      partitionKey: { name: "PK", type: AttributeType.STRING },
      sortKey: { name: "SK", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    /* -------------------------------- */
    /* --- --- --- REST API --- --- --- */
    /* -------------------------------- */

    const api = new RestApi(this, `GLAS-RestAPI-${stage}`, {
      restApiName: `GLAS-RestAPI-${stage}`,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      deploy: true,
      deployOptions: {
        stageName: stage,
      },
      apiKeySourceType: ApiKeySourceType.HEADER,
      endpointTypes: [EndpointType.EDGE],
    });

    /* ---------------------------------------- */
    /* --- --- --- Lambda Functions --- --- --- */
    /* ---------------------------------------- */

    const itemsLambda = new NodejsFunction(this, `GLAS-ItemsLambda-${stage}`, {
      entry: "services/backend/handlers/items.ts",
      handler: "handler",
      memorySize: 2048,
      runtime: Runtime.NODEJS_22_X,
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    const itemLambda = new NodejsFunction(this, `GLAS-ItemLambda-${stage}`, {
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

    const userPool = new UserPool(this, `GLAS-UserPool-${stage}`, {
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

    userPool.addDomain(`GLAS-UserPoolDomain-${stage}`, {
      cognitoDomain: {
        domainPrefix: `glas-${stage.toLowerCase()}`,
      },
    });

    const provider = new UserPoolIdentityProviderGoogle(
      this,
      `GLAS-IDP-Google`,
      {
        userPool: userPool,
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        scopes: ["email", "openid", "profile"],
        attributeMapping: {
          email: ProviderAttribute.GOOGLE_EMAIL,
          givenName: ProviderAttribute.GOOGLE_GIVEN_NAME,
          familyName: ProviderAttribute.GOOGLE_FAMILY_NAME,
          profilePicture: ProviderAttribute.GOOGLE_PICTURE,
        },
      }
    );

    const userPoolClient = new UserPoolClient(this, `GLAS-Client-${stage}`, {
      userPool: userPool,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      generateSecret: false,
      oAuth: {
        scopes: [
          OAuthScope.EMAIL,
          OAuthScope.OPENID,
          OAuthScope.PROFILE,
          OAuthScope.COGNITO_ADMIN,
        ],
        callbackUrls: [callbackUrl],
        logoutUrls: [signoutUrl],
      },
    });

    userPool.registerIdentityProvider(provider);
    provider.node.addDependency(userPool);

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      `GLAS-UserAuthorizer-${stage}`,
      {
        cognitoUserPools: [userPool],
        identitySource: "method.request.header.Authorization",
      }
    );

    // outputs:
    new CfnOutput(this, `GLAS-UserPoolId-${stage}`, {
      value: userPool.userPoolId,
    });
    new CfnOutput(this, `GLAS-UserPoolClientId-${stage}`, {
      value: userPoolClient.userPoolClientId,
    });
    new CfnOutput(this, `GLAS-APIDomainName-${stage}`, {
      value: apiDomain.domainName,
    });

    /* -------------------------------------------------- */
    /* --- --- --- API Routes, Methods & Auth --- --- --- */
    /* -------------------------------------------------- */

    const items = api.root.addResource("items");
    const item = api.root.addResource("item");

    const itemId = item.addResource("{id}");

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

    // ENDPOINT: /item/{id}
    itemId.addMethod("GET", itemIntegration, authOptions);
    itemId.addMethod("PATCH", itemIntegration, authOptions);
    itemId.addMethod("DELETE", itemIntegration, authOptions);

    /* ----------------------------------------- */
    /* --- --- --- Base Path Mapping --- --- --- */
    /* ----------------------------------------- */

    new BasePathMapping(this, `GLAS-BasePathMapping`, {
      domainName: apiDomain,
      restApi: api,
    });

    this.userPool = userPool;
    this.userPoolClient = userPoolClient;
    this.apiDomain = apiDomain;
  }
}
