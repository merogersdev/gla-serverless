#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { backendStack } from "../lib/stacks/backend";
import { frontendStack } from "../lib/stacks/frontend";
import { certificateStack } from "../lib/stacks/certificate";
import { pipelineStack } from "../lib/stacks/pipeline";
import { getConfig } from "../lib/config/config";

const app = new cdk.App();

const stage = app.node.tryGetContext("STAGE").toUpperCase() as string;

const config = getConfig();

/* ----------------------------------------- */
/* --- --- --- Certificate Stack --- --- --- */
/* ----------------------------------------- */

const certificate = new certificateStack(app, `GLAS-CertificateStack`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  },
  stage: stage,
  crossRegionReferences: true,
  config,
});

/* ------------------------------------- */
/* --- --- --- Backend Stack --- --- --- */
/* ------------------------------------- */

const backend = new backendStack(app, `GLAS-BackendStack-${stage}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  stage: stage,
  crossRegionReferences: true,
  certificate: certificate.appCertificate,
  zone: certificate.appZone,
  config,
});

/* -------------------------------------- */
/* --- --- --- Frontend Stack --- --- --- */
/* -------------------------------------- */

const frontend = new frontendStack(app, `GLAS-FrontendStack-${stage}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  stage: stage,
  crossRegionReferences: true,
  certificate: certificate.appCertificate,
  zone: certificate.appZone,
  config,
});

/* ----------------------------------------- */
/* --- --- --- Pipeline Stack --- --- --- */
/* ----------------------------------------- */

new pipelineStack(app, `GLAS-PipelineStack-${stage}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  stage: stage,
  bucket: frontend.bucket,
  distribution: frontend.distribution,
  apiDomain: backend.apiDomain,
  userPool: backend.userPool,
  userPoolClient: backend.userPoolClient,
  config,
});
