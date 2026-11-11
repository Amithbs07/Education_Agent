-- ==============================================================================
-- CITADEL Education Agent - Phase 5: Commercial SaaS & Multi-Tenancy Schema
-- ==============================================================================

-- 1. Subscriptions & Customer Billing
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id text unique not null,
  plan_id text not null check (plan_id in ('free', 'pro', 'institution')),
  status text not null check (status in ('active', 'past_due', 'canceled', 'trialing')),
  current_period_start timestamptz default now(),
  current_period_end timestamptz default (now() + interval '30 days'),
  cancel_at_period_end boolean default false,
  payment_provider text default 'stripe', -- 'stripe' or 'razorpay'
  customer_id text,
  subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. AI Usage & Credit Metering (Monthly Buckets)
create table if not exists public.usage_records (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  period_month text not null, -- '2026-11'
  ai_requests_count integer default 0,
  tokens_consumed integer default 0,
  documents_processed integer default 0,
  quizzes_generated integer default 0,
  last_updated timestamptz default now(),
  unique(user_id, period_month)
);

-- 3. Multi-Tenant Institutions
create table if not exists public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  domain text not null,
  plan_tier text not null default 'institution',
  seat_limit integer default 250,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Institution Memberships (Role: institution_admin, educator, student)
create table if not exists public.institution_members (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid references public.institutions(id) on delete cascade not null,
  user_id text not null,
  email text not null,
  role text not null check (role in ('institution_admin', 'educator', 'student')),
  status text not null check (status in ('active', 'invited', 'suspended')),
  department text default 'Computer Science & Engineering',
  joined_at timestamptz default now(),
  unique(institution_id, user_id)
);

-- 5. Educator Cohort Groups
create table if not exists public.learning_groups (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid references public.institutions(id) on delete cascade not null,
  educator_id text not null,
  name text not null,
  description text,
  subject text not null,
  created_at timestamptz default now()
);

-- 6. Group Memberships
create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.learning_groups(id) on delete cascade not null,
  student_id text not null,
  joined_at timestamptz default now(),
  unique(group_id, student_id)
);

-- 7. Group Assignments & Shared Curricula
create table if not exists public.group_assignments (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.learning_groups(id) on delete cascade not null,
  title text not null,
  assignment_type text not null check (assignment_type in ('quiz', 'reading', 'task', 'path_module')),
  target_id text,
  due_date date not null,
  created_at timestamptz default now()
);

-- 8. Commercial Feature Flags
create table if not exists public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  flag_name text unique not null,
  is_enabled boolean default true,
  description text,
  rollout_percentage integer default 100,
  updated_at timestamptz default now()
);

-- RLS Policies
alter table public.subscriptions enable row level security;
alter table public.usage_records enable row level security;
alter table public.institutions enable row level security;
alter table public.institution_members enable row level security;
alter table public.learning_groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_assignments enable row level security;
alter table public.feature_flags enable row level security;

create policy "Users can view own subscription" on public.subscriptions for select using (true);
create policy "Users can view own usage" on public.usage_records for select using (true);
create policy "Institution members can access institution" on public.institutions for select using (true);
create policy "Members view same institution" on public.institution_members for select using (true);
create policy "Public can view feature flags" on public.feature_flags for select using (true);

-- Indexes
create index if not exists idx_subs_user on public.subscriptions(user_id);
create index if not exists idx_usage_user_period on public.usage_records(user_id, period_month);
create index if not exists idx_inst_members_user on public.institution_members(user_id);
create index if not exists idx_inst_members_inst on public.institution_members(institution_id);
create index if not exists idx_learning_groups_inst on public.learning_groups(institution_id);
