'use client';

import Link from "next/link";
import { ArrowLeft, Shield, Loader2 } from "lucide-react";
import { signUpPatient } from "@/app/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PatientSignUp() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const result = await signUpPatient(formData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            // Success
            router.push('/login/patient?registered=true');
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
                        <div className="h-12 w-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Shield className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Patient Registration</h1>
                        <p className="text-muted-foreground">Create your secure health identity</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="fullName">Full Name</label>
                                <input required name="fullName" type="text" placeholder="John Doe" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="dob">Date of Birth</label>
                                <input required name="dob" type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                            <input required name="email" type="email" placeholder="john@example.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                                <input required name="password" type="password" minLength={6} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="bloodGroup">Blood Group</label>
                                <select name="bloodGroup" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                                    <option value="">Select...</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Emergency Contact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none" htmlFor="emergencyName">Contact Name</label>
                                    <input required name="emergencyName" type="text" placeholder="Jane Doe" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none" htmlFor="emergencyPhone">Phone Number</label>
                                    <input required name="emergencyPhone" type="tel" placeholder="+1 234..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
                                </div>
                            </div>
                        </div>

                        <button disabled={loading} className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors mt-4 flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
                                </>
                            ) : (
                                "Create Patient Account"
                            )}
                        </button>
                    </form>

                    <div className="text-center text-sm">
                        Already have an account? <Link href="/login/patient" className="text-indigo-600 hover:underline">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
