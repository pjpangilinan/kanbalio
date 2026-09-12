# AreWeUpYet

> Multi-tenant synthetic uptime monitoring SaaS in Go on AWS.

## Problem
Modern web services need automated synthetic probing and public incident reporting without risking Server-Side Request Forgery (SSRF) against internal VPC services and cloud metadata endpoints.

## Solution
Go-based probing engine running on AWS Lambda with EventBridge 1-minute cron triggers, custom socket-dial SSRF defense, HMAC-SHA256 webhooks, and public status pages with 30s live polling.

## Architecture
- **Go Lambda Dispatcher:** Probes target URLs via custom dialer blocking DNS rebinding and `169.254.0.0/16`.
- **DynamoDB:** Multi-tenant endpoint configs, probe records with 90-day TTL, and incident state.
- **Go Lambda Notifier:** Dispatches HMAC-SHA256 signed webhooks with exponential backoff.
- **Amplify Gen 2 / CDK:** Complete infrastructure as code.
