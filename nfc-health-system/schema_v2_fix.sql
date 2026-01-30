-- Phase 2: Schema Expansion for Enhanced Medical Data & Consent (FIXED)

-- 0. Ensure user_id exists in patients (Fix for potential missing column)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'patients' AND column_name = 'user_id') THEN
        ALTER TABLE public.patients ADD COLUMN user_id UUID REFERENCES public.profiles(id);
    END IF;
END $$;

-- 1. Expand Patients Table
ALTER TABLE public.patients 
ADD COLUMN IF NOT EXISTS blood_group TEXT,
ADD COLUMN IF NOT EXISTS emergency_contacts JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS allergies JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS chronic_conditions JSONB DEFAULT '[]'::JSONB;

-- 2. Create Consent Management Table
CREATE TABLE IF NOT EXISTS public.data_access_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) NOT NULL,
    provider_id UUID REFERENCES public.hospitals(id), -- Nullable if consent is for a category or insurance
    insurance_company_id UUID REFERENCES public.insurance_companies(id),
    
    consent_type TEXT NOT NULL, -- 'MEDICAL_READ', 'MEDICAL_WRITE', 'INSURANCE_READ'
    status TEXT NOT NULL DEFAULT 'GRANTED', -- 'GRANTED', 'REVOKED'
    valid_until TIMESTAMP WITH TIME ZONE,
    
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE
);

-- 3. Enhanced Audit Logs (Add if missing)
-- (ip_address already exists in v1)
ALTER TABLE public.audit_logs 
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS severity TEXT DEFAULT 'INFO'; -- 'INFO', 'WARNING', 'CRITICAL' (for Emergency access)

-- 4. Create Emergency Access Log Table (Special high-audibility table)
CREATE TABLE IF NOT EXISTS public.emergency_access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) NOT NULL,
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT NOT NULL,
    user_agent TEXT,
    reason TEXT -- e.g. "Unconscious Patient"
);

-- Enable RLS on new tables
ALTER TABLE public.data_access_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_access_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Patients can manage their own consents (DROP FIRST to prevent error)
DROP POLICY IF EXISTS "Patients manage own consents" ON public.data_access_consents;

CREATE POLICY "Patients manage own consents" ON public.data_access_consents
    USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()))
    WITH CHECK (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

-- Policy: Emergency Logs (DROP FIRST)
-- For now, allow authenticated writes (backend service role will handle this)
