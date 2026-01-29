import { getProviderPolicies } from '@/app/actions/insurance-policies';
import { Plus, Search, Shield, User, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default async function PoliciesPage() {
    const { policies, error } = await getProviderPolicies();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Policy Management</h1>
                    <p className="text-muted-foreground">Issue and manage insurance policies for patients.</p>
                </div>
                <Link href="/insurance/policies/new">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                        <Plus className="h-4 w-4" /> Issue New Policy
                    </button>
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                    Error loading policies: {error}
                </div>
            )}

            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b bg-muted/30">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        Active Policies
                    </h3>
                </div>

                {!policies || policies.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        <Shield className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium text-foreground">No Policies Issued</h3>
                        <p className="mb-6">You haven't issued any insurance policies yet.</p>
                        <Link href="/insurance/policies/new">
                            <button className="text-blue-600 font-medium hover:underline">Create your first policy</button>
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y">
                        {policies.map((policy: any) => (
                            <div key={policy.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                            {policy.policy_number}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${policy.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {policy.status}
                                        </span>
                                    </div>
                                    <h4 className="font-medium flex items-center gap-2">
                                        <User className="h-3 w-3 text-muted-foreground" />
                                        {policy.patients?.profiles?.full_name || 'Unknown Patient'}
                                        <span className="text-muted-foreground font-normal text-sm">({policy.patients?.profiles?.email || 'No Email'})</span>
                                    </h4>
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                    <div className="flex items-center gap-1.5 text-muted-foreground" title="Coverage Amount">
                                        <DollarSign className="h-4 w-4" />
                                        <span className="font-semibold text-foreground">${policy.coverage_amount?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-muted-foreground" title="Valid Until">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(policy.valid_until).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
