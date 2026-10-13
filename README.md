# Famobi Developer Test – Neon Snake Analytics

This repository extends Famobi's Neon Snake starter game with:

- Famobi SDK integration
- gameplay analytics
- a Node.js analytics backend
- Firebase Firestore Local Emulator storage
- a React analytics dashboard

The solution is designed to run entirely locally and does not require access to a real Firebase project.

---

## Architecture

```text
Neon Snake
    |
    | GameController events
    v
+------------------------+
| Integration adapters   |
|                        |
| FamobiAdapter          | ---> Famobi GameInterface
| GameAnalyticsAdapter   |
+------------------------+
            |
            | HTTP
            v
     Node.js / Express
            |
            | Zod validation
            v
       Firebase Admin
            |
            v
   Firestore Emulator
            |
            | GET analytics
            v
     React Dashboard
```

The existing game simulation remains independent from both the Famobi SDK and analytics infrastructure.

Integration adapters translate existing application events into external SDK/API calls.

---

## Requirements

- Node.js 22 or newer
- pnpm 11.1.3
- Java 21 or newer

The Java runtime is required by the Firebase Firestore Emulator.

---

## Install

Clone the repository and install all workspace dependencies:

```bash
pnpm install
```

No Firebase login, credentials, or real Firebase project are required.

---

## Running the complete solution locally

The solution currently uses separate development processes so each component can also be run and debugged independently.

### 1. Start Firestore Emulator

From the repository root:

```bash
pnpm exec firebase emulators:start --only firestore
```

Firebase Emulator UI:

```text
http://127.0.0.1:4000
```

Firestore runs on:

```text
127.0.0.1:8080
```

---

### 2. Start the analytics backend

In another terminal:

```bash
pnpm --filter @famobi-test/server dev
```

The API runs on:

```text
http://localhost:3001
```

Health check:

```text
http://localhost:3001/api/health
```

Analytics events:

```text
http://localhost:3001/api/analytics/events
```

---

### 3. Start the game

In another terminal:

```bash
pnpm dev
```

Vite prints the local game URL, normally:

```text
http://localhost:5173
```

---

### 4. Start the analytics dashboard

In another terminal:

```bash
pnpm --filter dashboard dev
```

Vite prints the dashboard URL. When the game already occupies port 5173 this is normally:

```text
http://localhost:5174
```

Use the URL printed by Vite rather than relying on a fixed port.

---

## Famobi SDK integration

The game is initialized through `GameInterface.init()` instead of loading the game entry point directly.

The integration reports the important gameplay lifecycle events:

- `gameReady`
- `gameStart`
- `gamePause`
- `gameResume`
- `gameEnd`
  - `complete`
  - `fail`
  - `quit`
- `gameFinished`
- score updates
- progress updates

The game also responds to platform-driven:

- pause/resume changes
- mute/unmute changes

Player persistence uses `GameInterface.storage` instead of direct browser `localStorage`.

### Local SDK testing

Famobi's local tester can be used with URL query parameters.

For example:

```text
http://localhost:5173/?holdInit=1
```

This verifies that the game does not start before Famobi initialization completes.

The SDK console output can also be used to verify lifecycle, score, progress, pause, mute, and completion events.

---

## Gameplay analytics

Gameplay events are emitted from the existing `GameController` and translated by `GameAnalyticsAdapter`.

The following event types are recorded:

### `game_started`

```json
{
  "sessionId": "...",
  "type": "game_started",
  "level": 1,
  "occurredAt": 123456789
}
```

### `score_changed`

```json
{
  "sessionId": "...",
  "type": "score_changed",
  "level": 1,
  "score": 20,
  "occurredAt": 123456789
}
```

### `progress_changed`

```json
{
  "sessionId": "...",
  "type": "progress_changed",
  "level": 1,
  "progress": 0.4,
  "occurredAt": 123456789
}
```

### `game_ended`

```json
{
  "sessionId": "...",
  "type": "game_ended",
  "level": 1,
  "score": 50,
  "progress": 1,
  "outcome": "complete",
  "occurredAt": 123456789
}
```

The backend additionally stores a trusted Firestore `receivedAt` timestamp.

Analytics failures do not interrupt gameplay. If the local backend is unavailable, the event is skipped and a warning is written to the browser console.

---

## Backend

The backend uses:

- Node.js
- TypeScript
- Express
- Zod
- Firebase Admin SDK

### API

#### Health

```http
GET /api/health
```

#### Create analytics event

```http
POST /api/analytics/events
```

Incoming events are validated with Zod before being stored.

