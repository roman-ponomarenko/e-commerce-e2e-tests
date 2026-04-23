# E-Commerce E2E Tests — Project Guide

## Overview

Playwright + TypeScript E2E test suite for the **Northwind Goods** e-commerce site. Uses a Page Object Model (POM) architecture with custom fixtures and a `@step` decorator.

**Stack:** Playwright, TypeScript, pnpm, envalid, dotenv  
**Browser:** Chrome only (Desktop 1366×768)  
**Workers:** configured via `PW_WORKERS` in `.env`  
**Test file pattern:** `*.tests.ts` in `tests/`

## Running Tests

### pnpm scripts

```bash
pnpm test                  # all tests (headless, per PW_WORKERS)
pnpm test:headed           # all tests with browser visible
pnpm test:headed:slow      # all tests headed with PW_SLOW_MO=300ms delay
pnpm test:headless         # all tests forced headless
pnpm test:debug            # step through with Playwright Inspector
pnpm test:auth             # @auth suite only
pnpm test:browsing         # @browsing suite only
pnpm test:cart             # @cart-checkout suite only
pnpm test:cookie           # @cookie suite only
pnpm test:report           # open last HTML report
pnpm test:allure           # generate Allure report and open it
pnpm test:allure:generate  # generate Allure report only
pnpm test:allure:open      # open previously generated Allure report
```

### Direct Playwright CLI

```bash
pnpm exec playwright test                              # all tests
pnpm exec playwright test --grep @cart-checkout        # by tag
pnpm exec playwright test tests/cart-checkout.tests.ts # specific file
```

Available tags: `@cart-checkout`, `@browsing`, `@auth`, `@cookie`

Reports are HTML locally, list format in CI. Screenshots are always captured; video and traces are retained on failure.

> **Note:** Retries and workers are controlled by `PW_MAX_RETRIES` and `PW_WORKERS` in `.env`.

## Architecture

### Class Hierarchy (`src/app/abstract-classes.ts`)

```
PageHolder          — holds page, exposes $(selector) and $id(testId) locator shorthands
  └── Component     — adds abstract verifyLoaded()
        └── AppPage — adds pagePath, open(), goBack(), reloadPage(), clearLocalStorage(), close()
```

- **`PageHolder`** — base for everything.
  - `this.$(selector)` is a concise alias for `this.page.locator(selector)`.
  - `this.$id(testId)` is a concise alias for `this.page.getByTestId(testId)`.
- **`Component`** — used for UI components (banners, overlays, widgets). Must implement `verifyLoaded()`.
- **`AppPage`** — used for full pages. Adds `pagePath` and `open()` which calls `page.goto(pagePath)`. Also provides `goBack()`, `reloadPage()`, and `clearLocalStorage()`.

### `App` class (`src/app/index.ts`)

The single entry point exposed to tests via the `app` fixture. Add new pages/components here as properties.

```ts
export class App extends PageHolder {
    homePage = new HomePage(this.page)
    spCookieBanner = new SpCookieBanner(this.page)
    // ...
}
```

### Fixture (`src/app/app.fixture.ts`)

Always import `test` from `@/app/app.fixture`, not from `@playwright/test`. This gives access to the `app`, `page`, and `config` fixtures.

```ts
import {test} from "@/app/app.fixture";

test('my test', async ({app, config}) => { ... });
```

## Conventions

### `@step` Decorator (`src/utils/step-decorator.ts`)

Wraps any `async` class method in a `test.step()`. Always use it on all public methods in pages and components.

```ts
@step("User clicks '{buttonName}' button")
async clickButton(buttonName: string): Promise<void> {
    await this.button.click();
}
```

- Step label format: `"<template> - <ClassName>.<methodName> — .../tests/file.ts:line"`
- Supports `{paramName}` placeholders that are replaced with actual argument values at runtime.
- Default parameter values are used as fallbacks when the argument is `undefined`.

### Method naming

| Purpose | Prefix | Example |
|---|---|---|
| Assertion | `verify` | `verifyLoaded()`, `verifyHidden()`, `verifyCheckboxChecked()` |
| Action | verb | `clickAcceptAllButton()`, `open()`, `uncheck()` |

### Verification methods

Default `message` parameters are conventional — pass a custom message only when the default is not descriptive enough.

```ts
@step("Verifying 'Accept all' button is visible")
async verifyAcceptAllButtonVisible(message = "'Accept all' button should be visible"): Promise<void> {
    await expect(this.acceptAllButton, message).toBeVisible();
}
```

### Composite action methods

Some pages expose composite methods that perform multiple steps (open, verify, fill, submit) in a single call. **Do not call the individual steps before the composite** — this causes double navigation and invalidates any intermediate state (e.g. a dismissed cookie banner).

```ts
// ✅ Correct — login() calls open() + verifyLoaded() internally
await app.loginPage.login(config.APP_USERNAME, config.APP_PASSWORD);

// ❌ Wrong — open() + login() navigates to the page twice
await app.loginPage.open();
await app.loginPage.login(config.APP_USERNAME, config.APP_PASSWORD);
```

### Test data placement

Declare shared test data (e.g. `paymentData`) inside `test.describe`, not at module level. For truly per-test isolation, declare data inside each `test()` callback or use a `beforeEach`.

