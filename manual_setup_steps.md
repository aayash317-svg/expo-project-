# Manual Setup Steps

Since we are adding the **Insurance Claims** feature, we need to update the database schema.

## 1. Run this SQL in Supabase
Go to the **SQL Editor** in your Supabase Dashboard and run the following script to create the `claims` table.

```sql
-- Create CLAIMS Table
create table public.claims (
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

-- Patients view own claims
create policy "Patients view own claims" on public.claims
  for select using (auth.uid() = patient_id);

-- Providers view claims aimed at them
create policy "Providers view assigned claims" on public.claims
  for select using (auth.uid() = provider_id);

-- Patients can insert claims (Submit Claim)
create policy "Patients submit claims" on public.claims
  for insert with check (auth.uid() = patient_id);

-- Providers can update status (Process Claim)
create policy "Providers update claims" on public.claims
  for update using (auth.uid() = provider_id);
```

## 2. Verify Your Account Roles
Ensure you have users registered for testing:
1.  **Patient User**: Log in and check if you have an active policy. If not, manual insertion might be needed (or we can build a UI for it).
2.  **Insurance Provider User**: Register as an Insurance Provider to see the claims dashboard.

## 3. Restart Server
After running the SQL, backend cache might need clearing.
```powershell
.\start_server.bat
```
