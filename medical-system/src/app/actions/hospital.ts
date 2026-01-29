'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Profile } from "@/types";

export async function searchPatients(query: string) {
    const supabase = await createClient();

    // Search in profiles where role is 'patient'
    // ILIKE for case-insensitive partial match on name or email
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'patient')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,id.eq.${query}`)
        .limit(10);

    if (error) {
        console.error("Search Error:", error);
        return { error: "Failed to search patients." };
    }

    return { patients: data as Profile[] };
}

export async function getPatientDetails(patientId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // 1. Get Profile & Patient Data
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
            *,
            patients (*)
        `)
        .eq('id', patientId)
        .eq('role', 'patient')
        .single();

    if (profileError || !profile) {
        return { error: "Patient not found." };
    }

    // 2. Get Medical Records
    const { data: records, error: recordsError } = await supabase
        .from('medical_records')
        .select(`
            *,
            hospitals ( profiles ( full_name ) )
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

    return {
        patient: {
            ...profile,
            details: profile.patients
        },
        records: records || []
    };
}

export async function addMedicalRecord(formData: FormData) {
    const patientId = formData.get("patientId") as string;
    const recordType = formData.get("recordType") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    // Attachments would need file upload logic (Storage), skipping for MVP text-only

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    // 1. Insert Record
    const { data: record, error } = await supabase.from('medical_records').insert({
        patient_id: patientId,
        hospital_id: user.id,
        record_type: recordType,
        title: title,
        description: description,
    }).select().single();

    if (error) {
        return { error: error.message };
    }

    // 2. Audit Log
    await supabase.from('audit_logs').insert({
        actor_id: user.id,
        action: 'add_record',
        resource_type: 'medical_record',
        resource_id: record.id,
        details: { patient_id: patientId, title: title }
    });

    revalidatePath(`/hospital/patient/${patientId}`);
    return { success: true };
}
