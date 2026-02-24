-- =============================================
-- Creator Intelligence OS — Supabase Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- STEP 1: CREATE ALL TABLES
-- =============================================

-- IMPORTANT: `teams` and `team_members` must come first because other tables reference them

create table if not exists teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  owner_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists team_members (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references teams on delete cascade not null,
  user_id uuid references auth.users,
  email text not null,
  role text default 'viewer',
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, email)
);

create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  team_id uuid references teams on delete set null,
  topic text not null,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists generations (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects on delete cascade not null,
  user_id uuid references auth.users not null,
  type text not null,
  content jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Composite unique so we can upsert by (project_id, type)
  unique(project_id, type)
);

create table if not exists assets (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects on delete cascade,
  user_id uuid references auth.users not null,
  type text not null,
  url text not null,
  prompt text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists comments (
  id uuid default uuid_generate_v4() primary key,
  context_id text not null,
  user_id uuid references auth.users not null,
  team_id uuid references teams on delete cascade,
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists activity_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  team_id uuid references teams on delete cascade,
  project_id uuid references projects on delete cascade,
  type text not null,
  description text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- tasks must be created BEFORE RLS is enabled on it
create table if not exists tasks (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects on delete cascade not null,
  team_id uuid references teams on delete cascade,
  user_id uuid references auth.users not null,
  assigned_to uuid references auth.users,
  title text not null,
  description text,
  status text default 'todo',
  priority text default 'medium',
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- =============================================
-- STEP 2: ENABLE ROW LEVEL SECURITY
-- =============================================

alter table projects      enable row level security;
alter table generations   enable row level security;
alter table assets        enable row level security;
alter table teams         enable row level security;
alter table team_members  enable row level security;
alter table comments      enable row level security;
alter table activity_log  enable row level security;
alter table tasks         enable row level security;


-- =============================================
-- STEP 3: POLICIES (drop first for re-runs)
-- =============================================

-- Projects
drop policy if exists "Users can create their own projects"          on projects;
drop policy if exists "Users can view projects they have access to"  on projects;
drop policy if exists "Users can update projects they have access to" on projects;
drop policy if exists "Users can delete projects they have access to" on projects;

create policy "Users can create their own projects"
  on projects for insert with check (auth.uid() = user_id);

create policy "Users can view projects they have access to"
  on projects for select using (
    auth.uid() = user_id or
    (team_id is not null and exists (
      select 1 from team_members where team_id = projects.team_id and user_id = auth.uid()
    ))
  );

create policy "Users can update projects they have access to"
  on projects for update using (
    auth.uid() = user_id or
    (team_id is not null and exists (
      select 1 from team_members
      where team_id = projects.team_id and user_id = auth.uid() and role in ('owner','admin','editor')
    ))
  );

create policy "Users can delete projects they have access to"
  on projects for delete using (
    auth.uid() = user_id or
    (team_id is not null and exists (
      select 1 from team_members
      where team_id = projects.team_id and user_id = auth.uid() and role in ('owner','admin')
    ))
  );

-- Generations
drop policy if exists "Users can manage their own generations" on generations;
drop policy if exists "Users can manage generations via projects" on generations;

create policy "Users can manage generations via projects"
  on generations for all using (
    exists (
      select 1 from projects
      where projects.id = generations.project_id
        and (
          projects.user_id = auth.uid() or
          (projects.team_id is not null and exists (
            select 1 from team_members tm
            where tm.team_id = projects.team_id and tm.user_id = auth.uid()
          ))
        )
    )
  );

-- Assets
drop policy if exists "Users can manage their own assets" on assets;
drop policy if exists "Users can manage assets via projects" on assets;

create policy "Users can manage assets via projects"
  on assets for all using (
    auth.uid() = user_id or
    exists (
      select 1 from projects
      where projects.id = assets.project_id
        and (
          projects.user_id = auth.uid() or
          (projects.team_id is not null and exists (
            select 1 from team_members tm
            where tm.team_id = projects.team_id and tm.user_id = auth.uid()
          ))
        )
    )
  );

-- Teams
drop policy if exists "Users can view teams they belong to" on teams;
drop policy if exists "Owners can manage teams"             on teams;

create policy "Users can view teams they belong to"
  on teams for select using (
    auth.uid() = owner_id or
    exists (select 1 from team_members where team_id = teams.id and user_id = auth.uid())
  );

create policy "Owners can manage teams"
  on teams for all using (auth.uid() = owner_id);

-- Team Members
drop policy if exists "Team members can view other members"  on team_members;
drop policy if exists "Owners and Admins can manage members" on team_members;

create policy "Team members can view other members"
  on team_members for select using (
    exists (select 1 from team_members tm where tm.team_id = team_members.team_id and tm.user_id = auth.uid()) or
    exists (select 1 from teams where id = team_members.team_id and owner_id = auth.uid())
  );

create policy "Owners and Admins can manage members"
  on team_members for all using (
    exists (select 1 from teams where id = team_members.team_id and owner_id = auth.uid()) or
    exists (select 1 from team_members tm where tm.team_id = team_members.team_id and tm.user_id = auth.uid() and tm.role = 'admin')
  );

-- Comments
drop policy if exists "Users can view comments in their context" on comments;
drop policy if exists "Users can create comments"                on comments;

create policy "Users can view comments in their context"
  on comments for select using (
    (team_id is null and user_id = auth.uid()) or
    exists (select 1 from team_members tm where tm.team_id = comments.team_id and tm.user_id = auth.uid()) or
    exists (select 1 from teams where id = comments.team_id and owner_id = auth.uid())
  );

create policy "Users can create comments"
  on comments for insert with check (auth.uid() = user_id);

-- Activity Log
drop policy if exists "Users can view activity in their context" on activity_log;
drop policy if exists "System can log activity"                  on activity_log;
drop policy if exists "Users can log their own activity"         on activity_log;

create policy "Users can view activity in their context"
  on activity_log for select using (
    (team_id is null and user_id = auth.uid()) or
    exists (select 1 from team_members tm where tm.team_id = activity_log.team_id and tm.user_id = auth.uid()) or
    exists (select 1 from teams where id = activity_log.team_id and owner_id = auth.uid())
  );

create policy "Users can log their own activity"
  on activity_log for insert with check (auth.uid() = user_id);

-- Tasks
drop policy if exists "Users can view tasks in their context"   on tasks;
drop policy if exists "Users can manage tasks in their context" on tasks;

create policy "Users can view tasks in their context"
  on tasks for select using (
    (team_id is null and user_id = auth.uid()) or
    exists (select 1 from team_members tm where tm.team_id = tasks.team_id and tm.user_id = auth.uid()) or
    exists (select 1 from teams where id = tasks.team_id and owner_id = auth.uid())
  );

create policy "Users can manage tasks in their context"
  on tasks for all using (
    (team_id is null and user_id = auth.uid()) or
    exists (
      select 1 from team_members tm
      where tm.team_id = tasks.team_id and tm.user_id = auth.uid() and tm.role in ('owner','admin','editor')
    ) or
    exists (select 1 from teams where id = tasks.team_id and owner_id = auth.uid())
  );


-- =============================================
-- STEP 4: REALTIME — enable for all tables
-- =============================================

-- Run these in the Supabase dashboard under Database → Replication
-- OR execute via SQL (requires superuser in some versions):

alter publication supabase_realtime add table projects;
alter publication supabase_realtime add table generations;
alter publication supabase_realtime add table assets;
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table activity_log;
alter publication supabase_realtime add table team_members;
alter publication supabase_realtime add table teams;


-- =============================================
-- STEP 5: INDEXES
-- =============================================

create index if not exists projects_user_id_idx       on projects     (user_id);
create index if not exists projects_team_id_idx        on projects     (team_id);
create index if not exists generations_project_id_idx  on generations  (project_id);
create index if not exists generations_project_type_idx on generations (project_id, type);
create index if not exists assets_user_id_idx          on assets       (user_id);
create index if not exists assets_project_id_idx        on assets      (project_id);
create index if not exists team_members_team_id_idx    on team_members (team_id);
create index if not exists team_members_user_id_idx    on team_members (user_id);
create index if not exists comments_context_id_idx     on comments     (context_id);
create index if not exists activity_log_team_id_idx    on activity_log (team_id);
create index if not exists activity_log_project_id_idx on activity_log (project_id);
create index if not exists activity_log_user_id_idx    on activity_log (user_id);
create index if not exists tasks_project_id_idx        on tasks        (project_id);
create index if not exists tasks_team_id_idx           on tasks        (team_id);
create index if not exists tasks_assigned_to_idx       on tasks        (assigned_to);
