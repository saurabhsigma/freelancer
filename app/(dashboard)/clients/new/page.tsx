import { ClientForm } from "@/components/features/client-form";

export default function NewClientPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Add Client</h2>
                <p className="text-muted-foreground mt-1">
                    Create a new client profile.
                </p>
            </div>
            <ClientForm />
        </div>
    );
}
