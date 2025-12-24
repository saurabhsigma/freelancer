"use server";

import connectToDatabase from "@/lib/db";
import { Project } from "@/models/Project";
import { Client } from "@/models/Client";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    const clientId = formData.get("clientId") as string;
    const status = formData.get("status") as string;
    const startDate = formData.get("startDate") ? new Date(formData.get("startDate") as string) : null;
    const dueDate = formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : null;
    const paymentType = formData.get("paymentType") as string;
    const scope = formData.get("scope") as string;

    if (!title || !clientId) return { error: "Title and Client are required" };

    await connectToDatabase();

    const project = await Project.create({
        userId: session.user.id,
        clientId,
        title,
        status,
        startDate,
        dueDate,
        paymentType,
        scope,
    });

    revalidatePath("/projects");
    revalidatePath(`/clients/${clientId}`);
    redirect(`/projects/${project._id}`);
}

export async function getProjects() {
    const session = await getSession();
    if (!session?.user?.id) return [];

    await connectToDatabase();
    // Populate client for display
    const projects = await Project.find({ userId: session.user.id })
        .populate("clientId", "name")
        .sort({ updatedAt: -1 });

    return JSON.parse(JSON.stringify(projects));
}

export async function getProject(id: string) {
    const session = await getSession();
    if (!session?.user?.id) return null;

    try {
        await connectToDatabase();
        const project = await Project.findOne({ _id: id, userId: session.user.id }).populate('clientId');
        if (!project) return null;
        return JSON.parse(JSON.stringify(project));
    } catch (error) {
        return null;
    }
}

export async function toggleFeatured(id: string) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await connectToDatabase();
        const project = await Project.findOne({ _id: id, userId: session.user.id });
        if (!project) return { error: "Project not found" };

        project.isFeatured = !project.isFeatured;
        await project.save();
        revalidatePath(`/projects/${id}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to toggle featured status" };
    }
}

export async function updateProjectScreenshot(id: string, url: string) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await connectToDatabase();
        const project = await Project.findOne({ _id: id, userId: session.user.id });
        if (!project) return { error: "Project not found" };

        if (!project.screenshots) project.screenshots = [];
        // Prepend new image
        project.screenshots = [url, ...project.screenshots];

        await project.save();
        revalidatePath(`/projects/${id}`);
        // Ensure profile is updated if this project is featured
        if (session.user.username) {
            revalidatePath(`/profile/${session.user.username}`);
        }
        return { success: true };
    } catch (error) {
        return { error: "Failed to update screenshot" };
    }
}
// ... existing imports

export async function updateProject(id: string, data: any) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await connectToDatabase();
        const project = await Project.findOne({ _id: id, userId: session.user.id });
        if (!project) return { error: "Project not found" };

        // Update basic fields
        if (data.title) project.title = data.title;
        if (data.status) project.status = data.status;
        if (data.scope) project.scope = data.scope;
        if (data.paymentType) project.paymentType = data.paymentType;
        if (data.startDate) project.startDate = new Date(data.startDate);
        if (data.dueDate) project.dueDate = new Date(data.dueDate);

        // Update extended fields
        if (data.technologies) project.technologies = data.technologies;
        if (data.repoUrl !== undefined) project.repoUrl = data.repoUrl;
        if (data.liveUrl !== undefined) project.liveUrl = data.liveUrl;
        if (data.longDescription !== undefined) project.longDescription = data.longDescription;
        if (data.challenges !== undefined) project.challenges = data.challenges;

        await project.save();

        revalidatePath("/projects");
        revalidatePath(`/projects/${id}`);
        // Ensure profile is updated
        if (session.user.username) {
            revalidatePath(`/profile/${session.user.username}`);
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to update project", error);
        return { error: "Failed to update project" };
    }
}
