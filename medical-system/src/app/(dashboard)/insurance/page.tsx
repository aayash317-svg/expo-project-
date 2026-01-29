import { AlertCircle, CheckCircle, Search, ShieldAlert } from "lucide-react";
import { getInsuranceStats, getRecentClaims, verifyPolicy } from "@/app/actions/insurance";
import { Claim } from "@/types";
import { ClaimActions } from "@/components/insurance/claim-actions";

export default async function InsuranceDashboard() {
    const stats = await getInsuranceStats();
    // @ts-ignore
    const { claims } = await getRecentClaims();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Insurance Portal</h1>
                <p className="text-muted-foreground">Claim processing and policy management interface.</p>
            </div>

            {/* Claims Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <DashCard
                        title="New Claims"
                        value={stats?.pending?.toString() || "0"}
                        icon={<ShieldAlert className="h-5 w-5 text-blue-500" />}
                    />
                    <DashCard
                        title="Approved Today"
                        value={stats?.approved?.toString() || "0"}
                        icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                    />
                    <DashCard
                        title="Total Processed"
                        value={stats?.total?.toString() || "0"}
                        icon={<AlertCircle className="h-5 w-5 text-yellow-500" />}
                    />
                </div>
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex flex-col justify-center items-center text-center">
                    <h3 className="text-blue-900 font-semibold mb-2">Network Status</h3>
                    <p className="text-blue-700 text-sm mb-4">All systems operational. HL7 Interface Active.</p>
                    <div className="h-2 w-full bg-blue-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[98%]"></div>
                    </div>
                </div>
            </div>

            {/* Policy Search - Client Component Wrapper would be better but using Server Action form for simplicity */}
            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Search className="h-5 w-5 text-blue-600" />
                    Policy Lookup
                </h2>
                <form action={async (formData) => {
                    "use server"
                    // Simple demo implementation
                    const policyNo = formData.get("policy") as string;
                    if (policyNo) {
                        // In a real app we'd redirect to a details page or show state
                        console.log("Searching for", policyNo);
                    }
                }} className="flex flex-col md:flex-row gap-4">
                    <input
                        name="policy"
                        type="text"
                        placeholder="Enter Policy Number or Member ID..."
                        className="flex-1 h-12 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                    <button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20">
                        Verify Coverage
                    </button>
                </form>
            </div>

            {/* Claims Queue */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Recent Claims</h3>
                    <button className="text-sm text-blue-600 hover:underline">View All Claims</button>
                </div>

                <div className="bg-card border border-border rounded-xl divide-y divide-border">
                    {!claims || claims.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No recent claims found.
                        </div>
                    ) : (
                        claims.map((claim: any) => (
                            <ClaimItem
                                key={claim.id}
                                id={claim.id.substring(0, 8)}
                                fullId={claim.id} // Pass full ID for actions
                                patient={claim.patients?.profiles?.full_name || "Unknown"}
                                amount={`$${claim.claim_amount}`}
                                provider={claim.provider_name || "Network Provider"} // Fallback
                                date={new Date(claim.submitted_at).toLocaleDateString()}
                                status={claim.status}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

function DashCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="bg-card border border-border p-6 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                {icon}
            </div>
            <div className="text-3xl font-bold">{value}</div>
        </div>
    )
}

// Add this import at the top
// import { ClaimActions } from "@/components/insurance/claim-actions"; // I will add this in a separate chunk or just let the tool handle it if I can match the top.
// Actually I need two chunks.

function ClaimItem({ id, patient, amount, provider, date, status, fullId }: { id: string, patient: string, amount: string, provider: string, date: string, status: string, fullId: string }) {
    return (
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-muted/30 transition-colors gap-4">
            <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <Search className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-medium">{patient} <span className="text-muted-foreground font-normal text-sm">({id})</span></h4>
                    <p className="text-sm text-muted-foreground">{provider} • {date}</p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <span className="font-bold">{amount}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border
                    ${status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-green-50 text-green-700 border-green-200'}`}>
                    {status}
                </span>

                {status === 'pending' && <ClaimActions id={fullId} />}
            </div>
        </div>
    )
}
