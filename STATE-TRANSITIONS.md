# State Transition Diagram — Northwind Goods App

```mermaid
stateDiagram-v2
    [*] --> Homepage : Visit site

    Homepage --> ProductList : Shop All CTA / category tile / Shop nav
    Homepage --> ProductDetail : Featured product card

    ProductList --> ProductDetail : Product card click
    ProductList --> ProductList : Filter / sort / search

    ProductDetail --> ProductDetail : Related product card
    ProductDetail --> CartDrawer : Add to cart

    CartDrawer --> CartPage : View cart
    CartDrawer --> Checkout : Checkout [authenticated]
    CartDrawer --> Login : Checkout [unauthenticated]

    CartPage --> Checkout : Proceed to checkout [authenticated]
    CartPage --> Login : Proceed to checkout [unauthenticated]
    CartPage --> ProductDetail : Product name link

    Login --> Homepage : Login success (no redirect)
    Login --> Checkout : Login success (?redirect=/checkout)
    Login --> Register : Create account link

    Register --> Homepage : Registration success
    Register --> Login : Sign in link

    Checkout --> Confirmation : Place order

    Confirmation --> ProductList : Continue shopping
    Confirmation --> Account : View order history

    Account --> Homepage : Logout

    Homepage --> Homepage : Logo / Home nav (any page)
    ProductList --> Homepage : Logo / Home nav (any page)
    ProductDetail --> Homepage : Logo / Home nav (any page)
    CartPage --> Homepage : Logo / Home nav (any page)
    Checkout --> Homepage : Logo / Home nav (any page)
    Confirmation --> Homepage : Logo / Home nav (any page)
    Account --> Homepage : Logo / Home nav (any page)
```

---

## Key User Journeys

Three journeys worth testing end-to-end. Each exercises a distinct user goal and a different
code path. Anything not covered here (logo nav, sort/search loops, etc.) is either already
captured by lower-level tests or too low-value to justify a full E2E run.

---

### Journey 1 — Authenticated Purchase (core happy path)

The highest-value test in the suite. Covers browse → cart → checkout → confirmation without
any auth friction. If this breaks, the site cannot generate revenue.

```mermaid
stateDiagram-v2
    [*] --> Homepage

    Homepage --> ProductList  : Shop All CTA / category tile / Shop nav
    Homepage --> ProductDetail : Featured product card

    ProductList --> ProductDetail : Product card click

    ProductDetail --> CartDrawer : Add to cart

    CartDrawer --> Checkout : Go to checkout [authenticated]
    CartDrawer --> CartPage  : View cart

    CartPage --> Checkout : Proceed to checkout

    Checkout --> Confirmation : Place order

    Confirmation --> [*] : Journey complete
```

---

### Journey 2 — Guest Purchase (auth gate + redirect)

Same purchase goal as Journey 1, but the user hits the auth gate. Tests that the redirect
round-trip (`?redirect=/checkout`) lands correctly after login and that registration feeds
back into the purchase funnel.

```mermaid
stateDiagram-v2
    [*] --> Homepage

    Homepage --> ProductDetail : Browse to product

    ProductDetail --> CartDrawer : Add to cart

    CartDrawer --> CartPage : View cart

    CartPage --> Login : Proceed [unauthenticated]

    Login --> Register  : Create account link
    Register --> Login  : Sign in link

    Login --> Checkout : Login success (?redirect=/checkout)

    Checkout --> Confirmation : Place order

    Confirmation --> [*] : Journey complete
```

---

### Journey 3 — Browse & Discover

Covers the discovery path that feeds the funnel. Validates that filtering, category navigation,
and the product breadcrumb all lead users to the right product — and that the detail page
correctly reflects what was clicked.

```mermaid
stateDiagram-v2
    [*] --> Homepage

    Homepage --> ProductList  : Shop All CTA / category tile / Shop nav
    Homepage --> ProductDetail : Featured product card

    ProductList --> ProductList   : Filter / sort / search
    ProductList --> ProductDetail : Product card click

    ProductDetail --> ProductList   : Category breadcrumb link
    ProductDetail --> ProductDetail : Related product card

    ProductDetail --> [*] : End of discovery (→ add to cart or exit)
```

---

## Auth guards

| Route | Unauthenticated |
|---|---|
| `/checkout` | Redirect to `/login?redirect=/checkout` |
| `/account` | Redirect to `/login` |

## Cart drawer

The cart drawer is an overlay (not a full page) triggered from the header cart button on any page. It provides shortcuts to `/cart` and `/checkout`.