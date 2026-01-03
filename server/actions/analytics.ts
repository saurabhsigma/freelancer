"use server";

import connectToDatabase from "@/lib/db";
import { PortfolioView, Lead } from "@/models/Analytics";
import { User } from "@/models/User";
import { getSession } from "@/lib/auth";

export interface AnalyticsStats {
    totalViews: number;
    uniqueVisitors: number;
    viewsThisMonth: number;
    topReferrers: Array<{ referrer: string; count: number }>;
    deviceBreakdown: { desktop: number; mobile: number; tablet: number };
    topCountries: Array<{ country: string; count: number }>;
}

export interface LeadStats {
    totalLeads: number;
    newLeads: number;
    contactedLeads: number;
    convertedLeads: number;
    lostLeads: number;
    leadsThisMonth: number;
}

export async function recordPortfolioView(
    userId: string,
    visitorId: string,
    referrer?: string,
    userAgent?: string,
    device: "desktop" | "mobile" | "tablet" = "desktop"
) {
    try {
        await connectToDatabase();

        // Extract country from IP (simplified - you'd need a real IP geolocation service)
        const view = new PortfolioView({
            userId,
            visitorId,
            referrer: referrer || "direct",
            userAgent,
            device,
            country: "Unknown"
        });

        await view.save();
        return { success: true };
    } catch (error) {
        console.error("Error recording portfolio view:", error);
        return { error: "Failed to record view" };
    }
}

export async function getAnalyticsStats(): Promise<AnalyticsStats | { error: string }> {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await connectToDatabase();

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalViews = await PortfolioView.countDocuments({ userId: session.user.id });
        const uniqueVisitors = await PortfolioView.distinct("visitorId", { userId: session.user.id });
        const viewsThisMonth = await PortfolioView.countDocuments({
            userId: session.user.id,
            timestamp: { $gte: monthStart }
        });

        const referrers = await PortfolioView.aggregate([
            { $match: { userId: session.user.id } },
            { $group: { _id: "$referrer", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const devices = await PortfolioView.aggregate([
            { $match: { userId: session.user.id } },
            { $group: { _id: "$device", count: { $sum: 1 } } }
        ]);

        const countries = await PortfolioView.aggregate([
            { $match: { userId: session.user.id } },
            { $group: { _id: "$country", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const deviceBreakdown = {
            desktop: 0,
            mobile: 0,
            tablet: 0
        };

        devices.forEach((d: any) => {
            if (d._id in deviceBreakdown) {
                deviceBreakdown[d._id as keyof typeof deviceBreakdown] = d.count;
            }
        });

        return {
            totalViews,
            uniqueVisitors: uniqueVisitors.length,
            viewsThisMonth,
            topReferrers: referrers.map((r: any) => ({ referrer: r._id, count: r.count })),
            deviceBreakdown,
            topCountries: countries.map((c: any) => ({ country: c._id, count: c.count }))
        };
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return { error: "Failed to fetch analytics" };
    }
}

export async function getLeadStats(): Promise<LeadStats | { error: string }> {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await connectToDatabase();

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalLeads = await Lead.countDocuments({ portfolioUserId: session.user.id });
        const newLeads = await Lead.countDocuments({ portfolioUserId: session.user.id, status: "new" });
        const contactedLeads = await Lead.countDocuments({ portfolioUserId: session.user.id, status: "contacted" });
        const convertedLeads = await Lead.countDocuments({ portfolioUserId: session.user.id, status: "converted" });
        const lostLeads = await Lead.countDocuments({ portfolioUserId: session.user.id, status: "lost" });
        const leadsThisMonth = await Lead.countDocuments({
            portfolioUserId: session.user.id,
            createdAt: { $gte: monthStart }
        });

        return {
            totalLeads,
            newLeads,
            contactedLeads,
            convertedLeads,
            lostLeads,
            leadsThisMonth
        };
    } catch (error) {
        console.error("Error fetching lead stats:", error);
        return { error: "Failed to fetch lead stats" };
    }
}

export async function getLeads(status?: string) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await connectToDatabase();

        const query: any = { portfolioUserId: session.user.id };
        if (status) query.status = status;

        const leads = await Lead.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        return { leads: JSON.parse(JSON.stringify(leads)) };
    } catch (error) {
        console.error("Error fetching leads:", error);
        return { error: "Failed to fetch leads" };
    }
}

export async function updateLeadStatus(leadId: string, status: string) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await connectToDatabase();

        const lead = await Lead.findOne({ _id: leadId, portfolioUserId: session.user.id });
        if (!lead) return { error: "Lead not found" };

        lead.status = status;
        await lead.save();

        return { success: true };
    } catch (error) {
        console.error("Error updating lead:", error);
        return { error: "Failed to update lead" };
    }
}

export async function createLead(
    portfolioUserId: string,
    data: {
        name: string;
        email: string;
        phone?: string;
        message: string;
        serviceInterest?: string;
        budget?: string;
        timeline?: string;
    }
) {
    try {
        await connectToDatabase();

        // Verify the portfolio user exists
        const user = await User.findById(portfolioUserId);
        if (!user) return { error: "Portfolio not found" };

        const lead = new Lead({
            portfolioUserId,
            ...data,
            status: "new"
        });

        await lead.save();
        return { success: true, leadId: lead._id };
    } catch (error) {
        console.error("Error creating lead:", error);
        return { error: "Failed to create lead" };
    }
}
