# maylupa 🇵🇭

> Interactive Philippine infrastructure & socio-economic GIS map + methodology-cited AI.

## Problem
Philippine municipal public data is fragmented across government portals and buried in 50-page PDF reports with complex calculation formulas.

## Solution
Interactive map of 1,613 municipalities rendered at 60 FPS using Deck.gl WebGL and MapLibre GL. Grounded Amazon Bedrock assistant reads official methodology documents and cites exact sections for $0.00/month.

## Architecture
- **Rendering:** Deck.gl WebGL layer over MapLibre GL for smooth 60 FPS rendering of 1,613 polygons.
- **Data Engineering:** PSGC 10-digit code mapping across CMCI, PSA, DOH, DepEd, and Project NOAH data.
- **Grounded AI:** Python 3.12 AWS Lambda ARM64 querying Bedrock with in-memory methodology notes.
- **Cost Engineering:** $0.00/month serverless architecture via S3, CloudFront, and HTTP API Gateway.
