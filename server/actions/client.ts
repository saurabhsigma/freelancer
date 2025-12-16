"use server";

import connectToDatabase from "@/lib/db";
import { Client } from "@/models/Client";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createClient(formData: FormData) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string;

    if (!name) return { error: "Name is required" };

    await connectToDatabase();

    await Client.create({
        userId: session.user.id,
        name,
        company,
        email,
        phone,
        notes,
    });

    revalidatePath("/clients");
    redirect("/clients");
}

export async function getClients() {
    const session = await getSession();
    if (!session?.user?.id) return [];

    await connectToDatabase();
    const clients = await Client.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(clients));
}

export async function getClient(id: string) {
    const session = await getSession();
    if (!session?.user?.id) return null;

    await connectToDatabase();
    const client = await Client.findOne({ _id: id, userId: session.user.id });
    return JSON.parse(JSON.stringify(client));
}
