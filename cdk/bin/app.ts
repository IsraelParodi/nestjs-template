#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NestjsTemplateStack } from '../lib/nestjs-template-stack';

const app = new cdk.App();

const environment = app.node.tryGetContext('environment') || 'dev';
const appName = app.node.tryGetContext('appName') || 'nestjs-template';

new NestjsTemplateStack(app, `${appName}-${environment}-stack`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  environment,
  appName,
});

app.synth();
