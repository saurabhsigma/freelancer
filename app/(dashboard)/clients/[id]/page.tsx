import { getClient } from "@/server/actions/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Building, Calendar } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Project } from "@/models/Project";
import connectToDatabase from "@/lib/db";

async function getClientProjects(clientId: string) {
    await connectToDatabase();
    const projects = await Project.find({ clientId }).sort({ updatedAt: -1 });
    return JSON.parse(JSON.stringify(projects));
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const client = await getClient(id);
    const projects = await getClientProjects(id);

    if (!client) {
        return <div>Client not found</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/clients">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">{client.name}</h2>
                    <p className="text-muted-foreground">{client.company || "Independent Client"}</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Contact Info */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Contact Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <a href={`mailto:${client.email}`} className="hover:underline">{client.email || "N/A"}</a>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span>{client.phone || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Building className="h-4 w-4 text-slate-400" />
                            <span>{client.company || "N/A"}</span>
                        </div>
                        <div className="border-t pt-4 mt-4">
                            <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2">Notes</h4>
                            <p className="text-sm text-slate-600 whitespace-pre-wrap">{client.notes || "No notes."}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Linked Projects */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-900">Projects</h3>
                        <Link href={`/projects/new?clientId=${client._id}`}>
                            <Button variant="outline" size="sm">New Project</Button>
                        </Link>
                    </div>

                    {projects.length === 0 ? (
                        <Card className="py-8 text-center text-muted-foreground text-sm">
                            No projects found for this client.
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {projects.map((project: any) => (
                                <Card key={project._id} className="hover:bg-slate-50 transition-colors">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{project.title}</h4>
                                            <div className="flex items-center gap-4 mt-1">
                                                <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                                                    {project.status}
                                                </Badge>
                                                <span className="text-xs text-slate-500">Updated {formatDate(project.updatedAt)}</span>
                                            </div>
                                        </div>
                                        <Link href={`/projects/${project._id}`}>
                                            <Button variant="ghost" size="sm">
                                                View
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
