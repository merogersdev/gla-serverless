import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { ARecord, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";

import type { ConfigProps } from "./config/config";

interface FrontendProps extends StackProps {
  stage: string;
  certificate: Certificate;
  zone: IHostedZone;
  config: ConfigProps;
}

export class frontendStack extends Stack {
  public readonly distribution;
  public readonly bucket;
  constructor(scope: Construct, id: string, props: FrontendProps) {
    super(scope, id, props);

    const { stage, certificate, zone, config } = props;

    const domain = config.DOMAIN;
    const subDomain =
      stage.toLowerCase() === "dev"
        ? `dev.${config.SUBDOMAIN}`
        : config.SUBDOMAIN;

    /* ------------------------------------- */
    /* --- --- --- Domain Config --- --- --- */
    /* ------------------------------------- */

    const siteDomain = `${subDomain}.${domain}`;

    /* --------------------------------- */
    /* --- --- --- S3 Bucket --- --- --- */
    /* --------------------------------- */

    const frontendBucket = new Bucket(this, `GLA-FrontendBucket-${stage}`, {
      bucketName: siteDomain,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "404.html",
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      `GLA-AccessIdentity-${stage}`,
      {}
    );

    frontendBucket.grantRead(originAccessIdentity);

    /* -------------------------------------- */
    /* --- --- --- CF Distribution--- --- --- */
    /* -------------------------------------- */

    const distribution = new Distribution(this, `GLA-CFDistribution-${stage}`, {
      certificate,
      domainNames: [siteDomain],
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(frontendBucket),
      },
    });

    /* -------------------------------------------- */
    /* --- --- --- Alias Record for App --- --- --- */
    /* -------------------------------------------- */

    new ARecord(this, `GLA-AliasRecord-${stage}`, {
      recordName: `${subDomain}`,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone,
    });
    this.distribution = distribution;
    this.bucket = frontendBucket;
  }
}
