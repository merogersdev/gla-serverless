import { Stack, StackProps, RemovalPolicy, CfnOutput } from "aws-cdk-lib";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { StringParameter } from "aws-cdk-lib/aws-ssm";

interface FrontendProps extends StackProps {
  certificateArnParameter: string;
  domainParameter: string;
  subdomainParameter: string;
}

export class frontendStack extends Stack {
  constructor(scope: Construct, id: string, props: FrontendProps) {
    super(scope, id, props);

    const { certificateArnParameter, domainParameter, subdomainParameter } =
      props;

    /* ------------------------------------- */
    /* --- --- --- Domain Config --- --- --- */
    /* ------------------------------------- */

    const certificateArn = StringParameter.valueForStringParameter(
      this,
      certificateArnParameter
    );

    const domainName = StringParameter.valueForStringParameter(
      this,
      domainParameter
    );

    const subDomain = StringParameter.valueForStringParameter(
      this,
      subdomainParameter
    );

    const siteDomain = `${subDomain}.${domainName}`;

    /* --------------------------------- */
    /* --- --- --- S3 Bucket --- --- --- */
    /* --------------------------------- */

    const frontendBucket = new Bucket(this, "GLAServerlessFrontendBucket", {
      bucketName: siteDomain,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "404.html",
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "GLAServerlessFrontendAccessIdentity",
      {}
    );

    frontendBucket.grantRead(originAccessIdentity);

    const certificate = Certificate.fromCertificateArn(
      this,
      "GLAServerlessDomainCertificate",
      certificateArn
    );

    const distribution = new Distribution(this, "GLAServerlessCFDistribution", {
      certificate,
      domainNames: [siteDomain],
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(frontendBucket),
      },
    });

    new BucketDeployment(this, "GLAServerlessBucketDeployment", {
      sources: [Source.asset("./services/frontend/build")],
      destinationBucket: frontendBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
