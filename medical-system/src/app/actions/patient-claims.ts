'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getPatientClaims() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data, error } = await supabase
        .from('claims')
        .select(`
            *,
            insurance_providers ( company_name )
        `)
        .eq('patient_id', user.id)
        .order('submitted_at', { ascending: false });

    if (error) return { error: error.message };
    return { claims: data };
}

export async function submitClaim(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const policyId = formData.get('policyId') as string;
    const amount = formData.get('amount') as string;
    const description = formData.get('description') as string;

    if (!amount || !policyId) {
        return { error: "Missing required fields" };
    }

    // Lookup provider from policy
    const { data: policy } = await supabase
        .from('insurance_policies')
        .select('provider_id')
        .eq('id', policyId)
        .single();

    if (!policy) return { error: "Invalid Policy" };
    const providerId = policy.provider_id;

    const { error } = await supabase
        .from('claims')
        .insert({
            patient_id: user.id,
            provider_id: providerId,
            policy_id: policyId,
            claim_amount: parseFloat(amount),
            description: description,
            status: 'pending'
        });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/patient/claims');
    redirect('/patient/claims');
}

export async function getPatientPolicies() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // Fetch policies linked to this patient
    const { data, error } = await supabase
        .from('insurance_policies')
        .select(`
            *,
            insurance_providers ( id, company_name )
        `)
        .eq('patient_id', user.id)
        .eq('status', 'active');

    if (error) return { error: error.message };
    return { policies: data };
}
