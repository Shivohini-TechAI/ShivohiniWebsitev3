-- Shivohini Full Ecosystem Supabase Schema
-- Includes Website Backend, Chatbot Lead-Gen, and Vector Search (RAG)

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "vector"; -- Required for AI Search

-- =========================================
-- 📂 WEBSITE BACKEND TABLES
-- =========================================

-- JOBS (Careers Section)
create table if not exists jobs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  location text default 'Remote',
  type text default 'Full-time',
  description text default '',
  apply_link text default '',
  posted_at timestamptz default now()
);

-- INDUSTRIES
create table if not exists industries (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  icon text,
  solutions text[] default '{}',
  color text,
  bg_gradient text
);

-- PRODUCTS
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  icon text,
  features text[] default '{}',
  color text,
  bg_color text
);

-- APPLICATIONS (Job Applicants)
create table if not exists applications (
  id uuid default uuid_generate_v4() primary key,
  job_id uuid references jobs(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  message text,
  resume_link text,
  applied_at timestamptz default now()
);

-- CONTACTS (Direct Lead Gen)
create table if not exists contacts (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  date timestamptz default now()
);

-- =========================================
-- 📂 CHATBOT & USER TRACKING TABLES
-- =========================================

-- USERS (AI Assistant Interactions)
create table if not exists users (
  id uuid default uuid_generate_v4() primary key,
  name text,
  email text,
  phone text,
  company text,
  requirement text,
  created_at timestamptz default now()
);

-- CHATBOT KNOWLEDGE BASE (Vector Search)
create table if not exists documents (
  id bigserial primary key,
  content text,
  metadata jsonb,
  embedding vector(1536) -- Optimized for OpenAI text-embedding-ada-002
);

-- =========================================
-- 🚀 FUNCTIONS & RPCs
-- =========================================

-- Vector Similarity Search Function
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;

-- =========================================
-- 🛡️ RLS (Row Level Security)
-- =========================================

alter table jobs enable row level security;
alter table industries enable row level security;
alter table products enable row level security;
alter table applications enable row level security;
alter table contacts enable row level security;
alter table users enable row level security;
alter table documents enable row level security;

-- PUBLIC READ ACCESS
create policy "Allow public read access for jobs" on jobs for select using (true);
create policy "Allow public read access for industries" on industries for select using (true);
create policy "Allow public read access for products" on products for select using (true);
create policy "Allow public read access for documents" on documents for select using (true);

create index if not exists users_email_idx on users (email);
create index if not exists users_phone_idx on users (phone);

-- PUBLIC WRITE ACCESS (Lead Gen)
create policy "Allow public insert for applications" on applications for insert with check (true);
create policy "Allow public insert for contacts" on contacts for insert with check (true);
create policy "Allow public interaction for users" on users for all using (true) with check (true);

-- =========================================
-- 📦 SEED DATA (SAMPLE JOBS)
-- =========================================

INSERT INTO jobs (title, location, type, description, apply_link)
VALUES 
('Full Stack AI Engineer', 'Remote', 'Full-time', 'Responsible for building AI-driven web applications.', '/apply/1'),
('UI/UX Designer', 'Chandigarh, IN', 'Full-time', 'Expert in creating premium glassmorphism designs.', '/apply/2'),
('Python Backend Developer', 'Remote', 'Contract', 'Focus on RAG and LLM integration.', '/apply/3'),
('AI Research Intern', 'Hybrid', 'Internship', 'Support development of new neural architectures.', '/apply/4');

