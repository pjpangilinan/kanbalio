# VOTECHAIN

> Blockchain-based electronic voting system with multi-factor authentication, immutable vote records, and a real-time public transparency dashboard.

## Problem

Traditional voting systems are opaque. Voters drop a ballot and trust that it was counted correctly. There's no way for the public to independently verify the result while preserving voter anonymity.

## Solution

A blockchain-backed e-voting system where every vote is an immutable block. Voters authenticate with MFA, cast their ballot, and the public can watch the tally update in real time via a WebSocket dashboard.

## Architecture

- **Voter UI (React)** — ballot interface, MFA input, vote confirmation
- **Admin Panel (React)** — election setup, voter roll management, audit logs
- **Public Dashboard (React)** — live vote tally updated via WebSockets
- **Backend (Python/FastAPI)** — vote validation, MFA verification, block submission
- **Blockchain (Raspberry Pi)** — Python node running SHA-256 hashing; each block links to the previous via its hash; chain is stored on local storage
- **WebSockets** — real-time push from the blockchain node to the public dashboard

## Key Decisions

- **Raspberry Pi as the blockchain node**: physical constraint that prevents tampering — you can't alter the chain without physical access
- **SHA-256 for block hashing**: standard, well-tested, fast enough on a Pi
- **FastAPI for the API layer**: Python-native, async, and good WebSocket support
- **MFA via TOTP**: standard authenticator app flow, no SMS costs
- **Separate SPAs**: voter, admin, and public are kept separate to isolate concerns and prevent vote manipulation from the public interface

## What I learned

- How blockchain consensus works at a small scale — the chain is simple but the concept of "immutable" really depends on who holds the chain
- WebSocket patterns for real-time public dashboards
- TOTP-based MFA implementation (time-based one-time passwords)
- Running a Python application on a Raspberry Pi
- The gap between "blockchain as a concept" and "blockchain that solves real problems" — this project is honest about its scope (educational, not production-grade for real elections)
