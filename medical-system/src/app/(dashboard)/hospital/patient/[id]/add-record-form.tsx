'use client'

import { addMedicalRecord } from "@/app/actions/hospital";
// @ts-ignore
import { useFormState, useFormStatus } from 'react-dom';
import { Loader2, Save } from "lucide-react";
import { useEffect, useRef } from "react";

const initialState = {
    error: '',
    success: false
}

export default function AddRecordForm({ patientId }: { patientId: string }) {
    const [state, formAction] = useFormState(addMedicalRecord, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success && formRef.current) {
            formRef.current.reset();
        }
    }, [state?.success]);

    return (
        <form ref={formRef} action={formAction} className="space-y-4">
            <input type="hidden" name="patientId" value={patientId} />

            {state?.error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                    {state.error}
                </div>
            )}
            {state?.success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm border border-green-200">
                    Medical record added successfully.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Record Title</label>
                    <input name="title" required placeholder="e.g. Annual Checkup" className="w-full h-10 px-3 rounded-md border border-input bg-background" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <select name="recordType" className="w-full h-10 px-3 rounded-md border border-input bg-background">
                        <option value="report">General Report</option>
                        <option value="prescription">Prescription</option>
                        <option value="lab">Lab Result</option>
                        <option value="surgery">Surgery/Procedure</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description / Diagnosis</label>
                <textarea name="description" required className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background" placeholder="Detailed notes..." />
            </div>

            <SubmitButton />
        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button disabled={pending} className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {pending ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving Record...</> : <><Save className="h-4 w-4" /> Save Medical Record</>}
        </button>
    )
}
