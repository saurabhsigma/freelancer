"use server";

import connectToDatabase from "@/lib/db";
import { Milestone } from "@/models/Milestone";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createMilestone(formData: FormData) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const projectId = formData.get("projectId") as string;
    const title = formData.get("title") as string;
    const dueDate = formData.get("dueDate") as string;

    if (!projectId || !title) return { error: "Title required" };

    await connectToDatabase();
    await Milestone.create({
        projectId,
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
    });

    revalidatePath(`/projects/${projectId}`);
}

export async function toggleMilestone(id: string, projectId: string, currentStatus: string) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectToDatabase();
    await Milestone.findByIdAndUpdate(id, {
        status: currentStatus === "pending" ? "completed" : "pending"
    });
    revalidatePath(`/projects/${projectId}`);
}

export async function getMilestones(projectId: string) {
    await connectToDatabase();
    const milestones = await Milestone.find({ projectId }).sort({ dueDate: 1 });
    return JSON.parse(JSON.stringify(milestones));
}
