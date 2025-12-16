import { getProject } from "@/server/actions/project";
import { getMilestones } from "@/server/actions/milestone";
import { getFiles } from "@/server/actions/file";
import { getNote } from "@/server/actions/note";
import { getInvoices } from "@/server/actions/invoice";
import { ProjectTabs } from "@/components/features/project-tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // Fetch all data in parallel
    const [project, milestones, files, note, invoices] = await Promise.all([
        getProject(id),
        getMilestones(id),
        getFiles(id),
        getNote(id),
        getInvoices(id),
    ]);

    if (!project) {
        return <div>Project not found</div>;
    }

    // Calculate stats for overview
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter((m: any) => m.status === 'completed').length;
    const progress = totalMilestones === 0 ? 0 : Math.round((completedMilestones / totalMilestones) * 100);

    const totalInvoiced = invoices.reduce((acc: number, curr: any) => acc + curr.amount, 0);
    const outstandingAmount = invoices
        .filter((i: any) => i.status !== 'paid')
        .reduce((acc: number, curr: any) => acc + curr.amount, 0);

    const data = {
        project,
        milestones,
        files,
        note,
        invoices,
        stats: {
            totalMilestones,
            completedMilestones,
            progress,
            totalInvoiced,
            outstandingAmount
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/projects">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{project.title}</h2>
                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>{project.status}</Badge>
                        </div>
                        <p className="text-muted-foreground">{project.clientId?.name}</p>
                    </div>
                </div>
                {/* Could add generic Settings/Edit button here */}
            </div>

            <ProjectTabs data={data} />
        </div>
    );
}
