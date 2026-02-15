-- =================================================
-- ASSETS TABLE (Generated Media: Images & Audio)
-- =================================================
-- Run this in your Supabase SQL Editor.

create table assets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  project_id uuid references projects on delete cascade,
  type text not null check (type in ('image', 'audio')),
  url text not null,
  prompt text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table assets enable row level security;

-- Policies
create policy "Users can manage their own assets"
  on assets for all
  using (auth.uid() = user_id);

-- Index
create index assets_user_id_idx on assets (user_id);
create index assets_project_id_idx on assets (project_id);
