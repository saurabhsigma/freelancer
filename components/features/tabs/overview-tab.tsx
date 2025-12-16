"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Star } from "lucide-react";
import { toggleFeatured } from "@/server/actions/project";
import { useRouter } from "next/navigation";
import { ProjectImageUpload } from "@/components/features/project-image-upload";

export function OverviewTab({ project, stats }: { project: any, stats: any }) {
    const router = useRouter();

    async function handleToggleFeatured() {
        await toggleFeatured(project._id);
        router.refresh();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">At a Glance</h3>
                <Button
                    variant={project.isFeatured ? "default" : "outline"}
                    size="sm"
                    onClick={handleToggleFeatured}
                    className="gap-2"
                >
                    <Star className={`h-4 w-4 ${project.isFeatured ? "fill-current" : ""}`} />
                    {project.isFeatured ? "Featured on Profile" : "Feature on Profile"}
                </Button>
            </div>

            <ProjectImageUpload projectId={project._id} currentImage={project.screenshots?.[0]} />

            <Card>
                <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <span className="text-sm font-medium text-muted-foreground">Client</span>
                        <p className="font-medium text-slate-900">{project.clientId?.name}</p>
                    </div>
                    <div className="flex gap-8">
                        <div>
                            <span className="text-sm font-medium text-muted-foreground">Start Date</span>
                            <p className="font-medium text-slate-900">{project.startDate ? formatDate(project.startDate) : "Not set"}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-muted-foreground">Due Date</span>
                            <p className="font-medium text-slate-900">{project.dueDate ? formatDate(project.dueDate) : "Not set"}</p>
                        </div>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-muted-foreground">Payment Type</span>
                        <p className="font-medium text-slate-900 capitalize">{project.paymentType}</p>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-muted-foreground">Scope</span>
                        <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{project.scope || "No scope defined."}</p>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Milestones Completed</span>
                            <span className="font-bold">{stats.completedMilestones} / {stats.totalMilestones}</span>
                        </div>
                        {/* Simple progress bar */}
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                            <div
                                className="bg-slate-900 h-2.5 rounded-full"
                                style={{ width: `${stats.progress}%` }}
                            ></div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Financials</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Total Invoiced</span>
                            <span className="font-bold text-lg">{formatCurrency(stats.totalInvoiced)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Unpaid / Overdue</span>
                            <span className="font-bold text-red-600">{formatCurrency(stats.outstandingAmount)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
