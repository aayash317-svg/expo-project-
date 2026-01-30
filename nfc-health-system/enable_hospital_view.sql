-- Enable Hospitals to view ALL Patients (Required for NFC Scan)
drop policy if exists "Hospitals view all patients" on public.patients;

create policy "Hospitals view all patients" on public.patients
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'hospital'
    )
  );

-- Enable Hospitals to view Medical Records (Requirement: "See all history")
drop policy if exists "Hospitals view all medical records" on public.medical_records;

create policy "Hospitals view all medical records" on public.medical_records
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'hospital'
    )
  );
