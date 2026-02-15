-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROJECTS TABLE
create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  topic text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'active' -- active, archived, completed
);

-- Enable RLS
alter table projects enable row level security;

-- Policies
create policy "Users can create their own projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Users can update their own projects"
  on projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on projects for delete
  using (auth.uid() = user_id);


-- GENERATIONS TABLE (Stores data for each tab)
create table if not exists generations (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects on delete cascade not null,
  user_id uuid references auth.users not null,
  type text not null, -- 'strategy', 'script', 'titles', etc.
  content jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table generations enable row level security;

-- Policies
create policy "Users can manage their own generations"
  on generations for all
  using (auth.uid() = user_id);


-- ASSETS TABLE (Images, Files)
create table if not exists assets (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects on delete cascade,
  user_id uuid references auth.users not null,
  type text not null, -- 'image', 'video', 'pdf'
  url text not null,
  prompt text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table assets enable row level security;

create policy "Users can manage their own assets"
  on assets for all
  using (auth.uid() = user_id);


-- TEAMS TABLE
create table if not exists teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  owner_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table teams enable row level security;

create policy "Users can view teams they belong to"
  on teams for select
  using (
    auth.uid() = owner_id or
    exists (select 1 from team_members where team_id = teams.id and user_id = auth.uid())
  );

create policy "Owners can manage teams"
  on teams for all
  using (auth.uid() = owner_id);


-- TEAM MEMBERS TABLE
create table if not exists team_members (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references teams on delete cascade not null,
  user_id uuid references auth.users, -- can be null if pending invite
  email text not null,
  role text default 'viewer', -- 'admin', 'editor', 'viewer'
  status text default 'pending', -- 'pending', 'active'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, email)
);

alter table team_members enable row level security;

create policy "Team members can view other members"
  on team_members for select
  using (
    exists (
      select 1 from team_members tm 
      where tm.team_id = team_members.team_id 
      and tm.user_id = auth.uid()
    ) or 
    exists (select 1 from teams where id = team_members.team_id and owner_id = auth.uid())
  );

create policy "Owners and Admins can manage members"
  on team_members for all
  using (
    exists (select 1 from teams where id = team_members.team_id and owner_id = auth.uid()) or
    exists (
      select 1 from team_members tm 
      where tm.team_id = team_members.team_id 
      and tm.user_id = auth.uid() 
      and tm.role = 'admin'
    )
  );


-- COMMENTS TABLE
create table if not exists comments (
  id uuid default uuid_generate_v4() primary key,
  context_id text not null, -- 'strategy', 'script', or specific project ID
  user_id uuid references auth.users not null,
  team_id uuid references teams on delete cascade, -- null for personal workspace
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table comments enable row level security;

create policy "Users can view comments in their context"
  on comments for select
  using (
    team_id is null and user_id = auth.uid() or -- Personal comments
    exists ( -- Team comments
      select 1 from team_members tm 
      where tm.team_id = comments.team_id 
      and tm.user_id = auth.uid()
    ) or
    exists (select 1 from teams where id = comments.team_id and owner_id = auth.uid())
  );

create policy "Users can create comments"
  on comments for insert
  with check (auth.uid() = user_id);


-- INDEXES for performance
create index if not exists projects_user_id_idx on projects (user_id);
create index if not exists generations_project_id_idx on generations (project_id);
create index if not exists assets_user_id_idx on assets (user_id);
create index if not exists team_members_team_id_idx on team_members (team_id);
create index if not exists team_members_user_id_idx on team_members (user_id);
create index if not exists comments_context_id_idx on comments (context_id);
