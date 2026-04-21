# OKY Wallet — Transaction Explorer

A mini-application simulating a digital wallet transaction history, built with React, TypeScript, Apollo Client and Gatsby. Data is consumed from a SpaceX GraphQL API (with a local mock server for development).

---

## Running the Project (3 steps)

```bash
# 1. Install dependencies
npm install

# 2. Start the app (mock GraphQL server + Gatsby dev server run concurrently)
npm start

# 3. Open in your browser
# → App:     http://localhost:8000
# → GraphQL: http://localhost:4000/graphql
```

> **Note:** `npm start` automatically boots the local mock GraphQL server on port 4000 and Gatsby on port 8000 via `concurrently`. No extra setup needed.

### Other commands

| Command | Description |
|---|---|
| `npm test` | Run all tests (Vitest) |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript strict check |

---

## Technical Decisions

### Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Gatsby 5** | File-system routing, SSR-ready, TypeScript out-of-the-box |
| Data | **Apollo Client 3** | First-class GraphQL support, normalized cache, `cache-and-network` policy |
| Styles | **Tailwind CSS** | Utility-first, zero runtime cost, responsive breakpoints with no extra config |
| Testing | **Vitest + Testing Library** | Native ESM, zero config with Vite, same API as Jest |
| Mock server | **graphql-yoga** | Lightweight, ESM-native GraphQL server for local development |

### State Management

State is managed at two levels:

- **Server state** — Apollo Client handles all asynchronous data (fetching, caching, error states). No Redux or Zustand needed.
- **UI state** — React `useState` and `useCallback` inside custom hooks (`useLaunches`, `useLaunchDetail`) keep component logic encapsulated and testable.

### Apollo Cache Strategy

```
fetchPolicy: "cache-and-network"
```

Chosen for the list query so the UI shows cached data instantly while a background refetch keeps it fresh. The count query uses `cache-first` to avoid an extra network request on every page change. The cache `merge` function for `launches` replaces rather than appends, so page changes always show the correct slice.

### Routing

Gatsby's file-system router is used for two routes:

- `/` — paginated list with `?id=<launchId>` query param to open the detail panel (bookmarkable URLs, browser back closes the panel).
- `/launch/:id` — dedicated full-page detail view (client-only route via `gatsby-node.ts` `matchPath`).

### Filter Implementation

Filters are sent as GraphQL query variables (`find: { mission_name, launch_success }`), not filtered on the client. This approach scales better with a real API since only relevant data is transferred. A 300ms debounce on the search input avoids a request per keystroke.

---

## Trade-offs

### What I sacrificed for time

- **No real SpaceX API** — The public SpaceX GraphQL endpoints (`api.spacex.land`, `spacex-production.up.railway.app`) are all currently offline. The local mock server covers all functionality but the data is static (31 launches).
- **No animations** — Page/panel transitions are instant. A `framer-motion` slide-in for the detail panel would improve perceived performance.
- **No infinite scroll** — Implemented numeric pagination instead. Infinite scroll requires Apollo's `fetchMore` with cursor-based pagination.

### What I would do with more time

- Deploy a real SpaceX API clone (the `apollographql/spacex` open-source repo) to a cloud provider and swap the `GATSBY_GRAPHQL_URI` env variable.
- Add E2E tests with Playwright covering the full filter → click → detail flow.
- Add `framer-motion` slide transitions for the detail panel.
- Implement optimistic UI for any future write operations (e.g., marking a transaction as reviewed).
- Add a dark mode toggle.

---

## What was hardest and how I solved it

**The hardest part was discovering all public SpaceX GraphQL APIs were down.** The app showed a persistent `NetworkError` at startup.

The solution was to build a `graphql-yoga` mock server (`mock-server/server.mjs`) that mirrors the exact schema the app expects — same types, same `LaunchFind` input, same field names. This let development continue uninterrupted and also serves as a stable test fixture.

A secondary bug found during development: the `LaunchFind.launch_success` field was typed as `string` in TypeScript but the GraphQL schema expects `Boolean`. Apollo sent the value as a string, which caused a `400 Bad Request`. Fixed by correcting the type in `src/types/api.ts` and removing the string conversion in `useLaunches.ts`.

---

## Live Demo

> [Deployed URL — e.g. https://oky-wallet-explorer.netlify.app](https://oky-wallet-explorer.netlify.app)

*(Replace with actual deployment URL before submission)*

---

## Project Structure

```
src/
├── components/       # UI components (TransactionCard, Pagination, SearchFilter…)
├── hooks/            # Custom hooks (useLaunches, useLaunchDetail, useDebounce)
├── graphql/          # GraphQL queries
├── lib/              # Apollo Client setup
├── pages/            # Gatsby pages (index, launch detail, 404)
├── styles/           # Global CSS (Tailwind base)
├── types/            # TypeScript interfaces for the API
└── __tests__/        # Vitest + Testing Library tests
mock-server/
└── server.mjs        # Local GraphQL mock server (graphql-yoga)
```
