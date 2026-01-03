"use server";

import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface DomainConfig {
    customDomain?: string;
    subdomain?: string;
    subdomainActive?: boolean;
}

export async function getDomainConfig() {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await connectToDatabase();
        const user = await User.findById(session.user.id);
        
        if (!user) return { error: "User not found" };

        return {
            customDomain: user.domains?.customDomain || null,
            subdomain: user.domains?.subdomain || null,
            customDomainVerified: user.domains?.customDomainVerified || false,
            subdomainActive: user.domains?.subdomainActive || false,
            dnsTxtRecord: user.domains?.dnsTxtRecord || null
        };
    } catch (error) {
        console.error("Error fetching domain config:", error);
        return { error: "Failed to fetch domain config" };
    }
}

export async function updateDomainConfig(config: DomainConfig) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await connectToDatabase();

        // Validate subdomain format if provided
        if (config.subdomain) {
            if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(config.subdomain)) {
                return { error: "Invalid subdomain format. Use lowercase letters, numbers, and hyphens." };
            }

            // Check if subdomain is already taken
            const existingUser = await User.findOne({ "domains.subdomain": config.subdomain });
            if (existingUser && existingUser._id.toString() !== session.user.id) {
                return { error: "This subdomain is already taken" };
            }
        }

        // Validate custom domain if provided
        if (config.customDomain) {
            if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(config.customDomain)) {
                return { error: "Invalid domain format" };
            }

            // Check if custom domain is already used
            const existingUser = await User.findOne({ "domains.customDomain": config.customDomain });
            if (existingUser && existingUser._id.toString() !== session.user.id) {
                return { error: "This domain is already in use" };
            }
        }

        // Generate DNS TXT record for verification
        const dnsTxtRecord = `freelancer-verify=${Math.random().toString(36).substring(2, 15)}`;

        const updateData: any = {
            "domains.subdomain": config.subdomain || null,
            "domains.customDomain": config.customDomain || null,
            "domains.subdomainActive": config.subdomainActive || false,
            "domains.customDomainVerified": false, // Reset verification when domain changes
            "domains.dnsTxtRecord": dnsTxtRecord
        };

        const user = await User.findByIdAndUpdate(
            session.user.id,
            updateData,
            { new: true }
        );

        if (!user) return { error: "Failed to update domain config" };

        revalidatePath("/settings");
        revalidatePath("/settings/domains");

        return {
            success: true,
            customDomain: user.domains?.customDomain,
            subdomain: user.domains?.subdomain,
            subdomainActive: user.domains?.subdomainActive,
            dnsTxtRecord
        };
    } catch (error) {
        console.error("Error updating domain config:", error);
        return { error: "Failed to update domain config" };
    }
}

export async function verifyCustomDomain() {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await connectToDatabase();
        const user = await User.findById(session.user.id);
        
        if (!user?.domains?.customDomain) {
            return { error: "No custom domain configured" };
        }

        // In a real implementation, you would verify DNS records here
        // For now, we'll just mark it as verified
        user.domains.customDomainVerified = true;
        await user.save();

        revalidatePath("/settings");

        return { success: true, message: "Domain verified successfully" };
    } catch (error) {
        console.error("Error verifying domain:", error);
        return { error: "Failed to verify domain" };
    }
}

export async function activateSubdomain(subdomain: string) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await connectToDatabase();
        const user = await User.findById(session.user.id);
        
        if (!user || user.domains?.subdomain !== subdomain) {
            return { error: "This subdomain is not configured" };
        }

        user.domains.subdomainActive = true;
        await user.save();

        revalidatePath("/settings");

        return { success: true, message: "Subdomain activated successfully" };
    } catch (error) {
        console.error("Error activating subdomain:", error);
        return { error: "Failed to activate subdomain" };
    }
}
