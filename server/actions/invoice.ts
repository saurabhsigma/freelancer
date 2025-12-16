"use server";

import connectToDatabase from "@/lib/db";
import { Invoice } from "@/models/Invoice";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createInvoice(formData: FormData) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const projectId = formData.get("projectId") as string;
    const amount = formData.get("amount");
    const dueDate = formData.get("dueDate");
    const notes = formData.get("notes") as string;

    if (!projectId || !amount) return { error: "Amount required" };

    await connectToDatabase();
    await Invoice.create({
        projectId,
        amount: Number(amount),
        dueDate: dueDate ? new Date(dueDate as string) : null,
        notes,
    });

    revalidatePath(`/projects/${projectId}`);
}

export async function updateInvoiceStatus(id: string, projectId: string, status: string) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectToDatabase();
    await Invoice.findByIdAndUpdate(id, { status });
    revalidatePath(`/projects/${projectId}`);
}

export async function getInvoices(projectId: string) {
    await connectToDatabase();
    const invoices = await Invoice.find({ projectId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(invoices));
}
