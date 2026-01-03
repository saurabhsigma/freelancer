"use server";

import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import Message from "@/models/Message";
import { getSession } from "@/lib/auth";

export async function getCommunityFreelancers() {
    await connectToDB();
    // Fetch users who have a name (basic filter for "real" users)
    // In a real app we might have a 'isPublic' flag
    const users = await User.find({ name: { $exists: true, $ne: "" }, "profileConfig.theme": { $exists: true } })
        .select("name email image profileConfig functionality")
        .limit(50)
        .lean();

    // Parse JSON to avoid serialization issues
    return JSON.parse(JSON.stringify(users));
}

export async function getCommunityMessages() {
    await connectToDB();
    const messages = await Message.find()
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();
    return JSON.parse(JSON.stringify(messages.reverse())); // Return oldest first for chat flow? Or newest first and reverse on client.
    // Standard chat is newest at bottom. So getting last 100, then reversing them to show time ->
}

export async function sendCommunityMessage(content: string) {
    try {
        const session = await getSession();
        if (!session || !session.user) {
            return { error: "Not authenticated" };
        }

        await connectToDB();

        const newMessage = await Message.create({
            content,
            senderId: session.user.id || session.user._id,
            senderName: session.user.name || "Anonymous",
            senderImage: session.user.image,
        });

        return { success: true, message: JSON.parse(JSON.stringify(newMessage)) };
    } catch (error) {
        console.error("Error sending message:", error);
        return { error: "Failed to send message" };
    }
}
