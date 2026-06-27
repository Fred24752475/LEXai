# LexGH

AI-powered business compliance guide for Ghanaian entrepreneurs and SMEs.

## Stack

- Next.js 14 App Router + TypeScript
- TailwindCSS custom UI
- Supabase Auth + Postgres
- xAI Grok API through the OpenAI SDK compatibility layer

## Local setup

```bash
yarn
yarn dev
```

Copy `.env.example` to `.env.local` and fill in Supabase + xAI values.

## Database

Run `supabase/migrations/001_initial_schema.sql` in Supabase SQL editor.
