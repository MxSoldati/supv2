# AGENTS.md

## Project Overview

Suplemental is an e-commerce catalog and landing page for a sports supplement store in Argentina, built with modern **Angular (Standalone Components + Signals + Angular Router)** and a responsive dark theme with neon green accents. Checkout is handled via direct WhatsApp messaging, and catalog management is available via a minimalist password-protected `/admin` panel with remote Google Sheets CSV sync and local storage persistence.

## Directory Structure & Roles

- `src/`:
  - `main.ts` & `index.html`: Application entry point.
  - `styles.css`: Global dark theme variables (`--bg-dark: #0f1115`, `--primary-accent: #6dd623`), font Inter, and animations.
  - `app/`:
    - `models/`: TypeScript models (`product.model.ts`, `cart.model.ts`, `objective.model.ts`).
    - `data/`: Initial seed data (`default-products.ts`, `default-objectives.ts`).
    - `services/`:
      - `auth.service.ts`: Master password authentication (`supleadmin2026`) stored in `sessionStorage`.
      - `product.service.ts`: Signal-based catalog state, Google Sheets CSV / JSON remote fetcher, CRUD, and `localStorage` persistence.
      - `cart.service.ts`: Signal-based reactive shopping cart, drawer toggle, and WhatsApp checkout URL builder (`+5492615126087`).
    - `components/`:
      - `navbar/`: Public header with logo, navigation links, and dynamic cart badge.
      - `custom-dropdown/`: Dark dropdowns for Brand and Category filters.
      - `product-card/`: Card with pills for size/flavor selection, color badges, live price formatting, and Add to Cart.
      - `cart-drawer/`: Slide-over cart drawer with quantity adjustments and WhatsApp checkout.
    - `pages/`:
      - `home/` (`/`): Hero, 5 fitness objectives, featured products showcase, and brand concept.
      - `catalog/` (`/productos`): Full catalog with search and Brand/Category filters.
      - `objective-detail/` (`/objetivo/:id`): Dynamic objective view with recommended combo and WhatsApp CTA.
      - `admin/` (`/admin`): Password-protected dashboard with product table, remote URL sync, interactive product/flavor/price editor, and Excel (.xlsx) export/import.
    - `app.routes.ts`: Standalone route declarations.
    - `app.config.ts`: Router and change detection providers.
  - `assets/img/`:
    - `Logos/`: Brand logos (Star Nutrition, Body Advance, Suplemental).
    - `todas/`: WebP product images keyed by code (`A001.webp` - `A032.webp`, `B001.webp` - `B011.webp`).
    - `Accesorios/`: Accessory images.

## Local Development & Commands

- **Run Dev Server**:
  ```bash
  npm start
  # or
  npx ng serve
  ```
  App serves at `http://localhost:4200/`.

- **Build Production Bundle**:
  ```bash
  npm run build
  # or
  npx ng build
  ```
  Output generated in `dist/suplemental/`.

## Key Conventions & Credentials

- **Admin Master Password**: `supleadmin2026` (stored in `sessionStorage` upon successful login).
- **Public URL**: No login buttons or admin links appear on the public pages (`/`, `/productos`, `/objetivo/:id`).
- **Data Persistence**:
  - `suplemental_custom_products` in `localStorage` caches any admin edits or synchronized catalogs.
  - If `localStorage` is empty or cleared, the app gracefully falls back to `DEFAULT_PRODUCTS`.
- **Pricing**: Integer in ARS formatted with `.toLocaleString('es-AR')`. `null` represents *"Consultar precio"*.
- **WhatsApp Phone**: `+5492615126087`.
