#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { backendStack } from "../lib/backendStack";
import { frontendStack } from "../lib/frontendStack";

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

new backendStack(app, "GLAServerlessBackendStack", {
  env,
});

new frontendStack(app, "GLAServerlessFrontendStack", {
  env,
  certificateArnParameter: "/glaserverless/prod/certificatearn",
  domainParameter: "/glaserverless/prod/domain",
  subdomainParameter: "/glaserverless/prod/subdomain",
});
