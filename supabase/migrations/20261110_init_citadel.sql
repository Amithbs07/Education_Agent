-- ==============================================================================
-- CITADEL Education Agent - Initial PostgreSQL Schema & RLS Policies
-- ==============================================================================

-- Enable pgvector extension for Document RAG intelligence
create extension if not exists vector;

-- 1. User Profiles & Learning Preferences
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id text unique not null,
  email text,
  display_name text not null default 'Learner',
  academic_level text default 'undergraduate', 
  primary_subjects text[] default '{"Computer Science", "Mathematics"}',
  target_goals text[] default '{"Master core algorithms", "Build real-world apps"}',
  preferred_learning_style text default 'visual_and_examples',
  knowledge_level text default 'intermediate',
  daily_study_goal_minutes integer default 60,
  streak_days integer default 3,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. AI Conversations
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null default 'New Tutoring Session',
  agent_type text not null default 'supervisor',
  subject text default 'General Academic',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. AI Messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender text not null check (sender in ('user', 'assistant', 'system')),
  agent_identity text default 'Tutor Agent',
  content text not null,
  sources jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 4. Personalized Learning Paths & Roadmaps
create table if not exists public.learning_paths (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  subject text not null,
  current_level text not null,
  target_level text not null,
  target_date date,
  estimated_hours integer default 20,
  completed_hours integer default 0,
  modules jsonb not null default '[]'::jsonb,
  status text not null default 'in_progress',
  created_at timestamptz default now()
);

-- 5. Study Tasks & Milestones
create table if not exists public.study_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  learning_path_id uuid references public.learning_paths(id) on delete set null,
  title text not null,
  subject text not null,
  due_date date not null,
  duration_minutes integer default 45,
  is_completed boolean default false,
  completed_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

-- 6. Quizzes & Assessments
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  subject text not null,
  topic text not null,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  questions jsonb not null default '[]'::jsonb,
  total_questions integer default 5,
  created_at timestamptz default now()
);

-- 7. Quiz Attempts & Gap Evaluations
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  user_id text not null,
  score integer not null,
  max_score integer not null,
  percentage numeric(5,2) not null,
  answers jsonb not null,
  evaluation jsonb not null,
  completed_at timestamptz default now()
);

-- 8. Uploaded Documents
create table if not exists public.uploaded_documents (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  filename text not null,
  file_type text not null,
  file_size integer not null,
  summary text,
  extracted_concepts text[],
  total_pages integer default 1,
  created_at timestamptz default now()
);

-- 9. Document Chunks & Vector Embeddings
create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.uploaded_documents(id) on delete cascade not null,
  content text not null,
  page_number integer,
  chunk_index integer not null,
  embedding vector(768)
);

-- 10. Study Notes
create table if not exists public.study_notes (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  subject text not null,
  topic text not null,
  content_markdown text not null,
  key_definitions jsonb default '[]'::jsonb,
  exam_summary text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 11. Flashcards & Spaced Repetition
create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  deck_title text not null,
  subject text not null,
  front text not null,
  back text not null,
  ease_factor numeric(3,2) default 2.50,
  interval_days integer default 1,
  repetitions integer default 0,
  due_date date default current_date,
  created_at timestamptz default now()
);

-- 12. Verified Learning Activities (Data-driven analytics)
create table if not exists public.learning_activities (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  activity_type text not null,
  subject text not null,
  duration_minutes integer default 10,
  score_percentage numeric(5,2),
  details jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_messages_conversation on public.messages(conversation_id);
create index if not exists idx_study_tasks_user on public.study_tasks(user_id, due_date);
create index if not exists idx_activities_user on public.learning_activities(user_id, created_at desc);
create index if not exists idx_flashcards_user on public.flashcards(user_id, due_date);
