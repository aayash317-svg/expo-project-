'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getProviderPolicies() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data, error } = await supabase
        .from('insurance_policies')
        .select(`
            *,
            patients (
                profiles ( full_name, email )
            )
        `)
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { policies: data };
}

export async function createPolicy(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const patientEmail = formData.get("patientEmail") as string;
    const policyNumber = formData.get("policyNumber") as string;
    const coverageAmount = formData.get("coverageAmount") as string;
    const validUntil = formData.get("validUntil") as string;

    // 1. Find Patient by Email
    const { data: patientProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', patientEmail)
        .eq('role', 'patient')
        .single();

    if (profileError || !patientProfile) {
        return { error: "Patient not found with this email." };
    }

    // 2. Create Policy
    const { error } = await supabase
        .from('insurance_policies')
        .insert({
            provider_id: user.id,
            patient_id: patientProfile.id,
            policy_number: policyNumber,
            coverage_amount: parseFloat(coverageAmount),
            valid_until: validUntil,
            status: 'active'
        });

    if (error) {
        if (error.code === '23505') return { error: "Policy number already exists." };
        return { error: error.message };
    }

    revalidatePath('/insurance/policies');
    redirect('/insurance/policies');
}
