-- Create the whatsapp_users table
create table public.whatsapp_users (
  phone text not null primary key,
  name text,
  email text,
  onboarding_step text default 'start',
  interested_in_services boolean default false,
  service_interest_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.whatsapp_users enable row level security;

-- Create a policy to allow full access (for backend service)
-- Note: In a production app with user authentication, you'd restrict this.
-- Since we are using the service key (or anon key with open policies) for the backend:
create policy "Enable read/write for all" on public.whatsapp_users
for all using (true) with check (true);
ALTER TABLE whatsapp_users 
ADD COLUMN IF NOT EXISTS contact_number TEXT;

-- Add company_name column
ALTER TABLE whatsapp_users 
ADD COLUMN IF NOT EXISTS company_name TEXT;