import Link from "next/link";
import { ArrowLeft, Stethoscope } from "lucide-react";

export default function HospitalLogin() {
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

                    <form className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="hospital-id">Hospital ID / Council ID</label>
                            <input
                                id="hospital-id"
                                type="text"
                                placeholder="HOSP-XXXXX"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <button className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition-colors">
                            Login as Provider
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
