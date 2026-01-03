"use server";

import connectToDB from "@/lib/db";
import Message from "@/models/Message";
import { User } from "@/models/User";
import { getSession } from "@/lib/auth";

// Get list of users the current user has chatted with
export async function getConversations() {
    const session = await getSession();
    if (!session || !session.user) return [];

    const currentUserId = session.user.id || session.user._id;
    await connectToDB();

    // Find all messages where I am sender or receiver
    const messages = await Message.find({
        $or: [{ senderId: currentUserId }, { receiverId: currentUserId }]
    }).sort({ createdAt: -1 });

    // Extract unique other user IDs
    const otherUserIds = new Set();
    messages.forEach(msg => {
        const otherId = msg.senderId.toString() === currentUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString();
        otherUserIds.add(otherId);
    });

    // Fetch user details for these IDs
    const users = await User.find({ _id: { $in: Array.from(otherUserIds) } })
        .select("name image _id")
        .lean();

    // Simplify for UI: Map user details and maybe last message? 
    // Ideally we aggregate but for MVP:
    const conversations = users.map(user => {
        // Find last message with this user
        const lastMsg = messages.find(m =>
            (m.senderId.toString() === user._id.toString() && m.receiverId.toString() === currentUserId.toString()) ||
            (m.senderId.toString() === currentUserId.toString() && m.receiverId.toString() === user._id.toString())
        );
        return {
            user: JSON.parse(JSON.stringify(user)),
            lastMessage: lastMsg ? { content: lastMsg.content, createdAt: lastMsg.createdAt } : null
        };
    });

    return conversations.sort((a, b) =>
        new Date(b.lastMessage?.createdAt || 0).getTime() - new Date(a.lastMessage?.createdAt || 0).getTime()
    );
}

// Get messages between current user and target user
export async function getPrivateMessages(targetUserId: string) {
    const session = await getSession();
    if (!session || !session.user) return [];

    const currentUserId = session.user.id || session.user._id;
    await connectToDB();

    const messages = await Message.find({
        $or: [
            { senderId: currentUserId, receiverId: targetUserId },
            { senderId: targetUserId, receiverId: currentUserId }
        ]
    }).sort({ createdAt: 1 }).lean();

    return JSON.parse(JSON.stringify(messages));
}

// Send a private message
export async function sendPrivateMessage(targetUserId: string, content: string) {
    try {
        const session = await getSession();
        if (!session || !session.user) return { error: "Not authenticated" };

        const currentUserId = session.user.id || session.user._id;

        await connectToDB();
        await Message.create({
            senderId: currentUserId,
            receiverId: targetUserId,
            content,
            senderName: session.user.name,
            senderImage: session.user.image,
        });

        return { success: true };
    } catch (error) {
        console.error("Msg Error:", error);
        return { error: "Failed to send" };
    }
}
