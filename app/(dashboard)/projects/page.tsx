import { getProjects } from "@/server/actions/project";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Projects</h2>
                    <p className="text-muted-foreground mt-1">
                        Track your active work and progress.
                    </p>
                </div>
                <Link href="/projects/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                </Link>
            </div>

            {projects.length === 0 ? (
                <Card className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-slate-100 p-3 mb-4">
                        <Plus className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No projects yet</h3>
                    <p className="max-w-sm mt-1 text-sm text-muted-foreground mb-6">
                        Create a project to start tracking milestones and files.
                    </p>
                    <Link href="/projects/new">
                        <Button>Create Project</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {projects.map((project: any) => (
                        <Link href={`/projects/${project._id}`} key={project._id}>
                            <Card className="h-full hover:border-slate-400 transition-colors cursor-pointer group">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-lg text-slate-900 group-hover:text-slate-700">{project.title}</h3>
                                            <p className="text-sm text-slate-500 font-medium">{project.clientId?.name || "Unknown Client"}</p>
                                        </div>
                                        <Badge variant={project.status === "active" ? "default" : project.status === "completed" ? "success" : "secondary"}>
                                            {project.status}
                                        </Badge>
                                    </div>
                                    <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
                                        {project.dueDate && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>Due {formatDate(project.dueDate)}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span className="capitalize">{project.paymentType}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
