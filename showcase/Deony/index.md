# Deony

> Serverless personal media experience archive with Bedrock AI critic agent.

## Problem
Standard media trackers count consumption but ignore subjective impressions. AI chatbots embedded in consumer apps risk prompt injections, jailbreaks, and PII leaks.

## Solution
Serverless React 19 PWA on AWS with "Deonysus" AI critic agent. Secured with Amazon Bedrock Guardrails for prompt injection defense, real-time PII masking, and contextual grounding.

## Architecture
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, PWA.
- **Backend:** Express on AWS Lambda (ARM64), API Gateway v2, Cognito User Pools.
- **Generative AI:** Amazon Bedrock Runtime (Claude 3 Haiku / Nova) with Bedrock Guardrails.
- **Storage:** 4 on-demand DynamoDB tables with GSIs, S3 media bucket.
