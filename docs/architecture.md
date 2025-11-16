# Architecture Overview

## Current Phase: Frontend-Only POC

- React + Vite + TypeScript SPA in `/frontend`.
- Direct calls to Sleeper public APIs.

## Future Backend Proxy

- Node backend in `/backend` later for:
  - Proxying Sleeper requests
  - Caching and rate limiting

## State Management

- Simple React hooks for now.
- Option to add Zustand/Redux when data layer goes in.
