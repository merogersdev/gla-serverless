import { Stack, StackProps, RemovalPolicy, Lazy } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { ARecord, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";

interface FrontendProps extends StackProps {
  appName: string;
  stage: string;
  domainName: string;
  subDomain: string;
  certificate: Certificate;
  zone: IHostedZone;
}

export class frontendStack extends Stack {
  public readonly distribution;
  public readonly bucket;
  constructor(scope: Construct, id: string, props: FrontendProps) {
    super(scope, id, props);

    const { appName, stage, domainName, subDomain, certificate, zone } = props;

    const domainParameter = StringParameter.valueFromLookup(this, domainName);

    const domain = Lazy.string({ produce: () => domainParameter });

    /* ------------------------------------- */
    /* --- --- --- Domain Config --- --- --- */
    /* ------------------------------------- */

    const siteDomain = `${subDomain}.${domain}`;

    /* --------------------------------- */
    /* --- --- --- S3 Bucket --- --- --- */
    /* --------------------------------- */

    const frontendBucket = new Bucket(
      this,
      `${appName}-FrontendBucket-${stage}`,
      {
        bucketName: siteDomain,
        websiteIndexDocument: "index.html",
        websiteErrorDocument: "404.html",
        publicReadAccess: false,
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      }
    );

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      `${appName}-AccessIdentity-${stage}`,
      {}
    );

    frontendBucket.grantRead(originAccessIdentity);

    /* -------------------------------------- */
    /* --- --- --- CF Distribution--- --- --- */
    /* -------------------------------------- */

    const distribution = new Distribution(
      this,
      `${appName}-CFDistribution-${stage}`,
      {
        certificate,
        domainNames: [siteDomain],
        defaultBehavior: {
          origin: S3BucketOrigin.withOriginAccessControl(frontendBucket),
        },
      }
    );

    /* -------------------------------------------- */
    /* --- --- --- Alias Record for App --- --- --- */
    /* -------------------------------------------- */

    new ARecord(this, `${appName}-AliasRecord-${stage}`, {
      recordName: `${subDomain}`,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone,
    });
    this.distribution = distribution;
    this.bucket = frontendBucket;
  }
}
