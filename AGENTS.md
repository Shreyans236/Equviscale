# EquiScale AI Agent Guide

This repository is a Vite + React recruitment platform prototype. The goal of this guide is to help coding agents make safe, consistent changes without rediscovering the project structure or API conventions.

## Quick Start

- Install dependencies: `npm install`
- Start app: `npm run dev`
- Production build: `npm run build`
- Lint: `npm run lint`
- Local app URL: `http://localhost:5173`

## Project Shape

- App shell and routing live in `src/App.jsx` and `src/pages/`
- Reusable UI lives under `src/components/`
- API integrations live under `src/api/`
- Shared request state logic lives in `src/hooks/useApi.js`
- Styling is custom CSS in `src/styles/`, `src/App.css`, and page/component CSS files

## API Layer Conventions

The project follows a mock-first API design. The canonical integration points are:

- `src/api/axiosInstance.js` — shared axios client
- `src/api/candidateApi.js` — candidate-related requests
- `src/api/jobsApi.js` — job-related requests and mock persistence
- `src/api/anonymizeApi.js` — anonymization and match-score requests

Important conventions:

- `axiosInstance` sets a shared `baseURL` from `VITE_API_BASE_URL` and falls back to `http://localhost:8000`
- Request interceptor reads `localStorage.getItem('equiscale_token')` and attaches the bearer token when present
- Response interceptor unwraps `response.data` and normalizes errors into `{ status, message }`
- Each API module exports async named functions, not default objects
- Mock mode is the default: each module sets `USE_MOCK = true` and returns promise-based mock responses
- Switching to the real backend is done by setting that flag to `false` while keeping the same function signatures

## Mock Data Pattern

This app intentionally ships with realistic mock data to support UI demos without a backend.

- `jobsApi.js` persists mock jobs in `localStorage` under `equiscale_jobs`
- `candidateApi.js` uses in-memory mock arrays for candidate data and applications
- `anonymizeApi.js` includes mock match-score breakdowns and anonymized candidate payloads

When changing an API contract:

1. Update the matching mock response in the relevant API file
2. Keep the real axios call path aligned to the same endpoint and response shape
3. Preserve the existing function names and return structure expected by the UI

## UI + Data Fetching Pattern

Components should not perform raw axios calls directly. Prefer the established flow:

- Use `src/hooks/useApi.js` for loading, error, and data state
- Call exported functions from the domain API files
- Keep UI components focused on rendering and user actions

This pattern is the default for candidate/recruiter screens and is the safest way to extend the app.

## Repository-Specific Guidance for API Work

When working on the API layer or integrations:

- Keep changes within the correct domain file instead of creating ad hoc API helpers elsewhere
- Preserve `USE_MOCK` guard behavior; avoid breaking the demo experience
- Match the backend contract described in the project README and keep endpoint paths under `/api/v1/...`
- Treat `localStorage`-backed job data as part of the working mock implementation, not as a deprecated shortcut
- If a UI component depends on a field, ensure both mock and real responses include that field consistently

## Validation

Before finishing a change, run the smallest relevant check:

- `npm run build` to validate the app still compiles
- `npm run lint` if the change touches code quality or formatting-sensitive files

Use the existing project structure and patterns rather than introducing new state management, fetch layers, or API conventions.
