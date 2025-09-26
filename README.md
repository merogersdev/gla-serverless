# GLA Serverless

![GLA Serverless Screenshot](https://github.com/merogersdev/gla-serverless/blob/dev/screenshot.png?raw=true)

## Quick Summary

GLA Serverless is a full-stack grocery list application built to utilize as many AWS cloud services in deployment as possible from hosting, API, authentication and CI/CD pipeline. This app does not require servers or docker containers and requires no upkeep beyond package updates. The deployed application is meant to be simple, and serves as a testbed for AWS services.

## Goal

The goal of GLA Serverless was to gain a deeper understanding of the AWS CDK to deploy Infrastructure as Code, DevOps practices, DynamoDB Single Table Design and the Cognito user authentication service.

## Core Features

- Complete IaC experience utilizing the AWS CDK and TypeScript
- Frontend is served by AWS S3 and CloudFront
- User Authentication via email or Google with AWS Cognito
- SSL Certificate generated automatially in the required region
- Email/Password user registration requires confirmation code
- Rest API with authenticated routes and AWS Lambda Endpoints
- Application Data is stored in DynamoDB with Single Table Design
- CI/CD Pipeline for Development and Production deployments
- Each Pipeline requires manual approval to deploy

## Requirements

- AWS account
- Google Developer account
- GitHub Account
- Domain with DNS servers set to AWS Route53 Hosted Zone

## Scripts

- `npm run install-frontend` Installs necessary frontend modules
- `npm run build-frontend` Builds frontend for deployment
- `npm run develop-frontend` Starts frontend development server
- `npm run deploy-dev` Deploys all infrastructure for development
- `npm run deploy-prod` Deploys all infrastructure for production

## Initial Setup

To begin, make sure you are signed up for an AWS account, Google Developer account, GitHub account and have an existing domain registered and pointed to the DNS servers provided by a Route53 Hosted Zone.

1. Clone repo from [https://github.com/merogersdev/gla-serverless/](https://github.com/merogersdev/gla-serverless/)
2. Install and configure the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) on your computer.
3. Install the [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting-started.html) via npm.
4. In the Google Developer Console, under APIs and Services create OAuth 2.0 Client ID Credentials for this application. Under Application type, select Web application, give it a name, and add the following, and click save. This step may need 5-10 minutes to take effect.

### Authorized JavaScript origins:

- https://[cognito-domain].auth.[region].amazoncognito.com
- https://[cognito-domain].auth.[region].amazoncognito.com
- http://127.0.0.1:5173
- https://dev.glas.yourdomain.com
- https://glas.yourdomain.com

### Authorized redirect URIs

- https://[cognito-domain].auth.[region].amazoncognito.com/oauth2/idpresponse
- https://[cognito-domain].auth.[region].amazoncognito.com/oauth2/idpresponse

5. In GitHub Developer Settings, create a Personal access token with 'repo' and 'admin:repo_hook' scopes.
6. In the AWS Console create a secret within the Secrets manager, secret type 'Other type of secret' named 'github-token' and copy the github token to the plaintext field below.
7. Copy .env.example to .env in the root directory and fill in the application domain name, AWS Hosted Zone ID, Google OAuth credentials and GitHub information.

## Deployment

### Synth

- `npm run synth-dev` Synthesize CDK Development Stack
- `npm run synth-dev` Synthesize CDK Production Stack

### Development

`npm run deploy-dev` to deploy all infrastructure stacks

### Production

`npm run deploy-prod` to deploy all infrastructure stacks

## Tags

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white)
![AmazonDynamoDB](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=Amazon%20DynamoDB&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Context-API](https://img.shields.io/badge/Context--Api-000000?style=for-the-badge&logo=react)
![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
