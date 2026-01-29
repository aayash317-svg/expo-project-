'use client'

import { processClaim } from "@/app/actions/insurance"
import { Check, X } from "lucide-react"
import { useTransition } from "react"

export function ClaimActions({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()

    const handleProcess = (status: 'approved' | 'rejected') => {
        startTransition(async () => {
            const result = await processClaim(id, status);
            if (result?.error) {
                alert(result.error);
            }
        })
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => handleProcess('approved')}
                disabled={isPending}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-md border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-50"
            >
                <Check className="h-3 w-3" /> Approve
            </button>
            <button
                onClick={() => handleProcess('rejected')}
                disabled={isPending}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-md border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
            >
                <X className="h-3 w-3" /> Reject
            </button>
        </div>
    )
}
