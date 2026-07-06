# DGOS — Digital Guest Ordering System

> Production restaurant ordering platform on AWS. Customers scan QR codes, browse menus, place orders, and see real-time kitchen status updates. Runs at **~$0.80/month** with **255+ unit tests** and IaC via AWS CDK.

<p>
  <img src="https://img.shields.io/badge/status-production-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/cost-~%240.80%2Fmonth-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/tests-255%2B%20passing-success?style=flat-square" />
</p>

<p>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-4338CA?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS%20Lambda-FF9900?style=for-the-badge&logo=awslambda&logoColor=white" />
  <img src="https://img.shields.io/badge/API%20Gateway-FF4F8B?style=for-the-badge&logo=amazonapigateway&logoColor=white" />
  <img src="https://img.shields.io/badge/DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white" />
  <img src="https://img.shields.io/badge/S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white" />
  <img src="https://img.shields.io/badge/CloudFront-FF4F8B?style=for-the-badge&logo=amazoncloudfront&logoColor=white" />
  <img src="https://img.shields.io/badge/Cognito-DD344C?style=for-the-badge&logo=amazoncognito&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS%20CDK-FF9900?style=for-the-badge&logo=amazonwebservices&logoColor=white" />
</p>

## 🔗 Links
- **Repo:** https://github.com/pjpangilinan/dgos
- **Customer SPA:** https://dyk5iqkiyeb4c.cloudfront.net
- **Kitchen SPA:** https://dkykxlzz4d0zi.cloudfront.net
- **Admin SPA:** https://d2n6ostm7w9jzu.cloudfront.net

---

## 📸 Screenshots

> Replace with real screenshots: customer menu, order placed, kitchen queue, admin dashboard.

| Customer Menu | Order Placed | Kitchen Queue | Admin Dashboard |
|---|---|---|---|
| _screenshot_ | _screenshot_ | _screenshot_ | _screenshot_ |

---

## 🏗 Architecture

```
   ┌────────────────────────────────────────────────────────────┐
   │                  Customer QR Code Scan                      │
   └─────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
   ┌────────────────────────────────────────────────────────────┐
   │        CloudFront × 3 (one per SPA)  ·  S3 (static assets)  │
   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
   │  │  Customer    │  │   Kitchen    │  │     Admin        │   │
   │  │     SPA      │  │     SPA      │  │      SPA         │   │
   │  │ (menu/order) │  │ (live queue) │  │ (manage menu/    │   │
   │  │              │  │              │  │  orders/users)   │   │
   │  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘   │
   └─────────┼─────────────────┼────────────────────┼────────────┘
             │                 │                    │
             └─────────────────┼────────────────────┘
                               │
                  ┌────────────▼─────────────┐
                  │   Cognito (auth)         │
                  └────────────┬─────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────────┐
   │                  API Gateway (REST + WebSocket)             │
   └────┬───────────────────────────────────────────┬───────────┘
        │                                           │
        ▼                                           ▼
   ┌──────────────────────────┐         ┌──────────────────────┐
   │  Lambda × N (Node/TS)    │ ◀─────▶ │  DynamoDB            │
   │  · menu                  │         │  · menu              │
   │  · orders                │         │  · orders            │
   │  · users                 │         │  · users             │
   │  · websocket handler     │         └──────────────────────┘
   └──────────────────────────┘
                               │
                               ▼
                    WebSocket push
                    (kitchen status)
```

**Components**
- **3 SPAs (React + Vite + Tailwind + Zustand):** customer-facing, kitchen, admin — each deployed to its own S3 + CloudFront distribution
- **Cognito:** user pools for customer, staff, and admin roles
- **API Gateway (REST):** all CRUD endpoints
- **API Gateway (WebSocket):** real-time kitchen order queue updates
- **Lambda (Node.js + TypeScript):** business logic
- **DynamoDB:** single-table design for menu, orders, users
- **AWS CDK (TypeScript):** IaC for every resource above
- **GitHub Actions:** CI/CD for both infra and SPAs

---

## 💰 Cost

~$0.80/month at low traffic. Why it's cheap:
- Lambda + DynamoDB pay-per-request
- CloudFront free tier covers the SPAs
- No always-on EC2 / RDS
- Single-table DynamoDB design = fewer read/write units

---

## 🚀 Quick Start

```bash
git clone https://github.com/pjpangilinan/dgos.git
cd dgos

# Install infra + backend deps
cd infra
npm install
cdk synth
cdk deploy

# Run a SPA locally
cd ../apps/customer
npm install
npm run dev
```

Requires AWS credentials with permission to deploy the CDK stack.

---

## 🧪 Tests

255+ unit tests across services and components:

```bash
cd infra
npm test
```

---

## 🧠 What I Learned

- AWS CDK as a first-class IaC tool (vs raw CloudFormation)
- DynamoDB single-table design and GSIs for query patterns
- WebSocket API Gateway vs REST: when each is the right call
- Cognito user pools, identity pools, and JWT verification in Lambda
- CloudFront cache behaviors and per-SPA routing
- Cost-conscious serverless design (~$0.80/month is achievable)

---

## 📜 License

MIT
