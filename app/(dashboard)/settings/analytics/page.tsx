import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AnalyticsDashboard } from "@/components/features/analytics-dashboard";

export default async function AnalyticsPage() {
    const session = await getSession();
    if (!session?.user?.id) redirect("/login");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics & Leads</h1>
                <p className="text-muted-foreground mt-2">
                    Track your portfolio views and manage incoming leads
                </p>
            </div>

            <AnalyticsDashboard />
        </div>
    );
}
