import { Stack, StackProps, SecretValue, Lazy } from "aws-cdk-lib";
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
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { DomainName } from "aws-cdk-lib/aws-apigateway";

interface PipelineProps extends StackProps {
  appName: string;
  stage: string;
  distribution: Distribution;
  bucket: Bucket;
  githubToken: string;
  githubAccount: string;
  githubRepo: string;
  userPool: UserPool;
  userPoolClient: UserPoolClient;
  apiDomain: DomainName;
}

export class pipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, props);

    const {
      distribution,
      bucket,
      githubAccount,
      githubRepo,
      appName,
      stage,
      userPool,
      userPoolClient,
      apiDomain,
    } = props;

    const githubAccountParam = StringParameter.valueFromLookup(
      this,
      githubAccount
    );

    const account = Lazy.string({ produce: () => githubAccountParam });

    const githubRepoParam = StringParameter.valueFromLookup(this, githubRepo);

    const repo = Lazy.string({ produce: () => githubRepoParam });

    /* ----------------------------------------- */
    /* --- --- --- CodeBuild Project --- --- --- */
    /* ----------------------------------------- */

    // Cloudfront Invalidation Step
    const invalidateBuildProject = new PipelineProject(
      this,
      `${appName}-Invalidation-${stage}`,
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
    const githubSource = new Artifact(`${appName}-GHSource`);
    const buildArtifact = new Artifact(`${appName}-BuildArtifact-${stage}`);

    // CI/CD Pipeline
    new Pipeline(this, `${appName}-BuildPipeline-${stage}`, {
      pipelineName: `${appName}-Invalidation-${stage}`,
      restartExecutionOnUpdate: true,
      stages: [
        {
          stageName: "Source",
          actions: [
            // Pull Source From GitHub Repo
            new GitHubSourceAction({
              actionName: "GitHub_Source",
              owner: account,
              repo: repo,
              oauthToken: SecretValue.secretsManager("github-token"),
              output: githubSource,
              branch: "main",
            }),
          ],
        },
        {
          stageName: "Build",
          actions: [
            // Build Next.js App from GitHub Source
            new CodeBuildAction({
              actionName: `${appName}-Build-${stage}`,
              project: new PipelineProject(
                this,
                `${appName}-BuildProject-${stage}`,
                {
                  environment: {
                    buildImage: LinuxBuildImage.STANDARD_7_0,
                    computeType: ComputeType.SMALL,
                  },
                  projectName: `${appName}-Project-${stage}`,
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
                    VITE_API_BASE_URL: {
                      value: apiDomain.domainName,
                    },
                  },
                }
              ),
              input: githubSource,
              outputs: [buildArtifact],
            }),
          ],
        },
        {
          stageName: "Approve",
          actions: [
            new ManualApprovalAction({
              actionName: `${appName}-ApproveDeployment-${stage}`,
            }),
          ],
        },
        {
          stageName: "Deploy",
          actions: [
            // 1. Deploy Next.js App to S3
            new S3DeployAction({
              actionName: `${appName}-DeployToS3-${stage}`,
              input: buildArtifact,
              bucket,
              runOrder: 1,
            }),
            // 2. Create CloudFront Invalidation
            new CodeBuildAction({
              actionName: `${appName}-CodeBuildInvalidate-${stage}`,
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
