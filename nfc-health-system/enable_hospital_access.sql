-- Enable Hospitals to view ALL Patients (Required for NFC Scan)
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

-- Enable Hospitals to view Medical Records they didn't create?
-- (Requirement: "See all history")
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
