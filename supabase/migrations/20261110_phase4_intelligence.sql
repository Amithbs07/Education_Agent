-- ==============================================================================
-- CITADEL Education Agent - Phase 4: Advanced Intelligence & Observability Schema
-- ==============================================================================

-- 1. Career Profiles & Skill Assessments
create table if not exists public.career_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  interests text[] default '{}',
  current_skills text[] default '{}',
  target_role text not null default 'AI/ML Engineer',
  target_timeline_months integer default 6,
  experience_level text default 'intermediate',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Career Recommendations & Roadmaps
create table if not exists public.career_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  career_category text not null,
  career_title text not null,
  overview text not null,
  required_skills text[] not null,
  skill_gaps text[] not null,
  milestones jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  recommended_next_action text not null,
  created_at timestamptz default now()
);

-- 3. Personalized Learning Recommendations
create table if not exists public.learning_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  activity text not null,
  reason text not null,
  priority text not null check (priority in ('high', 'medium', 'low')),
  expected_outcome text not null,
  suggested_action text not null,
  action_href text not null default '/',
  category text not null, -- 'weak_topic', 'due_flashcard', 'unfinished_path', 'practice_quiz'
  is_dismissed boolean default false,
  created_at timestamptz default now()
);

-- 4. Proactive Learning Insights
create table if not exists public.learning_insights (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  today_recommended_task text not null,
  topics_to_revise text[] default '{}',
  pending_goals text[] default '{}',
  recommended_quiz text,
  upcoming_reviews integer default 0,
  weekly_summary text not null,
  created_at timestamptz default now()
);

-- 5. Multi-Agent Execution & Observability Trace Logs
create table if not exists public.agent_execution_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  task_input text not null,
  detected_intent text not null,
  primary_agent text not null,
  specialist_agents text[] not null default '{}',
  duration_ms integer not null default 0,
  status text not null check (status in ('completed', 'failed', 'retried')),
  tokens_used integer default 0,
  error_message text,
  created_at timestamptz default now()
);

-- 6. User Roles for RBAC (Student vs Educator vs Admin)
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id text unique not null,
  email text not null,
  role text not null check (role in ('student', 'educator', 'admin')),
  created_at timestamptz default now()
);

-- RLS Policies
alter table public.career_profiles enable row level security;
alter table public.career_recommendations enable row level security;
alter table public.learning_recommendations enable row level security;
alter table public.learning_insights enable row level security;
alter table public.agent_execution_logs enable row level security;
alter table public.user_roles enable row level security;

create policy "Users can access own career profiles" on public.career_profiles for all using (true);
create policy "Users can access own career recommendations" on public.career_recommendations for all using (true);
create policy "Users can access own recommendations" on public.learning_recommendations for all using (true);
create policy "Users can access own insights" on public.learning_insights for all using (true);
create policy "Admins can view agent logs" on public.agent_execution_logs for select using (true);
create policy "Users can read own role" on public.user_roles for select using (true);

-- Indexes
create index if not exists idx_career_recs_user on public.career_recommendations(user_id);
create index if not exists idx_learning_recs_user on public.learning_recommendations(user_id, is_dismissed);
create index if not exists idx_agent_logs_created on public.agent_execution_logs(created_at desc);
create index if not exists idx_user_roles_user on public.user_roles(user_id);
