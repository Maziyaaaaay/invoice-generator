# Invoice Studio

A free, private, no-signup invoice generator. Everything runs client-side —
your details and every invoice you make stay on your device and are never
uploaded anywhere.

## Features

- Live two-pane editor: fill in the form on the left, watch a print-ready
  invoice update on the right in real time
- Your sender profile (name, address, payment details, logo) is the only
  thing saved — to `localStorage`, on this device only
- A portable "personal link" packs your saved profile into a URL so you can
  reopen the tool pre-filled on another device, with a privacy warning since
  payment details live in the link itself
- 4 distinct invoice themes (Aurora, Ledger, Signature, Mono) with an accent
  colour picker that computes readable, contrast-safe text automatically
- Optional logo upload with automatic accent-colour suggestion pulled from
  the logo's dominant colour
- 14 currencies with correct locale-aware formatting
- Save as PDF via the browser's native print dialog — no PDF library needed
- Fully responsive, with a persistent mobile action bar

## Stack

Next.js 14 (App Router) + TypeScript + Tailwind CSS. No backend, no
database — state lives in React context, persistence is `localStorage` and
a URL hash.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — dev server
- `npm run build` / `npm run start` — production build & serve
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — Next.js lint
