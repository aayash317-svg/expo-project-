'use client';

import Link from "next/link";
import { ArrowLeft, Shield, Mail, Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client"; // Use client-side auth directly or server action? Client side is standard for login.
import { useRouter } from "next/navigation";

export default function PatientLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const supabase = createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/dashboard'); // Redirect to patient dashboard
            router.refresh();
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
                        <div className="h-12 w-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Shield className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Patient Login</h1>
                        <p className="text-muted-foreground">Secure Access to your Health Records</p>
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="email">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    required
                                />
                            </div>
                        </div>

                        <button disabled={loading} className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                        </button>
                    </form>

                    <div className="text-center text-sm">
                        Don't have an account? <Link href="/signup/patient" className="text-indigo-600 hover:underline">Register now</Link>
                    </div>

                </div>
                <div className="p-4 bg-muted/50 text-center text-xs text-muted-foreground border-t border-border">
                    Secured by HealthOne Identity
                </div>
            </div>
        </div>
    )
}