Invalid events receive HTTP `400`.

#### Read analytics events

```http
GET /api/analytics/events
```

Returns the latest stored analytics events for the dashboard.

---

## Firebase

The challenge uses the Firebase Local Emulator Suite only.

Project ID:

```text
demo-famobi-test
```

No real Firebase credentials are required.

The browser does not write directly to Firestore.

Instead:

```text
browser
  -> Node backend
  -> validation
  -> Firebase Admin SDK
  -> Firestore Emulator
```

Firestore security rules deny direct client reads and writes.

---

## Analytics dashboard

The React dashboard consumes the Node API rather than accessing Firestore directly.

It currently displays:

- unique gameplay sessions
- completed runs
- failed runs
- quit runs
- average final score

It also includes two gameplay visualizations:

### Outcomes by level

Shows the number of:

- completions
- failures
- quits

for each level.

### Average progress by level

Shows how far players typically progress through each level.

The aggregation currently happens in React because the expected local challenge dataset is small.

---

## Validation and checks

### Game

```bash
pnpm check
pnpm build
```

### Backend

```bash
pnpm --filter @famobi-test/server check
pnpm --filter @famobi-test/server build
```

### Dashboard

```bash
pnpm --filter dashboard lint
pnpm --filter dashboard build
```

---

## Manual end-to-end test

1. Start Firestore Emulator.
2. Start the Node backend.
3. Start Neon Snake.
4. Start the React dashboard.
5. Play the game.
6. Complete, fail, or quit gameplay.
7. Open the Firestore Emulator UI and confirm analytics documents were created.
8. Refresh the React dashboard.
9. Confirm the session metrics and charts reflect the stored gameplay.

Invalid analytics can also be tested manually by POSTing malformed events to the API and confirming that the backend returns HTTP `400`.

---

## Technical decisions

### Keep game logic independent

I avoided adding Famobi or analytics-specific code directly to the Snake simulation.

The existing `GameController` already exposed application-level events, so integration adapters subscribe to those events instead.

This keeps platform/infrastructure concerns separate from game logic.

### Backend owns Firebase access

The game and dashboard never access Firestore directly.

All analytics pass through the Node backend so input can be validated consistently.

### Runtime validation

TypeScript validates code during development but cannot validate arbitrary HTTP input at runtime.

Zod is therefore used to validate analytics payloads before they are written to Firestore.

### Event-based analytics

Analytics are modeled as events rather than a single mutable game document.

This preserves gameplay history and makes later aggregation possible.

### Local-only Firebase configuration

A Firebase demo project ID and Local Emulator Suite are used so the complete project runs without credentials or production infrastructure.

---

## Known limitations

The challenge was intentionally time-boxed.

Current limitations include:

- Firestore emulator data is not persisted between emulator restarts.
- Dashboard data is loaded once when the page opens and currently requires a refresh to display newly recorded gameplay.
- Dashboard aggregation is performed client-side and would not scale to a large production dataset.
- Analytics delivery is best-effort and currently has no retry queue or offline buffering.
- The Famobi lifecycle is integrated around the existing game architecture. Some simulation-driven end transitions occur before the asynchronous platform event has fully resolved; a production implementation could introduce explicit async transition gates.
- Automated integration and end-to-end test coverage is limited.
- No production deployment is configured.

---

## Improvements with more time

With additional development time I would:

1. Move analytics aggregation to dedicated backend endpoints.
2. Add automated API, adapter, and end-to-end tests.
3. Add retry/buffering for failed analytics requests.
4. Persist or seed emulator data for easier repeatable demonstrations.
5. Add automatic dashboard refresh or real-time updates.
6. Add pagination and filtering to analytics endpoints.
7. Add stricter production API security and rate limiting.
8. Gate all game lifecycle transitions on resolved Famobi lifecycle promises.
9. Optimize the Phaser production bundle if bundle size became a deployment concern.
10. Improve dashboard accessibility and responsive visualization behavior.

---

## External tools

Material AI assistance was used during development for:

- discussing architecture and implementation approaches;
- reviewing Famobi SDK integration decisions;
- debugging development-environment issues;
- suggesting validation and testing strategies;
- reviewing code organization and documentation.

All implementation was tested locally, reviewed during development, and I am prepared to explain and modify the submitted code.

---

## Original game

The base Neon Snake game was provided by Famobi:

```text
https://github.com/Famobi-GmbH/neon-snake
```

The game itself was not redesigned. The work in this repository focuses on SDK integration, analytics, backend infrastructure, and the analytics dashboard.
