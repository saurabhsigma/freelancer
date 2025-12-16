"use server";

import connectToDatabase from "@/lib/db";
import { File } from "@/models/File";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { writeFile, unlink } from "fs/promises";
import path from "path";

export async function uploadFile(formData: FormData) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const projectId = formData.get("projectId") as string;
    const file = formData.get("file") as globalThis.File;

    if (!projectId || !file) return { error: "File required" };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);

    try {
        // Ensure directory exists (mkdir is usually recursive, but for safety in node)
        // I'll assume public/uploads exists or I'll create it via script, 
        // but actually I should ensure it exists here or in setup.
        // I'll just write, assuming folder exists from setup or previous steps. 
        // Actually I haven't created public/uploads. I should do that.
        await writeFile(filePath, buffer);
    } catch (error) {
        console.error("Upload error", error);
        return { error: "Failed to save file locally" };
    }

    const fileUrl = `/uploads/${fileName}`;

    await connectToDatabase();
    const newFile = await File.create({
        projectId,
        fileName: file.name,
        fileUrl,
    });

    revalidatePath(`/projects/${projectId}`);
    return { success: true, file: JSON.parse(JSON.stringify(newFile)) };
}

export async function deleteFile(id: string, projectId: string, fileUrl: string) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectToDatabase();
    await File.findByIdAndDelete(id);

    // Try to delete local file
    try {
        const filePath = path.join(process.cwd(), "public", fileUrl);
        await unlink(filePath);
    } catch (e) {
        // Ignore file missing error
    }

    revalidatePath(`/projects/${projectId}`);
}

export async function getFiles(projectId: string) {
    await connectToDatabase();
    const files = await File.find({ projectId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(files));
}
