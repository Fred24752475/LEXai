create table if not exists public.document_verifications (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.compliance_reports(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  verification_kind text not null default 'checklist_step'
    check (verification_kind in ('checklist_step', 'health_action')),
  step_index integer not null,
  item_title text not null,
  authority text not null,
  required_documents text[] not null default '{}',
  status text not null
    check (status in ('verified', 'failed')),
  message text not null,
  checked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (report_id, user_id, verification_kind, step_index)
);

alter table public.document_verifications enable row level security;

create policy "Users can read their own document verifications"
  on public.document_verifications for select
  using (auth.uid() = user_id);

create policy "Users can insert their own document verifications"
  on public.document_verifications for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.compliance_reports cr
      join public.businesses b on b.id = cr.business_id
      where cr.id = document_verifications.report_id
        and b.user_id = auth.uid()
    )
  );

create policy "Users can update their own document verifications"
  on public.document_verifications for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.compliance_reports cr
      join public.businesses b on b.id = cr.business_id
      where cr.id = document_verifications.report_id
        and b.user_id = auth.uid()
    )
  );

drop trigger if exists set_document_verifications_updated_at on public.document_verifications;
create trigger set_document_verifications_updated_at
  before update on public.document_verifications
  for each row
  execute function public.set_updated_at();

create index if not exists document_verifications_user_id_idx
  on public.document_verifications(user_id);

create index if not exists document_verifications_report_id_idx
  on public.document_verifications(report_id);
