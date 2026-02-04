create table if not exists public.free_post_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_url text not null,
  created_at timestamptz not null default now()
);

alter table public.free_post_submissions enable row level security;

drop policy if exists "Insert own submission" on public.free_post_submissions;
drop policy if exists "Select own submissions" on public.free_post_submissions;

create policy "Insert own submission"
on public.free_post_submissions
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Select own submissions"
on public.free_post_submissions
for select
to authenticated
using (user_id = auth.uid());
