import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PolicyForm from './policy-form';

export default function NewPolicyPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/insurance/policies" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Policies
            </Link>

            <div>
                <h1 className="text-2xl font-bold tracking-tight">Issue New Policy</h1>
                <p className="text-muted-foreground">Create a new insurance policy for a registered patient.</p>
            </div>

            <PolicyForm />
        </div>
    );
}
