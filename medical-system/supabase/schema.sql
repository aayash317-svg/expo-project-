-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Cleanup (Idempotent)
drop table if exists public.audit_logs cascade;
drop table if exists public.claims cascade;
drop table if exists public.insurance_policies cascade;
drop table if exists public.medical_records cascade;
drop table if exists public.insurance_providers cascade;
drop table if exists public.hospitals cascade;
drop table if exists public.patients cascade;
drop table if exists public.profiles cascade;
drop type if exists user_role cascade;

-- Roles Enum
create type user_role as enum ('patient', 'hospital', 'insurance');

-- PROFILES Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text, -- Nullable for Phone Auth
  phone text,
  role user_role not null,
  full_name text,
  created_at timestamptz default now()
);

-- PATIENTS Table
create table public.patients (
  id uuid references public.profiles(id) on delete cascade primary key,
  dob date,
  blood_group text,
  allergies text[], 
  emergency_contact jsonb,
  nfc_tag_id text unique, 
  qr_code_token text unique
);

-- HOSPITALS Table
create table public.hospitals (
  id uuid references public.profiles(id) on delete cascade primary key,
  license_number text unique not null,
  address text,
  verified boolean default false
);

-- INSURANCE PROVIDERS Table
create table public.insurance_providers (
  id uuid references public.profiles(id) on delete cascade primary key,
  company_name text not null,
  verified boolean default false
);

-- MEDICAL RECORDS Table
create table public.medical_records (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.patients(id) not null,
  hospital_id uuid references public.hospitals(id) not null,
  record_type text not null,
  title text not null,
  description text,
  attachments text[],
  encrypted_data text,
  created_at timestamptz default now()
);

-- INSURANCE POLICIES Table
create table public.insurance_policies (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.patients(id) not null,
  provider_id uuid references public.insurance_providers(id) not null,
  policy_number text unique not null,
  coverage_amount numeric,
  status text default 'active',
  valid_until date, 
  created_at timestamptz default now()
);

-- CLAIMS Table
create table public.claims (
  id uuid default uuid_generate_v4() primary key,
  policy_id uuid references public.insurance_policies(id) not null,
  patient_id uuid references public.patients(id) not null,
  provider_id uuid references public.insurance_providers(id) not null,
  claim_amount numeric not null,
  status text default 'pending', -- pending, approved, rejected
  notes text,
  submitted_at timestamptz default now(),
  processed_at timestamptz
);

-- AUDIT LOGS Table
create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  actor_id uuid references auth.users(id),
  action text not null,
  resource_type text,
  resource_id uuid,
  details jsonb,
  ip_address text,
  timestamp timestamptz default now()
);

-- ENABLE RLS
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.hospitals enable row level security;
alter table public.insurance_providers enable row level security;
alter table public.medical_records enable row level security;
alter table public.insurance_policies enable row level security;
alter table public.claims enable row level security;
alter table public.audit_logs enable row level security;

-- POLICIES (UPDATED FOR REGISTRATION SUCCESS)

-- 1. Profiles
create policy "Public insert profiles" on public.profiles
  for insert with check (true); -- Allow registration flow
create policy "Users view own profile" on public.profiles
  for select using (auth.uid() = id);

-- 2. Patients
create policy "Public insert patients" on public.patients
  for insert with check (true);
create policy "Patients view own record" on public.patients
  for select using (auth.uid() = id);

-- 3. Hospitals
create policy "Public insert hospitals" on public.hospitals
  for insert with check (true);
create policy "Hospitals view own record" on public.hospitals
  for select using (auth.uid() = id);

-- 4. Insurance
create policy "Public insert providers" on public.insurance_providers
  for insert with check (true);
create policy "Providers view own record" on public.insurance_providers
  for select using (auth.uid() = id);

-- 5. Medical Records
create policy "Patients view own medical records" on public.medical_records
  for select using (auth.uid() = patient_id);
create policy "Hospitals insert records" on public.medical_records
  for insert with check (auth.uid() = hospital_id);
create policy "Hospitals view created records" on public.medical_records
  for select using (auth.uid() = hospital_id);

-- 6. Insurance Policies
create policy "Patients view own policies" on public.insurance_policies
  for select using (auth.uid() = patient_id);
create policy "Providers insert policies" on public.insurance_policies
  for insert with check (auth.uid() = provider_id);
create policy "Providers view created policies" on public.insurance_policies
  for select using (auth.uid() = provider_id);

-- 8. Claims
create policy "Patients view own claims" on public.claims
  for select using (auth.uid() = patient_id);
create policy "Providers view assigned claims" on public.claims
  for select using (auth.uid() = provider_id);
create policy "Patients submit claims" on public.claims
  for insert with check (auth.uid() = patient_id);
create policy "Providers update claims" on public.claims
  for update using (auth.uid() = provider_id);



-- 8. Audit Logs
create policy "Actors view own logs" on public.audit_logs
  for select using (auth.uid() = actor_id);
create policy "Actors insert logs" on public.audit_logs
  for insert with check (auth.uid() = actor_id);
