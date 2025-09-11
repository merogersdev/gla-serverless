import { Stack, StackProps, Lazy } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { StringParameter } from "aws-cdk-lib/aws-ssm";

interface CertificateProps extends StackProps {
  domainName: string;
  subDomain: string;
  hostedZoneId: string;
  appName: string;
}

export class certificateStack extends Stack {
  public readonly appCertificate;
  public readonly appZone;
  constructor(scope: Construct, id: string, props: CertificateProps) {
    super(scope, id, props);

    const { domainName, subDomain, hostedZoneId, appName } = props;

    const domainParameter = StringParameter.valueFromLookup(this, domainName);

    const domain = Lazy.string({ produce: () => domainParameter });

    const zoneParameter = StringParameter.valueFromLookup(this, hostedZoneId);

    const zone = Lazy.string({ produce: () => zoneParameter });

    /* --------------------------------------- */
    /* --- --- --- SSL Certificate --- --- --- */
    /* --------------------------------------- */

    const appZone = HostedZone.fromHostedZoneAttributes(
      this,
      `${appName}-AppDomain`,
      {
        hostedZoneId: zone,
        zoneName: domain,
      }
    );

    // Generate SSL Certificate
    const appCertificate = new Certificate(this, `${appName}-AppCertificate`, {
      domainName: domain,
      subjectAlternativeNames: [
        `${subDomain}.${domain}`,
        `api.${subDomain}.${domain}`,
      ],
      certificateName: `${appName}-AppCertificate`,
      validation: CertificateValidation.fromDns(appZone),
    });

    this.appCertificate = appCertificate;
    this.appZone = appZone;
  }
}
