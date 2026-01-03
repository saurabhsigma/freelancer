"use server";

import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import Post from "@/models/Post";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getSocialProfile(username: string) {
    await connectToDB();
    const decodedName = decodeURIComponent(username);
    // Find user by name (slug logic needed?) for now direct match or regex
    // Since we save formatted names or just names, we'll try to match name via regex to be safe if slug usage varies.
    // Ideally we should store a 'slug' field.
    // For now: case insensitive match on name
    const user = await User.findOne({
        name: { $regex: new RegExp(`^${decodedName}$`, 'i') }
    }).select("-passwordHash").lean();

    if (!user) return null;

    // Get stats
    const followerCount = user.followers?.length || 0;
    const followingCount = user.following?.length || 0;

    // Get posts
    const posts = await Post.find({ author: user._id })
        .populate("author", "name image _id")
        .sort({ createdAt: -1 })
        .lean();

    return {
        user: JSON.parse(JSON.stringify(user)),
        stats: { followerCount, followingCount },
        posts: JSON.parse(JSON.stringify(posts))
    };
}

export async function toggleFollow(targetUserId: string) {
    try {
        const session = await getSession();
        if (!session || !session.user) return { error: "Not authenticated" };

        const currentUserId = session.user.id || session.user._id;
        if (currentUserId === targetUserId) return { error: "Cannot follow yourself" };

        await connectToDB();

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) return { error: "User not found" };

        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {
            // Unfollow
            currentUser.following.pull(targetUserId);
            targetUser.followers.pull(currentUserId);
        } else {
            // Follow
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
        }

        await currentUser.save();
        await targetUser.save();

        revalidatePath("/user/[username]", "page");
        return { success: true, isFollowing: !isFollowing };
    } catch (error) {
        console.error("Follow Error:", error);
        return { error: "Failed to update follow status" };
    }
}
