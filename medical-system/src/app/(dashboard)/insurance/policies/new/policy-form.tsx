'use client'

import { createPolicy } from '@/app/actions/insurance-policies';
// @ts-ignore
import { useFormState, useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

const initialState = {
    error: '',
    message: ''
}

export default function PolicyForm() {
    const [state, formAction] = useFormState(createPolicy, initialState);

    return (
        <form action={formAction} className="space-y-6 bg-card border p-6 rounded-xl shadow-sm">
            {state?.error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                    {state.error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium">Patient Email</label>
                <input
                    name="patientEmail"
                    type="email"
                    required
                    placeholder="patient@example.com"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-muted-foreground">Enter the email address the patient used to register.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Policy Number</label>
                    <input
                        name="policyNumber"
                        type="text"
                        required
                        placeholder="POL-12345678"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Coverage Amount ($)</label>
                    <input
                        name="coverageAmount"
                        type="number"
                        required
                        placeholder="50000"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Valid Until</label>
                <input
                    name="validUntil"
                    type="date"
                    required
                    className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <SubmitButton />
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            disabled={pending}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
            {pending ? <><Loader2 className="h-4 w-4 animate-spin" /> Issuing Policy...</> : 'Issue Policy'}
        </button>
    )
}
