'use server'

import { createClient } from "@/lib/supabase/server";

export async function getPatientMedicalRecords() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const { data, error } = await supabase
        .from('medical_records')
        .select(`
            *,
            hospitals (
                profiles ( full_name )
            )
        `)
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return { error: error.message };
    }

    return { records: data };
}
