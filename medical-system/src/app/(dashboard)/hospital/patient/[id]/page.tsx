import { getPatientDetails } from "@/app/actions/hospital";
import { ArrowLeft, User, Activity, FileText, Calendar, Building2 } from "lucide-react";
import Link from "next/link";
import AddRecordForm from "./add-record-form";
import { notFound } from "next/navigation";

export default async function HospitalPatientView({ params }: { params: { id: string } }) {
    const { patient, records, error } = await getPatientDetails(params.id);

    if (error || !patient) {
        return notFound();
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link href="/hospital" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 border-4 border-white shadow-sm">
                        <User className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{patient.full_name}</h1>
                        <p className="text-muted-foreground text-sm">{patient.email} • {patient.details?.blood_group || 'Blood Group N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Medical History List */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        Medical History
                    </h3>

                    <div className="space-y-4">
                        {!records || records.length === 0 ? (
                            <div className="bg-card border border-border p-8 rounded-xl text-center text-muted-foreground">
                                No medical records found for this patient.
                            </div>
                        ) : (
                            records.map((rec: any) => (
                                <div key={rec.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-semibold text-lg">{rec.title}</h4>
                                            <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded capitalize">{rec.record_type}</span>
                                        </div>
                                        <div className="text-right text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(rec.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1 mt-1 justify-end">
                                                <Building2 className="h-3 w-3" />
                                                {rec.hospitals?.profiles?.full_name}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-sm">{rec.description}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column: Add New Record Form */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <Activity className="h-5 w-5 text-indigo-600" />
                            Add Medical Record
                        </h3>
                        <AddRecordForm patientId={params.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
