# OKY Wallet — Transaction Explorer

A mini-application simulating a digital wallet transaction history, built with React, TypeScript, Apollo Client and Gatsby. Data is consumed directly from the **public Rick and Morty GraphQL API** (no mocks, no backend of our own).

Each character returned by the API is displayed as a "transaction" in the UI — the technical test explicitly allows any domain (rockets, characters, etc.); what matters is how the data is handled and presented.

---

## Running the Project (3 steps)

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm start

# 3. Open in your browser
# → http://localhost:8000
```

No local backend required — the app talks directly to `https://rickandmortyapi.com/graphql`.

### Other commands

| Command | Description |
|---|---|
| `npm test` | Run all tests (Vitest) |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript strict check |

### Optional: point to a different GraphQL endpoint

Create a `.env.development` file at the project root:

```
GATSBY_GRAPHQL_URI=https://your-own-graphql-endpoint/graphql
```

---

## Technical Decisions

### Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Gatsby 5** | File-system routing, SSR-ready, TypeScript out-of-the-box |
| Data | **Apollo Client 3** | First-class GraphQL support, normalized cache, `cache-and-network` policy |
| Styles | **Tailwind CSS** (with `darkMode: "class"`) | Utility-first, zero runtime, consistent dark mode |
| Testing | **Vitest + Testing Library** | Native ESM, zero config with Vite, same API as Jest |
| API | **Rick and Morty GraphQL** (public) | Stable, unauthenticated, native pagination + filtering, 826+ records |

### State Management

State is managed at two levels:

- **Server state** — Apollo Client handles all asynchronous data (fetching, caching, error states). No Redux or Zustand needed.
- **UI state** — React `useState` and `useCallback` inside custom hooks (`useCharacters`, `useCharacterDetail`, `useCharacterStats`, `useDarkMode`, `useDebounce`) keep component logic encapsulated and testable.

### Apollo Cache Strategy

- List query uses `fetchPolicy: "cache-and-network"` so the UI shows cached data instantly while a background refetch keeps it fresh.
- Detail query uses `cache-first` — once we've fetched a transaction, reopening it is instant.
- The `characters` field is keyed by `["filter", "page"]` in `typePolicies`, so each unique combination has its own cache entry and pages don't overwrite each other.
- `errorPolicy: "all"` is set at the client level: Rick and Morty returns a GraphQL error (not an empty array) when a filter yields zero results. Catching it lets the UI render a clean empty state instead of a generic error.

### Routing

Gatsby's file-system router is used for two routes:

- `/` — paginated list with `?id=<characterId>` query param to open the detail panel (bookmarkable URLs, browser back closes the panel).
- `/transaction/:id` — dedicated full-page detail view (client-only route declared in `gatsby-node.ts` via `matchPath`).

### Filter Implementation

Filters are sent as GraphQL query variables (`filter: { name, status, species }`), not filtered on the client. This approach scales with a real API since only relevant data is transferred. A 300ms debounce on the search input avoids a request per keystroke.

Sorting (by `created` date, newest/oldest) is done client-side because Rick and Morty's API doesn't support server-side sort — this is the only post-processing we do on the returned data.

### Stats Dashboard

The `StatsBar` uses a single query with three GraphQL aliases to fetch total / alive / dead counts in one round-trip (see `GET_STATS` in `src/graphql/queries.ts`).

### Accessibility

- All interactive cards are keyboard-navigable (`tabIndex=0`, Enter/Space handlers, visible focus rings).
- The detail panel is an `aria-modal` dialog that locks body scroll, traps focus on the close button, and closes on Escape.
- Filter buttons use `aria-pressed` to expose active state to screen readers.
- Search input has both a visible icon and an `sr-only` label.

### Dark Mode

`useDarkMode` persists the user preference in `localStorage` and respects `prefers-color-scheme` on first load. Tailwind's `darkMode: "class"` strategy means every `dark:` utility compiles with zero runtime cost.

---

## Trade-offs

### What I sacrificed for time

- **No animations** — Page/panel transitions are instant. A `framer-motion` slide-in for the detail panel would improve perceived performance.
- **No infinite scroll** — Numeric pagination is simpler and works well with the API's fixed page size of 20. Infinite scroll would require Apollo's `fetchMore` with offset merging.
- **No client-side episode filtering** — The detail view lists all episodes a character appears in, but doesn't allow filtering/searching within that list.

### What I would do with more time

- Add `framer-motion` slide transitions for the detail panel and cross-fade list updates.
- E2E tests with Playwright covering the filter → click → detail → back flow.
- A real offset-based "infinite scroll" fallback using Apollo `fetchMore`.
- Optimistic UI for any future write operations (e.g., marking a transaction as reviewed).
- A skeleton placeholder that matches the exact card shape (already done for cards; could extend to the detail panel and stats bar).

---

## What was hardest and how I solved it

**Migrating from a local mock server to a live public API** required three non-obvious fixes:

1. **Empty-state handling.** Rick and Morty returns a GraphQL error (`"There is nothing here"`) when a filter matches no records, rather than returning an empty `results` array. Setting `errorPolicy: "all"` and matching that specific error message in `useCharacters` lets the UI render a proper empty state instead of a generic "Failed to load" screen.
2. **Apollo cache keys for paginated queries.** With the default caching, switching pages overwrote the previous page's data (and the count). Using `keyArgs: ["filter", "page"]` in `typePolicies` forces one cache entry per unique combination, keeping "Next" responsive and predictable.
3. **Stats with GraphQL aliases.** The dashboard needs three counts (total, alive, dead) fetched in one request. Using GraphQL aliases on the same `characters` field made this trivial, but required the cache `keyArgs` to include the `filter` argument to avoid collapsing them into one entry.

---

## Project Structure

```
src/
├── components/       # UI components (TransactionCard, Pagination, SearchFilter, StatsBar, …)
├── hooks/            # Custom hooks (useCharacters, useCharacterDetail, useCharacterStats, useDarkMode, useDebounce)
├── graphql/          # GraphQL queries (GET_CHARACTERS, GET_CHARACTER, GET_STATS)
├── lib/              # Apollo Client setup
├── pages/            # Gatsby pages (index, transaction/:id, 404)
├── styles/           # Global CSS (Tailwind base)
├── types/            # TypeScript interfaces mapped from the Rick and Morty schema
└── __tests__/        # Vitest + Testing Library tests
```
