"use server";

import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { Project } from "@/models/Project";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
    name?: string; // Added name field
    username?: string;
    bio?: string;
    headline?: string;
    location?: string;
    resumeUrl?: string;
    image?: string;
    skills?: string[];
    socials?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
        website?: string;
    };
    experience?: any[];
    education?: any[];
    certifications?: any[];
    services?: any[];
    hourlyRate?: number;
    availability?: {
        status?: string;
        hoursPerWeek?: number;
        timezone?: string;
    };
}) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await connectToDatabase();

        // precise update
        const update: any = {};
        if (data.name) update.name = data.name; // Added name update logic
        if (data.username) {
            // Sanitize username: lowercase, trim, remove special chars
            update.username = data.username.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
        }
        if (data.bio) update.bio = data.bio;
        if (data.headline) update.headline = data.headline;
        if (data.location) update.location = data.location;
        if (data.resumeUrl) update.resumeUrl = data.resumeUrl;
        if (data.image) update.image = data.image; // Handle image update
        if (data.skills) update.skills = data.skills;
        if (data.socials) update.socials = data.socials;
        if (data.experience) update.experience = data.experience;
        if (data.education) update.education = data.education;
        if (data.certifications) update.certifications = data.certifications;
        if (data.services) update.services = data.services;
        if (data.hourlyRate !== undefined) update.hourlyRate = data.hourlyRate;
        if (data.availability) update.availability = data.availability;

        if (data.hourlyRate !== undefined) update.hourlyRate = data.hourlyRate;
        if (data.availability) update.availability = data.availability;

        console.log("Updating profile with experience:", JSON.stringify(update.experience, null, 2));

        await User.findByIdAndUpdate(session.user.id, update);
        revalidatePath("/settings");
        revalidatePath(`/profile/${data.username || session.user.username}`);
        return { success: true };
    } catch (error) {
        console.error("Profile update error:", error);
        return { error: "Failed to update profile" };
    }
}

export async function getProfile(username: string) {
    try {
        await connectToDatabase();
        // Decode username to handle spaces/special chars passed in URL
        const decodedUsername = decodeURIComponent(username);
        const user = await User.findOne({ username: decodedUsername }).select("-passwordHash");
        if (!user) return null;

        const featuredProjects = await Project.find({ userId: user._id, isFeatured: true }).sort({ createdAt: -1 });

        return {
            user: JSON.parse(JSON.stringify(user)),
            projects: JSON.parse(JSON.stringify(featuredProjects))
        };
    } catch (error) {
        return null;
    }
}
