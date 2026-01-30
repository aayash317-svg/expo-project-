"use client";

import Link from "next/link";
import { ArrowLeft, Stethoscope, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function HospitalLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const supabase = createClient();

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const councilId = formData.get("hospital-id") as string;
        const password = formData.get("password") as string;

        if (!councilId || !password) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }

        // Logic: Convert Council ID to System Email (Same as Flask)
        const systemEmail = `${councilId.trim().toLowerCase().replace(" ", "")}@nfc-health.system`;

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: systemEmail,
                password: password,
            });

            if (authError) {
                if (authError.message.includes("Invalid login")) {
                    setError("Invalid Council ID or Password");
                } else {
                    setError(authError.message);
                }
            } else {
                router.push("/hospital");
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <span className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Back to Home</span>
                    </div>

                    <div className="space-y-2 text-center">
                        <div className="h-12 w-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Stethoscope className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Provider Portal</h1>
                        <p className="text-muted-foreground">Authorized medical personnel access</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="hospital-id">Hospital ID / Council ID</label>
                            <input
                                id="hospital-id"
                                name="hospital-id"
                                type="text"
                                placeholder="HOSP-XXXXX"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={isLoading}
                            className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login as Provider"}
                        </button>
                    </form>

                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 text-xs text-emerald-800">
                        <strong>Security Notice:</strong> All access is logged and audited. Use Physical Security Key if issued.
                    </div>
                </div>
            </div>
        </div>
    )
}
