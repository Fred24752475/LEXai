-- LexGH initial schema
-- Tables: businesses, compliance_reports
-- Row Level Security ensures each user only accesses their own data.

-- ---------------------------------------------------------------------------
-- businesses
-- ---------------------------------------------------------------------------
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  type text not null check (type in ('new', 'existing')),
  created_at timestamptz not null default now()
);

create index if not exists businesses_user_id_idx on public.businesses (user_id);

-- ---------------------------------------------------------------------------
-- compliance_reports
-- ---------------------------------------------------------------------------
create table if not exists public.compliance_reports (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  report_type text not null check (report_type in ('checklist', 'healthcheck')),
  score integer,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists compliance_reports_business_id_idx
  on public.compliance_reports (business_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.businesses enable row level security;
alter table public.compliance_reports enable row level security;

-- businesses policies: a user can only touch rows where they are the owner.
drop policy if exists "businesses_select_own" on public.businesses;
create policy "businesses_select_own" on public.businesses
  for select using (auth.uid() = user_id);

drop policy if exists "businesses_insert_own" on public.businesses;
create policy "businesses_insert_own" on public.businesses
  for insert with check (auth.uid() = user_id);

drop policy if exists "businesses_update_own" on public.businesses;
create policy "businesses_update_own" on public.businesses
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "businesses_delete_own" on public.businesses;
create policy "businesses_delete_own" on public.businesses
  for delete using (auth.uid() = user_id);

-- compliance_reports policies: access is gated by ownership of the parent business.
drop policy if exists "reports_select_own" on public.compliance_reports;
create policy "reports_select_own" on public.compliance_reports
  for select using (
    exists (
      select 1 from public.businesses b
      where b.id = compliance_reports.business_id
        and b.user_id = auth.uid()
    )
  );

drop policy if exists "reports_insert_own" on public.compliance_reports;
create policy "reports_insert_own" on public.compliance_reports
  for insert with check (
    exists (
      select 1 from public.businesses b
      where b.id = compliance_reports.business_id
        and b.user_id = auth.uid()
    )
  );

drop policy if exists "reports_update_own" on public.compliance_reports;
create policy "reports_update_own" on public.compliance_reports
  for update using (
    exists (
      select 1 from public.businesses b
      where b.id = compliance_reports.business_id
        and b.user_id = auth.uid()
    )
  );

drop policy if exists "reports_delete_own" on public.compliance_reports;
create policy "reports_delete_own" on public.compliance_reports
  for delete using (
    exists (
      select 1 from public.businesses b
      where b.id = compliance_reports.business_id
        and b.user_id = auth.uid()
    )
  );
