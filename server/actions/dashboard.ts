"use server";

import connectToDatabase from "@/lib/db";
import { Project } from "@/models/Project";
import { Invoice } from "@/models/Invoice";
import { Milestone } from "@/models/Milestone";
import { getSession } from "@/lib/auth";

export async function getDashboardStats() {
    await connectToDatabase();
    const session = await getSession();
    if (!session?.user?.id) return null;
    const userId = session.user.id;

    // Parallelize queries for performance
    const [activeProjects, upcomingDeadlines, overdueInvoices] = await Promise.all([
        Project.countDocuments({ userId, status: "active" }),
        Milestone.find({
            status: "pending",
            dueDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // Next 7 days
        })
            .sort({ dueDate: 1 })
            .populate({
                path: 'projectId',
                match: { userId }, // Ensure project belongs to user
                select: 'title'
            })
            .limit(5),
        Invoice.find({
            status: "overdue",
        })
            .populate({
                path: 'projectId',
                match: { userId },
                select: 'title'
            })
    ]);

    // Filter populated results where project might be null (if query match failed)
    const deadlines = upcomingDeadlines.filter((m: any) => m.projectId);
    const overdueInputs = overdueInvoices.filter((i: any) => i.projectId);

    // Calculate total overdue amount
    const overdueAmount = overdueInputs.reduce((acc: number, curr: any) => acc + curr.amount, 0);

    return {
        activeProjects,
        deadlineCount: deadlines.length,
        deadlines: JSON.parse(JSON.stringify(deadlines)),
        overdueCount: overdueInputs.length,
        overdueAmount,
    };
}
