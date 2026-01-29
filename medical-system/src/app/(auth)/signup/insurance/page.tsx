'use client';

import Link from "next/link";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { signUpInsurance } from "@/app/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InsuranceSignUp() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const result = await signUpInsurance(formData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push('/login/insurance?registered=true');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-8">
            <div className="w-full max-w-xl bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                <div className="p-8 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <span className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Back to Home</span>
                    </div>

                    <div className="space-y-2 text-center">
                        <div className="h-12 w-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Insurance Partner Registration</h1>
                        <p className="text-muted-foreground">Integrate your coverage system</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="companyName">Company Name</label>
                            <input required name="companyName" type="text" placeholder="Global Health Insurance Ltd." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="email">Verification Email</label>
                            <input required name="email" type="email" placeholder="verify@company.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="companyId">Registration No.</label>
                                <input required name="companyId" type="text" placeholder="REG-999-000" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="password">Set Password</label>
                                <input required name="password" type="password" minLength={6} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" />
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
                            <strong>Security Check:</strong> We will verify your company credentials with the central database before activating full API access.
                        </div>

                        <button disabled={loading} className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors mt-4 flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                                </>
                            ) : (
                                "Register Provider"
                            )}
                        </button>
                    </form>

                    <div className="text-center text-sm">
                        Already a partner? <Link href="/login/insurance" className="text-blue-600 hover:underline">Partner Login</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
