import { getPatientClaims } from '@/app/actions/patient-claims';
import { Plus, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

// Using standard Tailwind for now to ensure no missing component errors

export default async function PatientClaimsPage() {
    const { claims, error } = await getPatientClaims();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Claims</h1>
                    <p className="text-muted-foreground">Track and manage your insurance claims.</p>
                </div>
                <Link href="/patient/claims/new">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        <Plus className="h-4 w-4" /> New Claim
                    </button>
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                    Error loading claims: {error}
                </div>
            )}

            <div className="grid gap-4">
                {!claims || claims.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No claims found</h3>
                        <p className="text-muted-foreground mb-4">You haven't submitted any insurance claims yet.</p>
                        <Link href="/patient/claims/new">
                            <button className="text-blue-600 font-medium hover:underline">Submit your first claim</button>
                        </Link>
                    </div>
                ) : (
                    claims.map((claim: any) => (
                        <div key={claim.id} className="bg-card border p-4 rounded-xl flex items-center justify-between hover:shadow-sm transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-full ${claim.status === 'approved' ? 'bg-green-100 text-green-600' :
                                    claim.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                        'bg-yellow-100 text-yellow-600'
                                    }`}>
                                    {claim.status === 'approved' ? <CheckCircle className="h-5 w-5" /> :
                                        claim.status === 'rejected' ? <XCircle className="h-5 w-5" /> :
                                            <Clock className="h-5 w-5" />}
                                </div>
                                <div>
                                    <h4 className="font-medium">Claim #{claim.id.substring(0, 8)}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {claim.insurance_providers?.company_name || 'Insurance Provider'} • {new Date(claim.submitted_at).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm mt-1">{claim.description || 'No description provided'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-lg">${claim.claim_amount}</div>
                                <span className={`text-xs font-medium uppercase px-2 py-1 rounded-full ${claim.status === 'approved' ? 'bg-green-50 text-green-700' :
                                    claim.status === 'rejected' ? 'bg-red-50 text-red-700' :
                                        'bg-yellow-50 text-yellow-700'
                                    }`}>
                                    {claim.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
