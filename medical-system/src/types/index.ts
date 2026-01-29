export type UserRole = 'patient' | 'hospital' | 'insurance';

export interface Profile {
    id: string;
    email?: string; // Changed to optional for Phone Auth
    phone?: string;
    role: UserRole;
    full_name: string;
    created_at: string;
}

export interface Patient extends Profile {
    dob?: string;
    blood_group?: string;
    allergies?: string[];
    emergency_contact?: {
        name: string;
        phone: string;
        relation: string;
    };
    nfc_tag_id?: string;
}

export interface MedicalRecord {
    id: string;
    patient_id: string;
    hospital_id: string;
    hospital_name?: string;
    record_type: 'diagnosis' | 'prescription' | 'lab_result' | 'emergency';
    title: string;
    description: string;
    attachments?: string[];
    created_at: string;
}

export interface InsurancePolicy {
    id: string;
    patient_id: string;
    provider_id: string;
    provider_name?: string;
    policy_number: string;
    coverage_amount: number;
    status: 'active' | 'expired' | 'pending';
    valid_until: string;
}

export interface Claim {
    id: string;
    policy_id: string;
    patient_id: string;
    provider_id: string;
    claim_amount: number;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
    submitted_at: string;
    processed_at?: string;
}

export interface AuditLog {
    id: string;
    actor_id: string;
    action: string;
    resource_type: string;
    timestamp: string;
}
