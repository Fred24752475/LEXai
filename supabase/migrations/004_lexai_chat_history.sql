create table if not exists public.lexai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'LexAI conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lexai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.lexai_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.lexai_conversations enable row level security;
alter table public.lexai_messages enable row level security;

create policy "Users can read their LexAI conversations"
  on public.lexai_conversations for select
  using (auth.uid() = user_id);

create policy "Users can insert their LexAI conversations"
  on public.lexai_conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their LexAI conversations"
  on public.lexai_conversations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can read their LexAI messages"
  on public.lexai_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert their LexAI messages"
  on public.lexai_messages for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.lexai_conversations c
      where c.id = lexai_messages.conversation_id
        and c.user_id = auth.uid()
    )
  );

drop trigger if exists set_lexai_conversations_updated_at on public.lexai_conversations;
create trigger set_lexai_conversations_updated_at
  before update on public.lexai_conversations
  for each row
  execute function public.set_updated_at();

create index if not exists lexai_conversations_user_id_idx
  on public.lexai_conversations(user_id, updated_at desc);

create index if not exists lexai_messages_conversation_id_idx
  on public.lexai_messages(conversation_id, created_at asc);
