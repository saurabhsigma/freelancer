"use server";

import connectToDB from "@/lib/db";
import Post from "@/models/Post";
import { User } from "@/models/User"; // Ensure User model is loaded
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createPost(content: string) {
    try {
        const session = await getSession();
        if (!session || !session.user) return { error: "Not authenticated" };

        if (!content.trim()) return { error: "Content is required" };

        await connectToDB();
        await Post.create({
            content,
            author: session.user.id || session.user._id,
        });

        revalidatePath("/feed");
        return { success: true };
    } catch (error) {
        console.error("Create Post Error:", error);
        return { error: "Failed to create post" };
    }
}

export async function getPosts() {
    try {
        await connectToDB();
        const posts = await Post.find()
            .populate("author", "name image _id") // Populate author details
            .populate("comments.author", "name image _id")
            .sort({ createdAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        console.error("Get Posts Error:", error);
        return [];
    }
}

export async function likePost(postId: string) {
    try {
        const session = await getSession();
        if (!session || !session.user) return { error: "Not authenticated" };

        const userId = session.user.id || session.user._id;

        await connectToDB();
        const post = await Post.findById(postId);
        if (!post) return { error: "Post not found" };

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();
        revalidatePath("/feed");
        return { success: true };
    } catch (error) {
        console.error("Like Post Error:", error);
        return { error: "Failed to like post" };
    }
}

export async function addComment(postId: string, content: string) {
    try {
        const session = await getSession();
        if (!session || !session.user) return { error: "Not authenticated" };

        if (!content.trim()) return { error: "Content required" };

        const userId = session.user.id || session.user._id;

        await connectToDB();
        const post = await Post.findById(postId);
        if (!post) return { error: "Post not found" };

        post.comments.push({
            content,
            author: userId,
        });

        await post.save();
        revalidatePath("/feed");
        return { success: true };
    } catch (error) {
        console.error("Comment Error:", error);
        return { error: "Failed to comment" };
    }
}
