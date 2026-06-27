# LexGH — AI Business Compliance Guide for Ghana

LexGH helps Ghanaian entrepreneurs and SMEs stay compliant with Ghana's corporate
regulations (Office of the Registrar of Companies, GRA, SSNIT, and more). It produces
two structured, visual outputs:

1. **Business Setup Checklist** — a personalised, step-by-step registration checklist
   generated from a 5-question wizard.
2. **Compliance Health Check** — a visual, colour-coded audit with a compliance score
   for an existing business.

The intelligence comes from the **xAI Grok API (`grok-4.3`)** using the **live `web_search`
tool**, so guidance reflects current laws and fees rather than a static database.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **TailwindCSS** (custom components, light theme)
- **Supabase** (PostgreSQL + Supabase Auth, Row Level Security)
- **xAI Grok API** via the **OpenAI SDK** (`/v1/responses` + `web_search` tool)
- Deploy on **Vercel**

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your keys:

```bash
cp .env.local.example .env.local
```

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (server only) |
| `SUPABASE_DB_URL` | Supabase → Settings → Database → Connection string (URI) |
| `XAI_API_KEY` | https://console.x.ai → API Keys |

### 3. Set up the database

Apply the schema and Row Level Security policies:

```bash
npm run db:push
```

This runs `supabase/migrations/0001_init.sql` against `SUPABASE_DB_URL`. Alternatively,
paste that file's contents into the Supabase SQL editor and run it.

In Supabase **Authentication → Providers → Email**, you may disable "Confirm email"
during development so new accounts can log in immediately.

### 4. Run the app

```bash
npm run dev
```

Open http://localhost:3000.

## Routes

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/login` | Sign up / log in (Supabase Auth) |
| `/dashboard` | Protected: saved businesses & reports |
| `/setup` | Protected: 5-step setup wizard → checklist |
| `/healthcheck` | Protected: description → audit dashboard |
| `/report/[id]` | Protected: view a saved report (print-friendly) |
| `/api/setup` | POST: Grok checklist generation |
| `/api/healthcheck` | POST: Grok compliance audit |

## Notes on the Grok integration

xAI retired the old Live Search (`search_parameters`) API. LexGH uses the current
approach: the **Responses API** (`client.responses.create`) with the built-in
**`web_search`** tool, accessed through the OpenAI SDK pointed at `https://api.x.ai/v1`.
See `lib/grok.ts`.
