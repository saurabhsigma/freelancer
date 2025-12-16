"use client";

import { createMilestone, toggleMilestone } from "@/server/actions/milestone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, Plus, Calendar } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { useState, useRef } from "react";

export function MilestonesTab({ projectId, milestones }: { projectId: string, milestones: any[] }) {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Milestones</h3>
            </div>

            <div className="grid gap-4">
                {milestones.map((milestone) => (
                    <Card key={milestone._id} className={cn("transition-opacity", milestone.status === 'completed' && "opacity-60")}>
                        <CardContent className="p-4 flex items-center gap-4">
                            <button
                                onClick={() => toggleMilestone(milestone._id, projectId, milestone.status)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {milestone.status === 'completed' ? (
                                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                ) : (
                                    <Circle className="h-6 w-6" />
                                )}
                            </button>
                            <div className="flex-1">
                                <p className={cn("font-medium", milestone.status === 'completed' && "line-through text-muted-foreground")}>
                                    {milestone.title}
                                </p>
                            </div>
                            {milestone.dueDate && (
                                <div className="flex items-center text-sm text-muted-foreground gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(milestone.dueDate)}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-dashed bg-slate-50/50">
                <CardContent className="p-4">
                    <form
                        ref={formRef}
                        action={async (formData) => {
                            await createMilestone(formData);
                            formRef.current?.reset();
                        }}
                        className="flex gap-4 items-end"
                    >
                        <input type="hidden" name="projectId" value={projectId} />
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">New Milestone</label>
                            <Input name="title" placeholder="e.g. Design Mockups Phase 1" required />
                        </div>
                        <div className="w-40 space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Due Date</label>
                            <Input name="dueDate" type="date" />
                        </div>
                        <Button type="submit" size="sm" className="mb-[2px]">
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
