import { Stack, StackProps, RemovalPolicy, CfnOutput, Lazy } from "aws-cdk-lib";
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
} from "aws-cdk-lib/aws-cognito";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { ARecord, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { ApiGatewayv2DomainProperties } from "aws-cdk-lib/aws-route53-targets";

interface BackendProps extends StackProps {
  appName: string;
  stage: string;
  domainName: string;
  subDomain: string;
  userPoolId: string;
  userPoolClientId: string;
  certificate: Certificate;
  zone: IHostedZone;
}

export class backendStack extends Stack {
  public readonly userPool;
  public readonly userPoolClient;
  public readonly apiDomain;
  constructor(scope: Construct, id: string, props: BackendProps) {
    super(scope, id, props);

    const {
      appName,
      stage,
      domainName,
      subDomain,
      userPoolId,
      userPoolClientId,
      certificate,
      zone,
    } = props;

    /* ----------------------------------------------- */
    /* --- --- --- Domain & Cert Lazy Load --- --- --- */
    /* ----------------------------------------------- */

    const domainParameter = StringParameter.valueFromLookup(this, domainName);

    const domain = Lazy.string({ produce: () => domainParameter });

    // Domain for API
    const apiDomain = new DomainName(this, `${appName}-DomainName`, {
      domainName: `api.${subDomain}.${domain}`,
      certificate,
      endpointType: EndpointType.EDGE,
    });

    // Route53 Alias
    new ARecord(this, `${appName}-DomainNameApiAlias`, {
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

    const dbTable = new Table(this, `${appName}-Table-${stage}`, {
      tableName: `${appName}-Table-${stage}`,
      partitionKey: { name: "PK", type: AttributeType.STRING },
      sortKey: { name: "SK", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    /* -------------------------------- */
    /* --- --- --- REST API --- --- --- */
    /* -------------------------------- */

    const api = new RestApi(this, `${appName}-RestAPI-${stage}`, {
      restApiName: `${appName}-RestAPI`,
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

    const itemsLambda = new NodejsFunction(
      this,
      `${appName}-ItemsLambda-${stage}`,
      {
        entry: "services/backend/handlers/items.ts",
        handler: "handler",
        memorySize: 2048,
        runtime: Runtime.NODEJS_22_X,
        environment: {
          TABLE_NAME: dbTable.tableName,
        },
      }
    );

    const itemLambda = new NodejsFunction(
      this,
      `${appName}-ItemLambda-${stage}`,
      {
        entry: "services/backend/handlers/item.ts",
        handler: "handler",
        memorySize: 2048,
        runtime: Runtime.NODEJS_22_X,
        environment: {
          TABLE_NAME: dbTable.tableName,
        },
      }
    );

    /* -------------------------------------------- */
    /* --- --- --- Database Permissions --- --- --- */
    /* -------------------------------------------- */

    dbTable.grantReadWriteData(itemsLambda);
    dbTable.grantReadWriteData(itemLambda);

    /* ------------------------------------------------ */
    /* --- --- --- Cognito User Pool & Auth --- --- --- */
    /* ------------------------------------------------ */

    const userPool = new UserPool(this, `${appName}-UserPool-${stage}`, {
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

    userPool.addDomain(`${appName}-UserPoolDomain-${stage}`, {
      cognitoDomain: {
        domainPrefix: `${appName.toLowerCase()}-${stage.toLowerCase()}`,
      },
    });

    const userPoolClient = new UserPoolClient(
      this,
      `${appName}-Client-${stage}`,
      {
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
          callbackUrls: [
            "http://localhost:5173",
            `https://${subDomain}.${domain}`,
          ],
        },
      }
    );

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      `${appName}-UserAuthorizer-${stage}`,
      {
        cognitoUserPools: [userPool],
        identitySource: "method.request.header.Authorization",
      }
    );

    // outputs:
    new CfnOutput(this, `${appName}-UserPoolId-${stage}`, {
      value: userPool.userPoolId,
    });
    new CfnOutput(this, `${appName}-UserPoolClientId-${stage}`, {
      value: userPoolClient.userPoolClientId,
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

    new BasePathMapping(this, `${appName}-BasePathMapping`, {
      domainName: apiDomain,
      restApi: api,
    });

    this.userPool = userPool;
    this.userPoolClient = userPoolClient;
    this.apiDomain = apiDomain;
  }
}
