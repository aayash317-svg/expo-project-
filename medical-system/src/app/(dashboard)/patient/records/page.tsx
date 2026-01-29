import { getPatientMedicalRecords } from "@/app/actions/patient-records";
import { FileText, Calendar, Building2, Stethoscope, Paperclip } from "lucide-react";
import Link from "next/link";

export default async function MedicalHistoryPage() {
    const { records, error } = await getPatientMedicalRecords();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Medical History</h1>
                <p className="text-muted-foreground">Timeline of your medical visits and records.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                    Error loading records: {error}
                </div>
            )}

            {!records || records.length === 0 ? (
                <div className="bg-card border border-border p-12 rounded-xl text-center">
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No Medical Records</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        Your medical history is empty. Records created by hospitals during your visits will appear here.
                    </p>
                </div>
            ) : (
                <div className="relative border-l border-border ml-3 space-y-8 pb-8">
                    {records.map((record: any) => (
                        <div key={record.id} className="relative pl-8">
                            {/* Timeline Dot */}
                            <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-background" />

                            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">
                                                {record.record_type}
                                            </span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(record.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold">{record.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg">
                                        <Building2 className="h-4 w-4" />
                                        <span>{record.hospitals?.profiles?.full_name || 'Unknown Hospital'}</span>
                                    </div>
                                </div>

                                <div className="prose prose-sm max-w-none text-muted-foreground mb-4">
                                    <p>{record.description}</p>
                                </div>

                                {(record.attachments && record.attachments.length > 0) && (
                                    <div className="border-t border-border pt-4 mt-4">
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                            <Paperclip className="h-3 w-3" /> Attachments
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {record.attachments.map((file: string, idx: number) => (
                                                <div key={idx} className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md text-sm hover:bg-muted/80 transition-colors cursor-pointer">
                                                    <FileText className="h-4 w-4 text-blue-600" />
                                                    <span className="truncate max-w-[200px]">{file}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
