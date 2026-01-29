import Link from "next/link";
import { ArrowLeft, Save, Upload } from "lucide-react";

export default function AddRecordPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/hospital" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Add New Medical Record</h1>
                    <p className="text-muted-foreground">Create a secure entry for Patient: <span className="font-mono text-foreground font-medium">a8f9-22b1</span></p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="record-type">Record Type</label>
                            <select
                                id="record-type"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                            >
                                <option>General Diagnosis</option>
                                <option>Lab Report</option>
                                <option>Prescription</option>
                                <option>Surgery Note</option>
                                <option>Emergency Service</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="date">Date of Service</label>
                            <input
                                id="date"
                                type="date"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="title">Record Title</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="e.g. Annual Cardiac Screening"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="notes">Clinical Notes</label>
                        <textarea
                            id="notes"
                            rows={5}
                            placeholder="Enter detailed observation, diagnosis, and treatment plan..."
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Attachments</label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground/70">PDF, DICOM, JPG (Max 10MB)</p>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3">
                        <Link href="/hospital" className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                            Cancel
                        </Link>
                        <button type="button" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            Save to Blockchain
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
