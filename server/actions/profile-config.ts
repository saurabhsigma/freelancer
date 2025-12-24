"use server";

import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface ProfileConfig {
    theme: string;
    colorMode: string;
    primaryColor: string;
    font?: string;
    animationIntensity?: string;
    customColors?: {
        background?: string;
        text?: string;
        accent?: string;
    };
    heroBackground?: string;
    cta?: {
        label?: string;
        style?: string;
        link?: string;
    };
    sections: {
        id: string;
        type: string;
        visible: boolean;
        order: number;
    }[];
    customDomain?: string;
}

export async function updateProfileConfig(config: Partial<ProfileConfig>) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    console.log("Updating profile config for user:", session.user.id);
    console.log("Config payload:", JSON.stringify(config, null, 2));

    try {
        await connectToDatabase();

        // Flatten the update object to ensure we don't overwrite the whole profileConfig with partial data
        // and to ensure Mongoose validation runs correctly on fields.
        const updateFiles: any = {};

        if (config.theme) updateFiles["profileConfig.theme"] = config.theme;
        if (config.colorMode) updateFiles["profileConfig.colorMode"] = config.colorMode;
        if (config.primaryColor) updateFiles["profileConfig.primaryColor"] = config.primaryColor;
        if (config.font) updateFiles["profileConfig.font"] = config.font;
        if (config.animationIntensity) updateFiles["profileConfig.animationIntensity"] = config.animationIntensity;
        if (config.customDomain) updateFiles["profileConfig.customDomain"] = config.customDomain;

        if (config.customColors) {
            if (config.customColors.background) updateFiles["profileConfig.customColors.background"] = config.customColors.background;
            if (config.customColors.text) updateFiles["profileConfig.customColors.text"] = config.customColors.text;
            if (config.customColors.accent) updateFiles["profileConfig.customColors.accent"] = config.customColors.accent;
        }

        if (config.heroBackground) updateFiles["profileConfig.heroBackground"] = config.heroBackground;

        if (config.cta) {
            if (config.cta.label) updateFiles["profileConfig.cta.label"] = config.cta.label;
            if (config.cta.style) updateFiles["profileConfig.cta.style"] = config.cta.style;
            if (config.cta.link) updateFiles["profileConfig.cta.link"] = config.cta.link;
        }

        if (config.sections) {
            updateFiles["profileConfig.sections"] = config.sections;
        }

        console.log("Executing Update:", updateFiles);

        await User.findByIdAndUpdate(session.user.id, {
            $set: updateFiles
        });

        revalidatePath("/settings");
        revalidatePath(`/profile/${session.user.username}`);

        return { success: true };
    } catch (error) {
        console.error("Failed to update profile config", error);
        return { error: "Failed to update configuration" };
    }
}

export async function getProfileConfig(username: string) {
    try {
        await connectToDatabase();
        const user = await User.findOne({ username }).select("profileConfig");
        if (!user) return null;

        return JSON.parse(JSON.stringify(user.profileConfig || {}));
    } catch (error) {
        return null;
    }
}
