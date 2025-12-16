## Novacrust Assessment – Crypto ↔ Cash Experience

A single-page crypto on/off-ramp experience built with **Next.js 15**, **React 19**, and **TypeScript**, featuring a multi-step flow for:

- **Crypto → Cash (NGN)**
- **Cash → Crypto**
- **Cash → Fiat Loan**

It focuses on a polished UI, smooth stepper-based navigation, and form validation for entering payment and recipient details.

### Live Demo

- **View demo** on [`https://novacrust-assessment-snowy.vercel.app/`](https://novacrust-assessment-snowy.vercel.app/)

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript, React 19
- **Styling**: Tailwind CSS 4, custom global styles
- **UI Toolkit**: Radix UI primitives, custom components (buttons, inputs, dialogs, tabs, steppers)
- **Forms & Validation**: `react-hook-form`, `zod`
- **Utilities & Tooling**: Biome + Ultracite, Husky + lint-staged, `@t3-oss/env-nextjs`

---

## Getting Started

### Prerequisites

- **Node.js** (recommended: LTS, 18+)
- **Package manager**: `bun`, `pnpm`, or `npm` (examples below use `bun`, but any Node-compatible manager works)

### Installation

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd novacrust-assessment
# using bun
bun install
```

### Development

Run the local development server (configured to use port **5000**):

```bash
bun run dev
```

Then open `http://localhost:5000` in your browser.

### Production Build

```bash
# create optimized production build
bun run build

# start production server
bun run start
```

### Additional Scripts

- **`bun run typecheck`**: Run TypeScript type checking.
- **`bun run check`**: Run Biome linting/formatting checks (read-only).
- **`bun run check:write`**: Run Biome and automatically apply safe fixes.
- **`bun run check:unsafe`**: Run Biome with unsafe autofixes (use with care).
- **`bun run preview`**: Build and start the app in production mode in a single command.

---

## Project Structure (Directory Map)

High-level map of the most important folders and files:

```text
.
├─ src/
│  ├─ app/
│  │  ├─ page.tsx                  # Main landing page with the tabbed flow
│  │  ├─ layout.tsx                # Root layout and global app shell
│  │  └─ api/
│  │     └─ crypto-price/
│  │        └─ route.ts            # API route for fetching crypto prices
│  ├─ components/
│  │  ├─ cash-to-crypto-tab.tsx    # Core multi-step conversion flow (forms, steppers)
│  │  ├─ coming-soon.tsx           # Placeholder for routes/features not yet available
│  │  ├─ transaction-processed.tsx # Success and confirmation UI after conversion
│  │  └─ ui/                       # Reusable, design-system-style components
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ tabs.tsx
│  │     ├─ stepper.tsx
│  │     ├─ currency-input.tsx
│  │     ├─ account-number-input.tsx
│  │     ├─ phone-input.tsx
│  │     ├─ dialog.tsx
│  │     ├─ select.tsx
│  │     ├─ token-combobox.tsx
│  │     └─ ...                    # Other form + feedback utilities
│  ├─ assets/
│  │  ├─ icons.tsx                 # SVG/icon components used across the app
│  │  └─ fonts/                    # Local font files (Clash Display, Outfit)
│  ├─ hooks/
│  │  ├─ use-as-ref.ts
│  │  ├─ use-isomorphic-layout-effect.ts
│  │  └─ use-lazy-ref.ts           # Utility hooks for refs and layout effects
│  ├─ lib/
│  │  ├─ constants.tsx             # App constants (tokens, currencies, steps, etc.)
│  │  ├─ utils.ts                  # Generic utility helpers
│  │  └─ compose-refs.ts           # Helper to compose multiple React refs
│  └─ styles/
│     └─ globals.css               # Global Tailwind + custom styles
│
├─ public/
│  └─ favicon.ico                  # App favicon
│
├─ env.js                          # Runtime environment configuration (via @t3-oss/env-nextjs)
├─ biome.jsonc                     # Biome + Ultracite configuration
├─ next.config.js                  # Next.js configuration
├─ tsconfig.json                   # TypeScript configuration
└─ package.json                    # Scripts, dependencies, metadata
```

---

## Feature Overview

- **Multi-step conversion flow**:
  - Enter **payment amount** and select token (e.g. ETH) in the "You pay" section.
  - See the **calculated amount in NGN** and chosen payout method in the "You receive" section.
  - Fill in **recipient details** (bank account, phone, etc.) across steps.
  - Review details on the **confirmation** step and see a **success screen** when done.
- **Wallet & payout options**:
  - "Pay from" (e.g. MetaMask) and "Pay to" (e.g. bank) abstractions for future wallet/bank integrations.
- **Responsive & accessible UI**:
  - Built on Radix primitives with keyboard and screen-reader friendly components.

---

## Development & Code Quality

This project uses **Ultracite** (Biome preset) for consistent formatting and linting.

- Run **`bun x ultracite fix`** (or `bun run check:write`) before committing to auto-fix formatting and most style issues.
- Keep components small, typed, and focused; share behavior via hooks and utility functions in `hooks` and `lib`.

---

## Legacy Scaffolding Notes

The original `create-t3-app` scaffolding notes are kept below for reference and can be safely removed if no longer needed.

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
