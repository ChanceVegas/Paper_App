# Atelier — Custom Wallcoverings

Custom wallpaper design app: clients design a pattern, reserve a production
slot with a 30% deposit, and a routed studio takes it from press to wall.

**Design system:** "Print Shop Precision" — concrete gray ground, zero
border-radius, 1px ink rules, Archivo uppercase display, IBM Plex Mono spec
labels, CMYK bar, registration marks, job-ticket pricing.

## Status

Prototype phase, restructured from a single-file build into Next.js.
All state is **in-memory** (mock payments, mock notifications, seeded with
two demo orders; resets on refresh). Backend, auth, Stripe, and email
notifications are the next milestones.

## Run

```bash
npm install
npm run dev   # http://localhost:3000
```

## Business rules (canonical — do not drift)

- Billable sqft = `ceil(W × H × 1.15)` overage
- Price = billable × material rate ($6.50 matte / $12 grasscloth / $5 peel & stick / $14 mural)
- Deposit = 30% at pre-order; balance due when the studio marks the order ready
- Fulfilment: ship flat $85, or studio install $4.50 × billable sqft
- Order stage is a canonical int 0–5: reserved → production → ready (balance due) → paid → dispatched → complete
- Studio routing by material: matte → Meridian Wallcraft · grasscloth → Kestrel Fibre Atelier · peel → Dayline Print Co. · mural → Grand Format House

## Structure

```
app/            Next.js App Router shell + global stylesheet (design tokens)
components/     App (state container), Designer, RoomPreview, Wallpaper (SVG
                pattern renderer), PaymentModal, BalanceModal, ClientOrders,
                OrderDetail, StudioDashboard, StudioCard, Header, PreviewFrame
lib/            types, pricing (business rules), constants (patterns,
                materials, studios, palettes, stages), color helpers, seed data
```
