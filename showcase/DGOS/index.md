# DGOS — Digital Guest Ordering System

> Production restaurant ordering platform on AWS. ~$0.80/month. 255+ unit tests.

## Problem

Restaurants need a contactless ordering flow that works across customer phones, kitchen displays, and admin dashboards — without expensive POS hardware or monthly SaaS fees.

## Solution

Three SPAs (React + Vite) backed by a fully serverless AWS stack, deployed via CDK TypeScript. Customers scan a QR code → browse the menu → place an order → the kitchen sees it in real time.

## Architecture

- **Customer SPA** — menu browsing, cart, checkout, order status
- **Kitchen SPA** — live queue of incoming orders with WebSocket push
- **Admin SPA** — manage menu items, users, and order history
- **Cognito** — user pools for customer, staff, and admin roles
- **API Gateway (REST + WebSocket)** — all CRUD + real-time kitchen updates
- **Lambda (Node.js/TypeScript)** — business logic, 255+ unit tests
- **DynamoDB** — single-table design with GSIs
- **S3 + CloudFront** — three separate distributions, one per SPA
- **AWS CDK (TypeScript)** — every resource defined as code

## Key Decisions

- **Single-table DynamoDB design** over separate tables per entity: reduced read/write costs and simplified GSI management
- **WebSockets for kitchen** instead of polling: lower latency, lower cost at scale
- **Separate CloudFront per SPA** instead of path-based routing: each SPA can be cached, deployed, and versioned independently
- **Cost optimization**: all services pay-per-request, no always-on compute. ~$0.80/month at low traffic

## What I learned

- DynamoDB single-table design and GSIs for complex query patterns
- WebSocket API Gateway lifecycle management ($connect, $disconnect, $default)
- Cognito JWT verification in Lambda authorizers
- CDK stack organization across multiple SPAs sharing a common backend
- Real production cost tracking on AWS (the $0.80 figure is verified, not estimated)
