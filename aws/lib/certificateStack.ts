import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone } from "aws-cdk-lib/aws-route53";

import type { ConfigProps } from "./config/config";

interface CertificateProps extends StackProps {
  stage: string;
  config: ConfigProps;
}

export class certificateStack extends Stack {
  public readonly appCertificate;
  public readonly appZone;
  constructor(scope: Construct, id: string, props: CertificateProps) {
    super(scope, id, props);

    const { stage, config } = props;

    const zoneId = config.ZONE_ID;
    const domain = config.DOMAIN;
    const subDomain =
      stage.toLowerCase() === "dev"
        ? `dev.${config.SUBDOMAIN}`
        : config.SUBDOMAIN;

    /* --------------------------------------- */
    /* --- --- --- SSL Certificate --- --- --- */
    /* --------------------------------------- */

    const appZone = HostedZone.fromHostedZoneAttributes(
      this,
      "GLAS-AppDomain",
      {
        hostedZoneId: zoneId,
        zoneName: domain,
      }
    );

    // Generate SSL Certificate
    const appCertificate = new Certificate(this, "GLAS-AppCertificate", {
      domainName: domain,
      subjectAlternativeNames: [
        `${subDomain}.${domain}`,
        `api.${subDomain}.${domain}`,
      ],
      certificateName: "GLAS-AppCertificate",
      validation: CertificateValidation.fromDns(appZone),
    });

    this.appCertificate = appCertificate;
    this.appZone = appZone;
  }
}
