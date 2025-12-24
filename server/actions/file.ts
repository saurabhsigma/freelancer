"use server";

import connectToDatabase from "@/lib/db";
import { File } from "@/models/File";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import "@/lib/cloudinary"; // Ensure config is loaded

// Legacy action for direct upload (now mostly unused if we switch to client-side, but keeping for compatibility if needed or converting to S3)
// Actually, let's replace it with the new flow logic or just error out to force update.
// But better to add the new action `saveFileRecord`.

export async function saveFileRecord(projectId: string, fileName: string, fileKey: string, providedUrl?: string) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const fileUrl = providedUrl || `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${fileKey}`;

    await connectToDatabase();
    const newFile = await File.create({
        projectId,
        fileName,
        fileUrl,
        // We'll store the Cloudinary public_id as the 'fileKey' if we had a key field, 
        // but for now we rely on the URL or if we need to delete we might need to parse it or just trust the 'key' argument if we were storing it.
        // The File model structure is: projectId, fileName, fileUrl.
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

    // split url to get public_id
    // Url format: https://res.cloudinary.com/CLOUD_NAME/image/upload/v12345678/FOLDER/ID.jpg
    try {
        // Extract public_id from URL
        // This is a rough extraction, usually better to store public_id.
        // Assuming format: .../upload/v<version>/<public_id>.<ext> or .../upload/<public_id>.<ext>
        // But since we are using 'freelancer_os/' folder, it's safer to extract after 'upload/'
        
        const urlParts = fileUrl.split('/upload/');
        if (urlParts.length > 1) {
            let publicIdWithExt = urlParts[1];
            // remove version if present /v1234/
            if (publicIdWithExt.startsWith('v')) {
                const parts = publicIdWithExt.split('/');
                parts.shift(); // remove version
                publicIdWithExt = parts.join('/');
            }
            // remove extension
            const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
            
            await cloudinary.uploader.destroy(publicId);
        }
    } catch (e) {
        console.error("Delete Cloudinary error", e);
    }

    revalidatePath(`/projects/${projectId}`);
}

export async function getFiles(projectId: string) {
    await connectToDatabase();
    const files = await File.find({ projectId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(files));
}
