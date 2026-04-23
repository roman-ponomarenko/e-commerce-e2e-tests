# Test Cases — Northwind Goods

> ✅ = implemented · ⚠️ = high value, not yet implemented

Guided by the [Test Automation Manifest](./MANIFEST.MD): quality over quantity, transparency over comfort.

---

## 1. Browsing

| # | Test case | Notes |
|---|---|---|
| ✅ | Homepage loads with hero, free-shipping banner, category tiles, and featured products | |
| ✅ | Product list loads with all 16 products | |
| ✅ | Filtering by Men's Apparel shows only 4 men's products | Validates the filter mechanism; other categories omitted — same code path |
| ✅ | Selecting ALL resets filter and shows all 16 products | Reset behaviour is distinct from filter |
| ✅ | Combining category filter and search narrows results correctly | Cross-feature interaction; highest-risk source of edge-case bugs |
| ✅ | Search for 'tee' shows matching products and hides unrelated ones | |
| ✅ | Clearing search restores all 16 products | |
| ✅ | Sort price low→high orders products ascending | |
| ✅ | Sort price high→low orders products descending | |
| ✅ | Sort name A→Z orders products alphabetically | |
| ✅ | Clicking a category tile on homepage navigates to filtered product list | Homepage → ProductList state transition |
| ✅ | 'Shop all products' CTA navigates to `/products` | Homepage → ProductList state transition |

> **Omitted:** Filtering by Women's Apparel, Accessories, and Home & Living — these exercise the same filter mechanism as the Men's Apparel case. Three additional tests would inflate the suite without improving confidence (Principle 3).

---

## 2. Product Detail

| # | Test case | Notes |
|---|---|---|
| ✅ | Product detail page loads with name, price, stock badge, description, and size selector | Name, price, stock, description: `browsing` — Product detail page; size selector: `cart-checkout` — Size selection test (Cashmere Cardigan — guaranteed apparel with sizes) |
| ✅ | Attempting to add to cart without selecting a size shows validation | Common drop-off point for real users |
| ✅ | Quantity stepper increments and decrements value | |
| ✅ | Quantity cannot go below 1 | Decrement button is `disabled` at qty=1, enabled at qty≥2; verified in `cart-checkout` — Size selection test |
| ✅ | Adding to cart increments the cart count in the header | |
| ⚠️ | Out-of-stock product shows disabled Add to Cart button | Edge case — requires a known out-of-stock fixture |
| ✅ | Related products grid is shown and each card navigates to that product | ProductDetail → ProductDetail state transition |
| ✅ | Breadcrumb links navigate back to the correct category and shop | |

---

## 3. Cart

### Cart Drawer

| # | Test case | Notes |
|---|---|---|
| ✅ | Cart drawer opens when clicking the cart button in the header | |
| ✅ | Cart drawer shows added item with correct name, selected size, and price | |
| ✅ | Cart drawer quantity stepper updates the line total | |
| ✅ | Removing an item from the cart drawer empties the cart | |
| ✅ | Empty cart drawer shows empty state message | |
| ✅ | "View cart" button navigates to `/cart` | CartDrawer → CartPage state transition |
| ✅ | Authenticated "Checkout" button navigates to checkout | CartDrawer → Checkout state transition |
| ✅ | Unauthenticated "Checkout" button redirects to login | CartDrawer → Login state transition |

### Cart Page (`/cart`)

| # | Test case | Notes |
|---|---|---|
| ✅ | Cart page loads with item list, promo form, and order summary | |
| ✅ | Increasing quantity updates the subtotal | |
| ✅ | Removing an item removes the line and updates the total | |
| ✅ | Applying a valid promo code updates the order total | Validates the promo-code integration |
| ✅ | Applying an invalid promo code shows an error | |
| ✅ | Free shipping notice appears when the order qualifies | |
| ✅ | Product name link navigates back to the product detail page | CartPage → ProductDetail state transition |

---

## 4. Authentication

| # | Test case | Notes |
|---|---|---|
| ✅ | Login with valid credentials redirects to home and shows account in header | |
| ✅ | Login with invalid password shows an error message | |
| ✅ | Login with an unregistered email shows an error message | Different error path from wrong password |
| ✅ | Login form with empty fields shows validation errors | |
| ✅ | Register with valid data creates account and logs in | |
| ✅ | Register with mismatched passwords shows an error | |
| ✅ | Register with an already-used email shows an error | |
| ✅ | Register form with empty fields shows validation errors | |
| ✅ | "Sign in" link on the register page navigates to login | Register → Login state transition |
| ✅ | "Create account" link on the login page navigates to register | Login → Register state transition |
| ✅ | Logout clears the session and removes account access | Account → Homepage state transition |
| ✅ | Unauthenticated access to `/checkout` redirects to `/login?redirect=/checkout` | Auth guard |
| ✅ | Login from checkout redirect preserves destination and lands on checkout | Login → Checkout state transition (critical path) |

---

## 5. Checkout

| # | Test case | Notes |
|---|---|---|
| ✅ | Checkout page loads with shipping form, payment form, and order summary | |
| ✅ | Order summary reflects correct items, subtotal, and shipping cost | |
| ✅ | Placing an order with all valid fields navigates to the confirmation page | Happy-path end-to-end; highest-value test in the suite |
| ⚠️ | Confirmation page shows order ID, items ordered, and total | Order ID and total are verified; items ordered not yet asserted |
| ✅ | Confirmed order appears in account order history | Confirmation → Account state transition |
| ✅ | Checkout form shows validation errors for missing required fields | |

---

## 6. Cookie Consent

| # | Test case | Notes |
|---|---|---|
| ✅ | Cookie banner is shown on first visit with Accept all / Decline / Customize options | |
| ✅ | Accepting all cookies hides the banner and shows the trust badge | |
| ✅ | Trust badge opens the preference center | |
| ✅ | Advertising and analytics cookies can be unchecked; essential is disabled | |
| ✅ | Declining cookies hides the banner | |
| ✅ | Customising and saving selected preferences hides the banner | |
| ✅ | Cookie preferences persist after page reload | Requires checking localStorage |
| ✅ | Banner reappears in a fresh browser session (no stored consent) | Requires a clean browser context |

---

## Explicitly Excluded

These scenarios were considered and deliberately omitted. They can be promoted if confidence gaps emerge (Principle 1 — make decisions visible).

| Scenario | Reason |
|---|---|
| Filter by Women's Apparel / Accessories / Home & Living | Same mechanism as Men's Apparel filter; covered by that single test |
| Unauthenticated access to `/account` | Same auth-guard mechanism as the `/checkout` redirect; one test validates the pattern |
| Sort Z→A | No Z→A option exists in the UI |
| Payment method edge cases (declined card, etc.) | No backend — all data is in-memory; a declined-card state cannot be reproduced reliably |
| Selecting a size enables the Add to Cart button | The button is never disabled in this app — `disabled: false` before and after size selection. No-size validation is handled via a toast on click, which is already covered by the "add to cart without size" test |
