import { ProjectForm } from "@/components/features/project-form";
import { getClients } from "@/server/actions/client";

export default async function NewProjectPage() {
    const clients = await getClients();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">New Project</h2>
                <p className="text-muted-foreground mt-1">
                    Start a new engagement.
                </p>
            </div>
            <ProjectForm clients={clients} />
        </div>
    );
}
