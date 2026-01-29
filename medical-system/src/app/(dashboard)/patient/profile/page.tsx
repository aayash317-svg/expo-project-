import { createClient } from "@/lib/supabase/server";
import { User, Phone, Mail, FileText, Activity } from "lucide-react";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // In a real app we'd fetch profile + patient details joined
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
    const { data: patient } = await supabase.from('patients').select('*').eq('id', user?.id).single();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Patient Profile</h1>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="bg-indigo-600/10 p-6 flex items-center gap-4">
                    <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 border-4 border-white shadow-sm">
                        <User className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{profile?.full_name || 'Patient'}</h2>
                        <p className="text-muted-foreground text-sm flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            {profile?.email}
                        </p>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Date of Birth</label>
                            <p className="font-medium">{patient?.dob ? new Date(patient.dob).toLocaleDateString() : 'Not set'}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Blood Group</label>
                            <p className="font-medium">{patient?.blood_group || 'Not set'}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Contact Phone</label>
                            <p className="font-medium flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                {profile?.phone || 'Not set'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-border pt-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Medical Stats</h3>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                                <Activity className="h-4 w-4" />
                                Allergies: {patient?.allergies?.length || 0}
                            </div>
                            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                                <FileText className="h-4 w-4" />
                                Consents Active
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
