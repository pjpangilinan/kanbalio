#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RagStack } from '../lib/rag-stack';

const app = new cdk.App();

new RagStack(app, 'KanbalioRagStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
  description: 'Kanbalio portfolio RAG chat backend',
});
