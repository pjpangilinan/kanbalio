# Muse Journal

> Automated personal Spotify listening history archive. Self-hosted, permanent, searchable.

## Problem

Spotify's "liked songs" and playlists change over time. There's no built-in way to archive your full listening history — what you played, when, and how often — for personal analytics or nostalgia.

## Solution

A Go service that runs on a schedule via GitHub Actions, fetches your recently played tracks from the Spotify API, and stores everything in SQLite. The data is exposed through a static frontend served on GitHub Pages.

## Architecture

- **Collector (Go)** — runs every N hours via GitHub Actions, calls Spotify's `recently-played` endpoint, upserts records into SQLite
- **Database (SQLite)** — single file, committed back to the repo after each collection run
- **Frontend (Tailwind CSS)** — static HTML served via GitHub Pages, reads from the committed SQLite via client-side JS
- **CI (GitHub Actions)** — two workflows: `collector.yml` for scheduled data ingestion, `pages.yml` for deploying the frontend

## Key Decisions

- **SQLite over PostgreSQL/DynamoDB**: zero infrastructure; the DB file lives in the repo and is committed after every run. Perfect for a personal archive with low write volume.
- **Self-hosted over SaaS**: no monthly cost, no vendor lock-in, full control over the data
- **Go for the collector**: single binary, fast cold start in GitHub Actions, excellent Spotify API client libraries
- **Static frontend**: no build step needed at runtime; the HTML + JS + SQLite file are served directly

## What I learned

- Building a scheduled data pipeline using GitHub Actions as the scheduler
- SQLite in a repo as a legitimate data store for personal archives
- Go HTTP client patterns for API rate limits and pagination
- Spotify API OAuth flow and refresh token management in CI
- Designing a searchable frontend over a SQLite-backed static site
