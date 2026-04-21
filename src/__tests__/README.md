# OKY Wallet Explorer - Test Suite

## Components Under Test

### 1. TransactionCard (`TransactionCard.test.tsx`)

**Why this component was chosen:** TransactionCard is the primary data display
unit of the entire application. Every launch ("transaction") the user sees flows
through this component. If cards fail to render correctly, show the wrong
status, or break click/keyboard interactions, the application is effectively
unusable.

| Test group | What it covers |
|---|---|
| Renders correctly with data | Mission name, formatted date, rocket name, details text, and null-details edge case |
| Loading state | Skeleton placeholder appears; launch data is hidden while loading |
| Click interaction | `onClick` fires with the correct launch ID; no error when handler is absent |
| Status badge | Green/Success for `true`, Red/Failed for `false`, Gray/Pending for `null` |
| Keyboard accessibility | Enter key triggers `onClick`; non-Enter keys are ignored; `role="button"` and `tabIndex=0` are present |

### 2. TransactionList (`TransactionList.test.tsx`)

**Why this component was chosen:** TransactionList is the main view that
orchestrates the rendering of all transaction cards. It is responsible for
handling the three non-happy-path states users encounter: loading, error, and
empty. If this component fails, users see nothing -- no data, no feedback, and
no way to recover from errors.

| Test group | What it covers |
|---|---|
| Renders list of items correctly | Correct number of cards, mission names visible, `onCardClick` delegation |
| Empty state | "No transactions found" message, guidance text, absence of cards |
| Error state | Error message display, retry button presence and click, retry button hidden when no handler, error priority over loading |
| Loading state | Skeleton count (6), cards hidden during load, empty state hidden during load |

## Running the Tests

```bash
# Run all tests once
npx vitest run

# Run tests in watch mode (re-runs on file changes)
npx vitest

# Run via npm script
npm test            # same as npx vitest run
npm run test:watch  # same as npx vitest
```

## Tech Stack

- **Test runner:** Vitest 2.x
- **DOM rendering:** @testing-library/react 16.x
- **User interaction simulation:** @testing-library/user-event 14.x
- **DOM matchers:** @testing-library/jest-dom 6.x (loaded globally via setup.ts)
- **Environment:** jsdom
