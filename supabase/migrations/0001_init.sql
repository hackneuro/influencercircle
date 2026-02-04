create table if not exists profiles (
  id uuid primary key,
  name text not null,
  whatsapp text,
  email text not null,
  city text,
  state text,
  country text,
  linkedin_url text,
  instagram_url text,
  objective text,
  market_objective text,
  location_objective text,
  interaction_charge numeric check (interaction_charge >= 50),
  plan text check (plan in ('member', 'elite')),
  disclaimer_accepted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ssi_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  total_ssi int not null,
  brand_score int not null,
  people_score int not null,
  insight_score int not null,
  relation_score int not null,
  unique (user_id, date)
);

