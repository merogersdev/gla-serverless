import { SecretValue, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Distribution } from "aws-cdk-lib/aws-cloudfront";
import {
  PipelineProject,
  BuildSpec,
  LinuxBuildImage,
  ComputeType,
} from "aws-cdk-lib/aws-codebuild";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  CodeBuildAction,
  GitHubSourceAction,
  ManualApprovalAction,
  S3DeployAction,
} from "aws-cdk-lib/aws-codepipeline-actions";
import { Artifact, Pipeline } from "aws-cdk-lib/aws-codepipeline";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { DomainName } from "aws-cdk-lib/aws-apigateway";

import type { ConfigProps } from "./config/config";

interface PipelineProps extends StackProps {
  stage: string;
  distribution: Distribution;
  bucket: Bucket;
  userPool: UserPool;
  userPoolClient: UserPoolClient;
  apiDomain: DomainName;
  config: ConfigProps;
}

export class pipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, props);

    const {
      distribution,
      bucket,
      stage,
      userPool,
      userPoolClient,
      apiDomain,
      config,
    } = props;

    const githubAccount = config.GITHUB_ACCOUNT;
    const githubRepo = config.GITHUB_REPO;
    const domain = config.DOMAIN;
    const subDomain =
      stage.toLowerCase() === "dev"
        ? `dev.${config.SUBDOMAIN}`
        : config.SUBDOMAIN;

    const branch = stage.toLowerCase() === "prod" ? "main" : "dev";

    const githubToken = SecretValue.secretsManager("github-token");

    const siteDomain = `${subDomain}.${domain}`;

    /* ----------------------------------------- */
    /* --- --- --- CodeBuild Project --- --- --- */
    /* ----------------------------------------- */

    // Cloudfront Invalidation Step
    const invalidateBuildProject = new PipelineProject(
      this,
      `GLAS-Invalidation-${stage}`,
      {
        buildSpec: BuildSpec.fromObject({
          version: "0.2",
          phases: {
            build: {
              commands: [
                'aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths "/*"',
              ],
            },
          },
        }),
        environmentVariables: {
          CLOUDFRONT_ID: { value: distribution.distributionId },
        },
      }
    );

    // CF Distribution ARN
    const appDistributionArn = `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`;

    // Add role to CF Distribution
    invalidateBuildProject.addToRolePolicy(
      new PolicyStatement({
        resources: [appDistributionArn],
        actions: ["cloudfront:CreateInvalidation"],
      })
    );

    // Code and Build Artifacts
    const githubSource = new Artifact(`GLAS-GHSource`);
    const buildArtifact = new Artifact(`GLAS-BuildArtifact-${stage}`);

    // CI/CD Pipeline
    new Pipeline(this, `GLAS-BuildPipeline-${stage}`, {
      pipelineName: `GLAS-Invalidation-${stage}`,
      restartExecutionOnUpdate: true,
      stages: [
        {
          stageName: "Source",
          actions: [
            // Pull Source From GitHub Repo
            new GitHubSourceAction({
              actionName: "GitHub_Source",
              owner: githubAccount,
              repo: githubRepo,
              oauthToken: githubToken,
              output: githubSource,
              branch,
            }),
          ],
        },
        {
          stageName: "Build",
          actions: [
            // Build Next.js App from GitHub Source
            new CodeBuildAction({
              actionName: `GLAS-Build-${stage}`,
              project: new PipelineProject(this, `GLAS-BuildProject-${stage}`, {
                environment: {
                  buildImage: LinuxBuildImage.STANDARD_7_0,
                  computeType: ComputeType.SMALL,
                },
                projectName: `GLAS-Project-${stage}`,
                buildSpec: BuildSpec.fromObject({
                  version: "0.2",
                  phases: {
                    install: {
                      "runtime-versions": {
                        nodejs: 22,
                      },
                      commands: ["npm run install-frontend"],
                    },
                    build: {
                      commands: ["npm run build-frontend"],
                    },
                  },
                  artifacts: {
                    // Important: files HAS to be first
                    files: ["**/*"],
                    "discard-paths": "no",
                    "base-directory": "services/frontend/build",
                  },
                }),
                environmentVariables: {
                  VITE_USER_POOL_ID: { value: userPool.userPoolId },
                  VITE_USER_POOL_CLIENT_ID: {
                    value: userPoolClient.userPoolClientId,
                  },
                  VITE_USER_POOL_DOMAIN: {
                    value: userPool.userPoolProviderUrl,
                  },
                  VITE_API_BASE_URL: {
                    value: `https://${siteDomain}`,
                  },
                  VITE_API_API_BASE_URL: {
                    value: apiDomain.domainName,
                  },
                },
              }),
              input: githubSource,
              outputs: [buildArtifact],
            }),
          ],
        },
        {
          stageName: "Approve",
          actions: [
            new ManualApprovalAction({
              actionName: `GLAS-ApproveDeployment-${stage}`,
            }),
          ],
        },
        {
          stageName: "Deploy",
          actions: [
            // 1. Deploy Next.js App to S3
            new S3DeployAction({
              actionName: `GLAS-DeployToS3-${stage}`,
              input: buildArtifact,
              bucket,
              runOrder: 1,
            }),
            // 2. Create CloudFront Invalidation
            new CodeBuildAction({
              actionName: `GLAS-CodeBuildInvalidate-${stage}`,
              project: invalidateBuildProject,
              input: buildArtifact,
              runOrder: 2,
            }),
          ],
        },
      ],
    });
  }
}
