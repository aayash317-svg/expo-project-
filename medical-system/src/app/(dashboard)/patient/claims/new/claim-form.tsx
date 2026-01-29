'use client'

import { submitClaim } from '@/app/actions/patient-claims';
import { useFormState } from 'react-dom';

const initialState = {
    error: '',
    message: ''
}

export default function ClaimForm({ policies }: { policies: any[] }) {
    // @ts-ignore
    const [state, formAction] = useFormState(submitClaim, initialState);

    return (
        <form action={formAction} className="space-y-6 bg-card border p-6 rounded-xl shadow-sm">
            {state?.error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {state.error}
                </div>
            )}

            {(!policies || policies.length === 0) ? (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg">
                    You do not have any active insurance policies linked to your account. Please contact your provider.
                </div>
            ) : (
                <>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Policy</label>
                        <select name="policyId" required className="w-full h-10 px-3 rounded-md border border-input bg-background">
                            <option value="">-- Select Insurance Policy --</option>
                            {policies.map((p: any) => (
                                <option key={p.id} value={p.id}>
                                    {p.insurance_providers?.company_name} - {p.policy_number}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Claim Amount ($)</label>
                        <input name="amount" type="number" step="0.01" required className="w-full h-10 px-3 rounded-md border border-input bg-background" placeholder="0.00" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description / Reason</label>
                        <textarea name="description" required className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background" placeholder="Describe the medical service or reason for claim..." />
                    </div>

                    <StatusButton />
                </>
            )}
        </form>
    );
}

import { useFormStatus } from 'react-dom';

function StatusButton() {
    const { pending } = useFormStatus();
    return (
        <button
            disabled={pending}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
            {pending ? 'Submitting...' : 'Submit Claim'}
        </button>
    )
}
