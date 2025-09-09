import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";

interface FrontendProps extends StackProps {
  certificateArnParam: string;
  domain: string;
  subDomain: string;
}

export class frontendStack extends Stack {
  constructor(scope: Construct, id: string, props: FrontendProps) {
    super(scope, id, props);

    const { certificateArnParam, domain, subDomain } = props;

    /* ------------------------------------- */
    /* --- --- --- Domain Config --- --- --- */
    /* ------------------------------------- */

    const siteDomain = `${subDomain}.${domain}`;

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

    /* --------------------------------------- */
    /* --- --- --- SSL Certificate --- --- --- */
    /* --------------------------------------- */

    const certificateArn = StringParameter.valueForStringParameter(
      this,
      certificateArnParam
    );

    const certificate = Certificate.fromCertificateArn(
      this,
      "GLAServerlessDomainCertificate",
      certificateArn
    );

    /* -------------------------------------- */
    /* --- --- --- CF Distribution--- --- --- */
    /* -------------------------------------- */

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

    /* -------------------------------------------- */
    /* --- --- --- Alias Record for App --- --- --- */
    /* -------------------------------------------- */

    const zone = HostedZone.fromLookup(this, "GLAServerlessDomainZone", {
      domainName: domain,
    });

    new ARecord(this, "GLAServerlessAliasRecord", {
      recordName: siteDomain,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone,
    });
  }
}
