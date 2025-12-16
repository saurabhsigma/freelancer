"use server";

import connectToDatabase from "@/lib/db";
import { Note } from "@/models/Note";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveNote(projectId: string, content: string) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectToDatabase();

    // Upsert note for project
    await Note.findOneAndUpdate(
        { projectId },
        { content },
        { upsert: true, new: true }
    );

    revalidatePath(`/projects/${projectId}`);
}

export async function getNote(projectId: string) {
    await connectToDatabase();
    const note = await Note.findOne({ projectId });
    return note ? note.content : "";
}
