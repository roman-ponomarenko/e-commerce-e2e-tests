# E-Commerce E2E Tests

Playwright + TypeScript E2E test suite for the **Northwind Goods** e-commerce site.

## Prerequisites

- [Node.js](https://nodejs.org/en/download) v18+
- [pnpm](https://pnpm.io/) v10+
- A running instance of the Northwind Goods [app](https://github.com/secureprivacy/example-e-commerce-website) (default: `http://localhost:5173`)

## Setup

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
pnpm exec playwright install chromium
```

## Configuration

Copy `.env.example` to `.env` (or edit `.env` directly) and set the values:

```dotenv
APP_URL=http://localhost:5173/

LOGIN_PAGE_PATH=/login
REGISTER_PAGE_PATH=/register
PRODUCTS_PAGE_PATH=/products
CART_PAGE_PATH=/cart
CHECKOUT_PAGE_PATH=/checkout
ACCOUNT_PAGE_PATH=/account
CONFIRMATION_PAGE_PATH=/order-confirmation

APP_USERNAME=test@example.com
APP_PASSWORD=Password123!

CI=false
PW_MAX_RETRIES=1
PW_WORKERS=1
```

| Variable | Description |
|---|---|
| `APP_URL` | Base URL of the app under test |
| `*_PAGE_PATH` | Relative paths for each page |
| `APP_USERNAME` / `APP_PASSWORD` | Credentials for the shared test account |
| `CI` | Set to `true` in CI — enables headless mode |
| `PW_MAX_RETRIES` | Number of retries for failed tests (`1`–`4`) |
| `PW_WORKERS` | Number of parallel workers (`1`–`4`) |

---

## Test Coverage

> Full test case registry with status: [TEST-CASES.md](./TEST-CASES.md)  
> Full page state transition map and key journeys: [STATE-TRANSITIONS.md](./STATE-TRANSITIONS.md)  
> Guiding principles behind coverage decisions: [TA-MANIFEST.md](./TA-MANIFEST.md)

The suite covers **6 functional areas** across **4 test files**:

| Suite | Tag | Areas covered |
|---|---|---|
| `auth.tests.ts` | `@auth` | Login, registration, auth guards, account logout |
| `browsing.tests.ts` | `@browsing` | Homepage, product list, category filter, sort, search, breadcrumbs |
| `cart-checkout.tests.ts` | `@cart-checkout` | Cart drawer, cart page, promo codes, checkout, order confirmation, order history |
| `cookie-consent.tests.ts` | `@cookie` | Cookie banner, preference centre, consent persistence |

### What is covered

- **Browsing** — all 16 products load; filtering, sorting (price asc/desc, name A→Z), and search work correctly; search + category filter in combination
- **Product Detail** — name, price, stock badge, description, size selector; quantity stepper inc/dec/min-boundary; add-to-cart validation; related products; breadcrumb navigation
- **Cart** — drawer open/close, item name/size/price, qty updates, remove item, empty state, view cart, checkout shortcuts (authenticated + unauthenticated)
- **Cart Page** — promo code (valid + invalid), free shipping threshold, line totals, proceed to checkout
- **Checkout** — full happy-path order placement (Journey 1); form validation; order confirmation; order appears in account history
- **Auth** — login (valid, wrong password, unregistered email, empty fields); registration (valid, mismatched passwords, duplicate email, empty fields); login→register→login navigation; checkout redirect round-trip (`?redirect=/checkout`)
- **Cookie Consent** — banner shown on first visit; accept all / decline / customize flows; preferences persist across reload; banner reappears in fresh session

All **32 page state transitions** defined in [STATE-TRANSITIONS.md](./STATE-TRANSITIONS.md) are covered, with the exceptions noted below.

### What is deliberately omitted

See the **Explicitly Excluded** table in [TEST-CASES.md](./TEST-CASES.md) for the full list with rationale. Key omissions:

- Filter by Women's Apparel / Accessories / Home & Living — same mechanism as the Men's Apparel filter test
- Unauthenticated `/account` redirect — same auth-guard pattern as the `/checkout` redirect test
- Payment edge cases (declined card, etc.) — in-memory backend cannot reproduce these states reliably

---

## Known Limitations / Bugs

| # | Severity | Description | Location |
|---|---|---|---|
| 1 | 🟡 Medium | `verifyOrderCount(1)` breaks on re-run — shared test account accumulates orders in `localStorage` | `cart-checkout.tests.ts` — "Placing an order" |
| 2 | 🔴 High | After login via `?redirect=/checkout`, the app redirects to **home** instead of checkout — Journey 2 cannot complete end-to-end | `cart-checkout.tests.ts` — "Unauthenticated checkout from cart page" (marked `//TODO`) |
| 3 | 🟡 Medium | Logo-click and Home-nav transitions from `CartPage`, `Checkout`, `Confirmation`, and `Account` are not explicitly asserted — same mechanism proven from `ProductList` and `ProductDetail` | `browsing.tests.ts` |
| 4 | 🟢 Low | "Confirmation page items ordered" not yet asserted — order ID and total are verified, but the item list is not | `cart-checkout.tests.ts` — "Placing an order" |
| 5 | 🟢 Low | `Privacy Policy` link inside `SpCookieBanner` iframe is not clickable — `href="javascript:void(0)"` with no navigation handler attached | `sp-cookie-banner.component.ts` — `clickPrivacyPolicyLink()` |

> Bug #2 and Bug #5 are **app bugs**, not test bugs. Tests are written to assert correct behaviour and are expected to fail until the app is fixed.

---

## Running Tests

### Run all tests

```bash
pnpm test
```

### Run with browser visible (headed)

```bash
pnpm test:headed
```

### Run forced headless (ignores `CI` flag)

```bash
pnpm test:headless
```

### Run in debug mode (Playwright Inspector)

```bash
pnpm test:debug
```

### Run in UI mode (interactive watch + rerun)

```bash
pnpm test:ui
```

---

## Running Tests by Suite

Each suite is tagged. Run a specific tag to execute only that suite:

| Script | Tag | What it covers |
|---|---|---|
| `pnpm test:auth` | `@auth` | Login, registration, account navigation |
| `pnpm test:browsing` | `@browsing` | Homepage, product list, category filter, sorting, search |
| `pnpm test:cart` | `@cart-checkout` | Cart, promo codes, checkout flow, order history |
| `pnpm test:cookie` | `@cookie` | Cookie banner, preferences, persistence |

```bash
pnpm test:auth
pnpm test:browsing
pnpm test:cart
pnpm test:cookie
```

---

## Running a Specific File or Test

```bash
# Run a specific test file
pnpm exec playwright test tests/browsing.tests.ts

# Run tests matching a title substring
pnpm exec playwright test --grep "Product search"

# Combine file and grep
pnpm exec playwright test tests/cart-checkout.tests.ts --grep "promo code"
```

---

## Reports

### Open the last HTML report

```bash
pnpm test:report
```

### Generate and open in one step

```bash
pnpm test && pnpm test:report
```

The report is saved to `playwright-report/`. Screenshots are always captured. Videos and traces are saved on failure and can be viewed inside the HTML report.

---

## CI

Set `CI=true` in your environment (or `.env`) to switch to:
- **Headless** browser execution

```bash
CI=true pnpm test
```

---

## Project Structure

```
tests/                        # Test files (*.tests.ts)
src/
  app/
    pages/                    # Page Object classes
    components/               # Component Object classes
    abstract-classes.ts       # Base classes (PageHolder, Component, AppPage)
    app.fixture.ts            # Custom Playwright fixture
    index.ts                  # App entry point for tests
  config.ts                   # Env var definitions (envalid)
  utils/
    step-decorator.ts         # @step decorator
playwright.config.ts          # Playwright configuration
.env                          # Local environment variables
```
