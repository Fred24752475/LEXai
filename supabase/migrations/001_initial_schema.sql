create extension if not exists "pgcrypto";

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('new', 'existing')),
  created_at timestamptz not null default now()
);

create table if not exists public.compliance_reports (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  report_type text not null check (report_type in ('checklist', 'healthcheck')),
  score integer check (score is null or (score >= 0 and score <= 100)),
  data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.businesses enable row level security;
alter table public.compliance_reports enable row level security;

create policy "Users can read their businesses"
  on public.businesses for select
  using (auth.uid() = user_id);

create policy "Users can insert their businesses"
  on public.businesses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their businesses"
  on public.businesses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their businesses"
  on public.businesses for delete
  using (auth.uid() = user_id);

create policy "Users can read their reports"
  on public.compliance_reports for select
  using (
    exists (
      select 1
      from public.businesses
      where businesses.id = compliance_reports.business_id
        and businesses.user_id = auth.uid()
    )
  );

create policy "Users can insert reports for their businesses"
  on public.compliance_reports for insert
  with check (
    exists (
      select 1
      from public.businesses
      where businesses.id = compliance_reports.business_id
        and businesses.user_id = auth.uid()
    )
  );

create index if not exists businesses_user_id_idx on public.businesses(user_id);
create index if not exists compliance_reports_business_id_idx
  on public.compliance_reports(business_id);
