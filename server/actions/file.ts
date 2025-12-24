"use server";

import connectToDatabase from "@/lib/db";
import { File } from "@/models/File";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { deleteS3Object, getPublicS3Url } from "../s3";

// Legacy action for direct upload (now mostly unused if we switch to client-side, but keeping for compatibility if needed or converting to S3)
// Actually, let's replace it with the new flow logic or just error out to force update.
// But better to add the new action `saveFileRecord`.

export async function saveFileRecord(projectId: string, fileName: string, fileKey: string) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const fileUrl = getPublicS3Url(fileKey);

    await connectToDatabase();
    const newFile = await File.create({
        projectId,
        fileName,
        fileUrl,
        // We might want to store the key too if we want to delete validly later.
        // For now, we can derive key from URL or just store it. 
        // The current schema doesn't have `key`, but `fileUrl`.
        // We'll trust fileUrl is enough or we can parse it.
    });

    revalidatePath(`/projects/${projectId}`);
    return { success: true, file: JSON.parse(JSON.stringify(newFile)) };
}

// Keeping this matching the signature if possible, or we can just remove it if we update the frontend completely.
// The user said "Replace local usage". 
export async function uploadFile(formData: FormData) {
    return { error: "Use client-side upload" };
}

export async function deleteFile(id: string, projectId: string, fileUrl: string) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectToDatabase();
    await File.findByIdAndDelete(id);

    // split url to get key
    // Url format: https://BUCKET.s3.REGION.amazonaws.com/KEY
    try {
        const urlObj = new URL(fileUrl);
        // pathname has leading slash, key should not? S3 keys usually don't start with slash unless intended.
        // /uploads/filename -> uploads/filename
        const key = urlObj.pathname.substring(1);
        await deleteS3Object(key);
    } catch (e) {
        console.error("Delete S3 error", e);
    }

    revalidatePath(`/projects/${projectId}`);
}

export async function getFiles(projectId: string) {
    await connectToDatabase();
    const files = await File.find({ projectId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(files));
}