```ts
test.describe('...', () => {
    const paymentData: PaymentDetails = { ... }; // ✅ scoped to describe

    test('...', async ({app}) => {
        const productName = 'Cashmere Cardigan';  // ✅ per-test local
    });
});
```

### Search input

`search(query)` uses `pressSequentially` with a delay to mimic real typing and allow the app's debounce to fire. Always call `verifyResultCountText(expectedCount)` **before** reading product names — this acts as the wait for the filtered DOM to settle:

```ts
await app.productListPage.search('classic');
await app.productListPage.verifyResultCountText(2);        // waits for filter to apply
await app.productListPage.verifySearchResults('classic');  // asserts all names contain term
```

### iframe Components (Secure Privacy widgets)

Components embedded in iframes use `page.frameLocator()` and expose interactions through the frame:

```ts
private frameLocator = "#main-cookie-banner iframe[id='ifrmCookieBanner']";
private frameElement = this.page.frameLocator(this.frameLocator);

// Verify the iframe itself is visible via this.$()
await expect(this.$(this.frameLocator)).toBeVisible();
// Elements inside the frame via frameElement
await expect(this.acceptAllButton).toBeVisible(); // acceptAllButton = frameElement.getByRole(...)
```

### Parameterized components (`SpCookieKeyPoint`)

Components reused for multiple instances (e.g., Advertising/Analytics/Essential categories) accept constructor parameters and use `get` accessors for locators so they are evaluated lazily per instance.

## File Structure

```
src/
  app/
    abstract-classes.ts       # PageHolder, Component, AppPage
    app.fixture.ts            # Custom Playwright fixture
    index.ts                  # App class — entry point for tests
    pages/
      home.page.ts            # HomePage — pagePath uses APP_URL (base URL)
      product-list.page.ts    # ProductListPage — also exports Category, Sorting constants
      product-detail.page.ts  # ProductDetailPage
      cart.page.ts            # CartPage
      checkout.page.ts        # CheckoutPage — also exports PaymentDetails interface
      confirmation.page.ts    # ConfirmationPage
      login.page.ts           # LoginPage — login() is a composite (open + fill + submit)
      create-account.page.ts  # CreateAccountPage
      account.page.ts         # AccountPage
    components/
      header.component.ts
      cart-drawer.component.ts
      cart-item.component.ts
      product-card.component.ts
      qty-stepper.component.ts
      order-summary.component.ts
      order-history-item.component.ts
      toast.component.ts
      sp/
        sp-cookie-banner.component.ts
        sp-trust-badge.component.ts
        sp-preference-center.component.ts
        sp-cookie-key-point.component.ts
  config.ts                   # Env vars (envalid)
  utils/
    step-decorator.ts         # @step decorator
tests/
  auth.tests.ts               # @auth — login, registration, navigation links
  browsing.tests.ts           # @browsing — homepage, product list, filters, sorting, search
  cart-checkout.tests.ts      # @cart-checkout — cart, promo codes, checkout, order history
  cookie-consent.tests.ts     # @cookie — banner, preferences, persistence
```

## Path Alias

`@/` maps to `src/`. Use it for all imports within `src/`.

## Environment Variables (`.env`)

| Variable | Type | Description |
|---|---|---|
| `APP_URL` | url | Base URL for `baseURL` in Playwright config; also `pagePath` for `HomePage` |
| `LOGIN_PAGE_PATH` | str | Login page path |
| `REGISTER_PAGE_PATH` | str | Register page path |
| `PRODUCTS_PAGE_PATH` | str | Product list page path |
| `CART_PAGE_PATH` | str | Cart page path |
| `CHECKOUT_PAGE_PATH` | str | Checkout page path |
| `ACCOUNT_PAGE_PATH` | str | Account page path |
| `CONFIRMATION_PAGE_PATH` | str | Order confirmation page path |
| `APP_USERNAME` | str | Test account username |
| `APP_PASSWORD` | str | Test account password |
| `CI` | bool | Enables headless mode |
| `PW_MAX_RETRIES` | 1\|2\|3\|4 | Test retry count |
| `PW_WORKERS` | 1\|2\|3\|4 | Number of parallel workers |
| `PW_SLOW_MO` | number | Milliseconds to slow down each browser action (default: `0`) |

## Adding New Pages / Components

1. Create the class in `src/app/pages/` or `src/app/components/`, extending `AppPage` or `Component`.
2. Add it as a property of `App` in `src/app/index.ts`.
3. Decorate every public async method with `@step(...)`.
4. For iframe-based components, keep `private frameLocator` as a string and use both `this.$(this.frameLocator)` (to check iframe visibility) and `this.page.frameLocator(this.frameLocator)` (to interact with elements inside).

## Known Issues

| Issue | Location | Notes |
|---|---|---|
| `verifyOrderCount(1)` breaks on re-run | `cart-checkout.tests.ts` — "Placing an order" test | The shared test account accumulates orders in `localStorage`. Add a `beforeEach` localStorage reset or assert relative order count. |
| Broken checkout redirect | `cart-checkout.tests.ts` — "Unauthenticated checkout from cart page" | After login, the app redirects to home instead of checkout. Marked with `//TODO` and expected to fail until the app bug is fixed. |

