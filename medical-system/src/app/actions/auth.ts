'use server'

import { createClient } from "@/lib/supabase/server";
import { UserRole } from "@/types";
import { redirect } from "next/navigation";

// --- PATIENT AUTH (PHONE OTP) ---

export async function signInWithOtp(formData: FormData) {
    const phone = formData.get("phone") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
            // Store role in metadata so it persists on user creation
            data: { role: 'patient' }
        }
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

export async function verifyOtp(phone: string, token: string) {
    const supabase = await createClient();

    const { data: { session }, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
    });

    if (error) {
        return { error: error.message };
    }

    if (session) {
        // Check if profile exists, if not create it (Auto-Registration)
        const user = session.user;
        const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();

        if (!profile) {
            // Create Profile
            await supabase.from('profiles').insert({
                id: user.id,
                role: 'patient',
                phone: phone, // Save phone to profile
                full_name: 'New Patient', // Placeholder
            });

            // Create Patient Record
            await supabase.from('patients').insert({
                id: user.id,
                // defaults
            });
        }

        return { success: true };
    }

    return { error: "Verification failed." };
}



// --- PATIENT AUTH (EMAIL/PASSWORD) ---

export async function signUpPatient(formData: FormData) {
    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const fullName = formData.get("fullName") as string;
        const dob = formData.get("dob") as string;
        const bloodGroup = formData.get("bloodGroup") as string;

        // Emergency Contact
        const emergencyName = formData.get("emergencyName") as string;
        const emergencyPhone = formData.get("emergencyPhone") as string;
        const emergencyContact = { name: emergencyName, phone: emergencyPhone };

        const supabase = await createClient();

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: 'patient',
                },
            },
        });

        if (authError) return { error: authError.message };
        if (!authData.user) return { error: "User creation failed" };

        // 1. Create Profile
        const { error: profileError } = await supabase.from('profiles').insert({
            id: authData.user.id,
            email: email,
            role: 'patient' as UserRole,
            full_name: fullName,
        });

        if (profileError && !profileError.message.includes('duplicate key')) {
            return { error: "Profile creation failed: " + profileError.message };
        }

        // 2. Create Patient Record
        const { error: patientError } = await supabase.from('patients').insert({
            id: authData.user.id,
            dob: dob,
            blood_group: bloodGroup,
            emergency_contact: emergencyContact
        });

        if (patientError) {
            return { error: "Patient record creation failed: " + patientError.message };
        }

        // Auto-signin if no confirmation required
        if (!authData.session) {
            await supabase.auth.signInWithPassword({ email, password });
        }

        return { success: true };

    } catch (err: any) {
        return { error: "An unexpected error occurred: " + err.message };
    }
}

// --- HOSPITAL & INSURANCE REGISTRATION (EMAIL) ---

export async function signUpHospital(formData: FormData) {
    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const hospitalName = formData.get("hospitalName") as string;
        const licenseNumber = formData.get("licenseNumber") as string;
        const address = formData.get("address") as string;

        const supabase = await createClient();

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: hospitalName,
                    role: 'hospital',
                },
            },
        });

        if (authError) return { error: authError.message };
        if (!authData.user) return { error: "User creation failed" };

        // Handle possible duplicate key error if profile trigger exists or check explicitly
        const { error: profileError } = await supabase.from('profiles').insert({
            id: authData.user.id,
            email: email,
            role: 'hospital' as UserRole,
            full_name: hospitalName,
        });

        if (profileError && !profileError.message.includes('duplicate key')) {
            return { error: "Profile creation failed: " + profileError.message };
        }

        const { error: hospitalError } = await supabase.from('hospitals').insert({
            id: authData.user.id,
            license_number: licenseNumber,
            address: address,
            verified: false // PENDING APPROVAL
        });

        if (hospitalError) {
            return { error: "Hospital details creation failed: " + hospitalError.message };
        }

        // Auto-signin only if email confirmation is disabled, otherwise they need to confirm.
        // But assuming dev/test mode or immediate access to verification page:
        if (!authData.session) {
            // Try to sign in (will fail if email needs confirmation)
            await supabase.auth.signInWithPassword({ email, password });
        }

        return { success: true };

    } catch (err: any) {
        return { error: "An unexpected error occurred: " + err.message };
    }
}

export async function signUpInsurance(formData: FormData) {
    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const companyName = formData.get("companyName") as string;

        const supabase = await createClient();

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: companyName,
                    role: 'insurance',
                },
            },
        });

        if (authError) return { error: authError.message };
        if (!authData.user) return { error: "User creation failed" };

        const { error: profileError } = await supabase.from('profiles').insert({
            id: authData.user.id,
            email: email,
            role: 'insurance' as UserRole,
            full_name: companyName,
        });

        if (profileError && !profileError.message.includes('duplicate key')) {
            return { error: "Profile creation failed: " + profileError.message };
        }

        const { error: insError } = await supabase.from('insurance_providers').insert({
            id: authData.user.id,
            company_name: companyName,
            verified: false // PENDING APPROVAL
        });

        if (insError) {
            return { error: "Provider details creation failed: " + insError.message };
        }

        if (!authData.session) {
            await supabase.auth.signInWithPassword({ email, password });
        }
        return { success: true };

    } catch (err: any) {
        return { error: "An unexpected error occurred: " + err.message };
    }
}
