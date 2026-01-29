import { getPatientPolicies } from '@/app/actions/patient-claims';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ClaimForm from './claim-form';

export default async function NewClaimPage() {
    const { policies, error } = await getPatientPolicies();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/patient/claims" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Claims
            </Link>

            <div>
                <h1 className="text-2xl font-bold tracking-tight">Submit New Claim</h1>
                <p className="text-muted-foreground">Fill out the details below to submit a claim to your insurance provider.</p>
            </div>

            <ClaimForm policies={policies || []} />
        </div>
    );
}
