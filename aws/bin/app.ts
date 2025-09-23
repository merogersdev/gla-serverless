#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { backendStack } from "../lib/backendStack";
import { frontendStack } from "../lib/frontendStack";
import { certificateStack } from "../lib/certificateStack";
import { pipelineStack } from "../lib/pipelineStack";

import { config } from "../config/config";

const app = new cdk.App();

/* ----------------------------------------- */
/* --- --- --- Certificate Stack --- --- --- */
/* ----------------------------------------- */

const certificate = new certificateStack(
  app,
  `${config.app.appName}-CertificateStack`,
  {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: "us-east-1",
    },
    crossRegionReferences: true,
    subDomain: config.app.subDomain,
    appName: config.app.appName,
    domainName: config.ssm.domain,
    hostedZoneId: config.ssm.zoneId,
  }
);

/* ------------------------------------- */
/* --- --- --- Backend Stack --- --- --- */
/* ------------------------------------- */

const backend = new backendStack(
  app,
  `${config.app.appName}-BackendStack-${config.app.stageName}`,
  {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
    crossRegionReferences: true,
    certificate: certificate.appCertificate,
    zone: certificate.appZone,
    appName: config.app.appName,
    stage: config.app.stageName,
    subDomain: config.app.subDomain,
    domainName: config.ssm.domain,
    googleClientId: config.google.clientId,
    googleClientSecret: config.google.clientSecret,
  }
);

/* -------------------------------------- */
/* --- --- --- Frontend Stack --- --- --- */
/* -------------------------------------- */

const frontend = new frontendStack(
  app,
  `${config.app.appName}-FrontendStack-${config.app.stageName}`,
  {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
    crossRegionReferences: true,
    appName: config.app.appName,
    stage: config.app.stageName,
    subDomain: config.app.subDomain,
    domainName: config.ssm.domain,
    zone: certificate.appZone,
    certificate: certificate.appCertificate,
  }
);

/* ----------------------------------------- */
/* --- --- --- Pipeline Stack --- --- --- */
/* ----------------------------------------- */

new pipelineStack(app, `${config.app.appName}-PipelineStack`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  appName: config.app.appName,
  stage: config.app.stageName,
  bucket: frontend.bucket,
  distribution: frontend.distribution,
  githubToken: config.ssm.githubToken,
  githubAccount: config.ssm.githubAccount,
  githubRepo: config.ssm.githubRepo,
  apiDomain: backend.apiDomain,
  userPool: backend.userPool,
  userPoolClient: backend.userPoolClient,
});
