import { getDashboardStats } from "@/server/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, AlertCircle, Calendar, User } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
    const stats = await getDashboardStats();
    const session = await getSession();
    const username = session?.user?.username;

    if (!stats) {
        return <div>Loading...</div>; // Or redirect/empty state
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                <p className="text-muted-foreground mt-1">
                    Overview of your active freelance work.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeProjects}</div>
                        <p className="text-xs text-muted-foreground">
                            Projects currently in progress
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.deadlineCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Milestones due in next 7 days
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.overdueAmount)}</div>
                        <p className="text-xs text-muted-foreground">
                            Across {stats.overdueCount} invoices
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Upcoming Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.deadlines.length === 0 ? (
                            <div className="text-sm text-muted-foreground py-4">No deadlines coming up soon.</div>
                        ) : (
                            <div className="space-y-4">
                                {stats.deadlines.map((item: any) => (
                                    <div key={item._id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{item.title}</p>
                                            <p className="text-xs text-muted-foreground">{item.projectId?.title}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-medium text-slate-500">{formatDate(item.dueDate)}</span>
                                            <Badge variant="outline">Pending</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Placeholder for Recent Activity or something else */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Link href="/projects/new" className="block w-full">
                            <button className="w-full text-left px-4 py-3 rounded-md border text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-between">
                                Create New Project
                                <span className="text-xl leading-none">+</span>
                            </button>
                        </Link>
                        <Link href="/clients/new" className="block w-full">
                            <button className="w-full text-left px-4 py-3 rounded-md border text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-between">
                                Add New Client
                                <span className="text-xl leading-none">+</span>
                            </button>
                        </Link>
                        <Link href={username ? `/profile/${username}` : "/settings"} className="block w-full">
                            <button className="w-full text-left px-4 py-3 rounded-md border text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-between group text-indigo-600 bg-indigo-50/50 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200">
                                View Visual Resume
                                <User className="h-4 w-4 text-indigo-500" />
                            </button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
