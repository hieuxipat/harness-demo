# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev (all):** `npm run dev` (starts client + server concurrently)
- **Dev client:** `npm run dev:client` (port {{client_port}})
- **Dev server:** `npm run dev:server` (port {{server_port}})
- **Build:** `npm run build`
- **Test:** `npm test` (runs all workspaces)
- **Lint:** `npm run lint`

## Architecture

Monorepo with npm workspaces: `client/` (React) + `server/` (NestJS).

- Client proxies `/api` requests to server during development
- `client/src/app/` — Redux store and typed hooks
- `client/src/features/` — Feature modules
- `client/src/styles/` — Theme and styled-components config
- `server/src/app.module.ts` — NestJS root module
- `server/src/<module>/` — Feature modules (controller, service, DTOs)
