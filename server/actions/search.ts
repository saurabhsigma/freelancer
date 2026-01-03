"use server";

import connectToDB from "@/lib/db";
import { User } from "@/models/User";

export async function searchUsers(query: string) {
    if (!query || query.length < 2) return [];

    await connectToDB();

    // Case-insensitive search on name or username
    // Regex is usually safe for names unless millions of users, then text index is better.
    // For now regex is fine.
    const users = await User.find({
        $or: [
            { name: { $regex: query, $options: "i" } },
            { username: { $regex: query, $options: "i" } }
        ]
    })
        .select("name username image headline _id")
        .limit(5)
        .lean();

    return JSON.parse(JSON.stringify(users));
}
