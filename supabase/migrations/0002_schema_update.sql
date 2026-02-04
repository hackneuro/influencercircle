create extension if not exists "pgcrypto";

create or replace function public.set_current_timestamp_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

alter table public.profiles
  add column if not exists username text,
  add column if not exists bio text,
  add column if not exists tags text[] default '{}'::text[],
  add column if not exists objective text,
  add column if not exists market_objective text,
  add column if not exists location_objective text,
  add column if not exists average_content_price numeric,
  add column if not exists about_yourself text,
  add column if not exists role text,
  add column if not exists is_premium boolean default false,
  add column if not exists is_public boolean default true,
  add column if not exists advisor_sub_choices text[] default '{}'::text[],
  add column if not exists influencer_channels text[] default '{}'::text[],
  add column if not exists student_level text[] default '{}'::text[],
  add column if not exists company_type text[] default '{}'::text[],
  add column if not exists investor_type text[] default '{}'::text[],
  add column if not exists campaign_preference text,
  add column if not exists social_cause_preference text;

update public.profiles
set disclaimer_accepted = false
where disclaimer_accepted is null;

alter table public.profiles
  alter column disclaimer_accepted set not null,
  alter column disclaimer_accepted set default false;

alter table public.profiles
  add constraint profiles_id_fkey
  foreign key (id) references auth.users(id) on delete cascade;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_username_key'
  ) then
    alter table public.profiles
      add constraint profiles_username_key unique (username);
  end if;
end;
$$;

do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'profiles_plan_check'
  ) then
    alter table public.profiles
      drop constraint profiles_plan_check;
  end if;
end;
$$;

alter table public.profiles
  alter column plan drop default;

alter table public.profiles
  add constraint profiles_plan_check
  check (plan in ('member', 'elite', 'advisor'));

alter table public.profiles
  alter column plan set default 'member';

update public.profiles
set role = coalesce(role, 'user');

alter table public.profiles
  alter column role set not null,
  add constraint profiles_role_check
  check (role in ('user', 'influencer', 'admin'));

alter table public.profiles
  alter column is_premium set not null,
  alter column is_public set not null;

drop trigger if exists set_timestamp_profiles on public.profiles;

create trigger set_timestamp_profiles
before update on public.profiles
for each row
execute procedure public.set_current_timestamp_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "Select public or own profiles" on public.profiles;
drop policy if exists "Insert own profile" on public.profiles;
drop policy if exists "Update own profile" on public.profiles;
drop policy if exists "Service role full access to profiles" on public.profiles;

create policy "Select public or own profiles"
on public.profiles
for select
using (
  is_public = true
  or id = auth.uid()
);

create policy "Insert own profile"
on public.profiles
for insert
with check (id = auth.uid());

create policy "Update own profile"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "Service role full access to profiles"
on public.profiles
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

do $$
begin
  if not exists (
    select 1 from pg_type where typname = 'order_status'
  ) then
    create type public.order_status as enum (
      'pending',
      'paid',
      'processing',
      'completed',
      'failed',
      'canceled',
      'refunded'
    );
  end if;
end;
$$;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  category text,
  price numeric(10, 2) not null,
  currency text not null default 'USD',
  stripe_price_id text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_timestamp_services on public.services;

create trigger set_timestamp_services
before update on public.services
for each row
execute procedure public.set_current_timestamp_updated_at();

alter table public.services enable row level security;

drop policy if exists "Select active services" on public.services;
drop policy if exists "Insert own services" on public.services;
drop policy if exists "Update own services" on public.services;
drop policy if exists "Delete own services" on public.services;
drop policy if exists "Service role manage platform services" on public.services;

create policy "Select active services"
on public.services
for select
using (
  is_active = true
  and (
    owner_id is null
    or exists (
      select 1 from public.profiles p
      where p.id = owner_id
        and p.is_public = true
    )
  )
);

create policy "Insert own services"
on public.services
for insert
to authenticated
with check (owner_id = auth.uid());

create policy "Update own services"
on public.services
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "Delete own services"
on public.services
for delete
to authenticated
using (owner_id = auth.uid());

create policy "Service role manage platform services"
on public.services
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete restrict,
  amount numeric(10, 2) not null,
  currency text not null,
  status public.order_status not null default 'pending',
  post_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_timestamp_orders on public.orders;

create trigger set_timestamp_orders
before update on public.orders
for each row
execute procedure public.set_current_timestamp_updated_at();

alter table public.orders enable row level security;

drop policy if exists "Select own orders" on public.orders;
drop policy if exists "Insert own orders" on public.orders;
drop policy if exists "Service role full access to orders" on public.orders;

create policy "Select own orders"
on public.orders
for select
to authenticated
using (buyer_id = auth.uid());

create policy "Insert own orders"
on public.orders
for insert
to authenticated
with check (buyer_id = auth.uid());

create policy "Service role full access to orders"
on public.orders
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

alter table public.ssi_history enable row level security;

drop policy if exists "Select own ssi history" on public.ssi_history;
drop policy if exists "Insert own ssi history" on public.ssi_history;
drop policy if exists "Update own ssi history" on public.ssi_history;
drop policy if exists "Service role full access to ssi_history" on public.ssi_history;

create policy "Select own ssi history"
on public.ssi_history
for select
to authenticated
using (user_id = auth.uid());

create policy "Insert own ssi history"
on public.ssi_history
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Update own ssi history"
on public.ssi_history
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Service role full access to ssi_history"
on public.ssi_history
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

