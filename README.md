# Lavie Kenya storefront

Next.js site: public catalogue (only in-stock flavors shown), WhatsApp ordering, and a `/admin` page to toggle stock per flavor and set KES prices.

## Run
    npm install
    npm run dev        # http://localhost:3000, admin at /admin

## Config (.env.local)
- `ADMIN_PASSWORD` : password for /admin
- `NEXT_PUBLIC_WHATSAPP_NUMBER` : your number, digits only, with country code (e.g. 2547XXXXXXXX)
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` : needed in production (Vercel has no writable disk).
  Create one table: `create table kv (key text primary key, value jsonb);`
  Locally, stock is stored in `data/state.json`.

## Catalogue
`data/catalog.json` (18 models, flavors, specs) and `public/products/*.webp` came from the supplier price list.
