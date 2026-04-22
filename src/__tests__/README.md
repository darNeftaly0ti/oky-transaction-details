# OKY Wallet Explorer — Test Suite

## Components Under Test

### 1. TransactionCard (`TransactionCard.test.tsx`)

**Why this component was chosen:** TransactionCard is the primary data display
unit of the entire application. Every character ("transaction") the user sees
flows through this component. If cards fail to render correctly, show the
wrong status, or break click/keyboard interactions, the application is
effectively unusable.

| Test group | What it covers |
|---|---|
| Renders correctly with data | Character name, species, origin, avatar image |
| Status badge | "Alive" for `status: "Alive"`, "Dead" for `"Dead"`, "Unknown" for `"unknown"` |
| Click interaction | `onClick` fires with the correct character ID |
| Keyboard accessibility | Enter/Space trigger `onClick`; `tabIndex=0` is present |

### 2. TransactionList (`TransactionList.test.tsx`)

**Why this component was chosen:** TransactionList is the main view that
orchestrates the rendering of all transaction cards. It wires up the
interaction handlers and the `role="list"` ARIA semantics that assistive tech
relies on. If this component fails, users see nothing.

| Test group | What it covers |
|---|---|
| Renders list of items correctly | One card per character, names visible, `onCardClick` delegation, list role |
| Empty list | Renders no items and still keeps the list container for SR |

### 3. SearchFilter (`SearchFilter.test.tsx`)

**Why this component was chosen:** SearchFilter drives every query sent to
GraphQL. A broken search or filter means users can never narrow down
transactions — the core UX of the explorer. Testing it verifies the debounced
input, status filter buttons, species dropdown, sort toggle and active-chips
clearing logic.

| Test group | What it covers |
|---|---|
| Search input | Placeholder, debounced `onSearch` callback, accessible label |
| Status filter buttons | All/Alive/Dead/Unknown selection, `aria-pressed` state |
| Species filter | Dropdown renders options, `onFilterSpecies` fires on change |
| Sort toggle | Label switches Newest/Oldest, callback with toggled value |
| Active filter chips | Chips appear with labels; "Clear all" invokes every reset callback |

## Running the Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# TypeScript strict check
npm run typecheck
```

## Tech Stack

- **Test runner:** Vitest 2.x
- **DOM rendering:** @testing-library/react 16.x
- **User interaction simulation:** @testing-library/user-event 14.x
- **DOM matchers:** @testing-library/jest-dom 6.x (loaded globally via setup.ts)
- **Environment:** jsdom
