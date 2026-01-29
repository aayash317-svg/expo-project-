-- Create CLAIMS Table (Only if it doesn't exist)
create table if not exists public.claims (
  id uuid default uuid_generate_v4() primary key,
  policy_id uuid references public.insurance_policies(id) not null,
  patient_id uuid references public.patients(id) not null,
  provider_id uuid references public.insurance_providers(id) not null,
  claim_amount numeric not null,
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  description text,
  submitted_at timestamptz default now(),
  processed_at timestamptz
);

-- RLS Policies for Claims
alter table public.claims enable row level security;

-- Drop existing policies to avoid conflicts (Safe to re-run)
drop policy if exists "Patients view own claims" on public.claims;
drop policy if exists "Providers view assigned claims" on public.claims;
drop policy if exists "Patients submit claims" on public.claims;
drop policy if exists "Providers update claims" on public.claims;

-- Re-create policies
create policy "Patients view own claims" on public.claims
  for select using (auth.uid() = patient_id);

create policy "Providers view assigned claims" on public.claims
  for select using (auth.uid() = provider_id);

create policy "Patients submit claims" on public.claims
  for insert with check (auth.uid() = patient_id);

create policy "Providers update claims" on public.claims
  for update using (auth.uid() = provider_id);
