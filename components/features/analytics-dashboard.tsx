"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Eye, Users, TrendingUp, MessageSquare, Mail } from "lucide-react";
import { getAnalyticsStats, getLeadStats, getLeads, updateLeadStatus, type AnalyticsStats, type LeadStats } from "@/server/actions/analytics";
import { useToast } from "@/components/ui/use-toast";

const COLORS = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"];

export function AnalyticsDashboard() {
    const [isMounted, setIsMounted] = useState(false);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [leadsLoading, setLeadsLoading] = useState(false);
    const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null);
    const [leadStats, setLeadStats] = useState<LeadStats | null>(null);
    const [leads, setLeads] = useState<any[]>([]);
    const [selectedLeadStatus, setSelectedLeadStatus] = useState("new");
    const { toast } = useToast();

    useEffect(() => {
        setIsMounted(true);
        loadAnalytics();
        loadLeads();
    }, []);

    const loadAnalytics = async () => {
        setAnalyticsLoading(true);
        const result = await getAnalyticsStats();
        setAnalyticsLoading(false);

        if ("error" in result) {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
            setAnalytics(result);
        }

        const leadsResult = await getLeadStats();
        if (!("error" in leadsResult)) {
            setLeadStats(leadsResult);
        }
    };

    const loadLeads = async () => {
        setLeadsLoading(true);
        const result = await getLeads(selectedLeadStatus);
        setLeadsLoading(false);

        if (!("error" in result)) {
            setLeads(result.leads);
        }
    };

    const handleLeadStatusChange = async (leadId: string, newStatus: string) => {
        const result = await updateLeadStatus(leadId, newStatus);
        if ("error" in result) {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Lead status updated" });
            loadLeads();
        }
    };

    if (!isMounted) return null;

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics?.totalViews || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {analytics?.viewsThisMonth || 0} this month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics?.uniqueVisitors || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {analytics && analytics.totalViews > 0 
                                ? ((analytics.uniqueVisitors / analytics.totalViews * 100).toFixed(1) + "% unique")
                                : "No data"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leadStats?.totalLeads || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {leadStats?.newLeads || 0} new leads
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leadStats?.convertedLeads || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {leadStats && leadStats.totalLeads > 0
                                ? ((leadStats.convertedLeads / leadStats.totalLeads * 100).toFixed(1) + "% conversion")
                                : "No leads yet"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Referrers */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Referrers</CardTitle>
                        <CardDescription>Where your visitors come from</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {analytics?.topReferrers && analytics.topReferrers.length > 0 ? (
                            <div className="space-y-3">
                                {analytics.topReferrers.map((ref, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground truncate">
                                            {ref.referrer === "direct" ? "Direct" : ref.referrer}
                                        </span>
                                        <Badge variant="outline">{ref.count}</Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">No referrer data yet</p>
                        )}
                    </CardContent>
                </Card>

                {/* Device Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Device Breakdown</CardTitle>
                        <CardDescription>Visitor device types</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {analytics?.deviceBreakdown && (Object.values(analytics.deviceBreakdown).reduce((a, b) => a + b, 0) > 0) ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: "Desktop", value: analytics.deviceBreakdown.desktop },
                                            { name: "Mobile", value: analytics.deviceBreakdown.mobile },
                                            { name: "Tablet", value: analytics.deviceBreakdown.tablet }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {COLORS.map((color, index) => (
                                            <Cell key={`cell-${index}`} fill={color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">No device data yet</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Leads Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Leads</CardTitle>
                    <CardDescription>Messages and inquiries from your portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="new" className="w-full">
                        <TabsList>
                            <TabsTrigger value="new" onClick={() => { setSelectedLeadStatus("new"); loadLeads(); }}>
                                New ({leadStats?.newLeads || 0})
                            </TabsTrigger>
                            <TabsTrigger value="contacted" onClick={() => { setSelectedLeadStatus("contacted"); loadLeads(); }}>
                                Contacted ({leadStats?.contactedLeads || 0})
                            </TabsTrigger>
                            <TabsTrigger value="converted" onClick={() => { setSelectedLeadStatus("converted"); loadLeads(); }}>
                                Converted ({leadStats?.convertedLeads || 0})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value={selectedLeadStatus} className="space-y-4 mt-4">
                            {leads.length > 0 ? (
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="border-b bg-muted">
                                            <tr>
                                                <th className="text-left p-3">Name</th>
                                                <th className="text-left p-3">Email</th>
                                                <th className="text-left p-3">Message</th>
                                                <th className="text-left p-3">Date</th>
                                                <th className="text-left p-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leads.map((lead) => (
                                                <tr key={lead._id} className="border-b hover:bg-muted/50">
                                                    <td className="p-3 font-medium">{lead.name}</td>
                                                    <td className="p-3 text-muted-foreground">{lead.email}</td>
                                                    <td className="p-3 text-muted-foreground max-w-xs truncate">{lead.message}</td>
                                                    <td className="p-3 text-xs text-muted-foreground">
                                                        {new Date(lead.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-3">
                                                        <select
                                                            value={lead.status}
                                                            onChange={(e) => handleLeadStatusChange(lead._id, e.target.value)}
                                                            className="text-xs border rounded px-2 py-1"
                                                        >
                                                            <option value="new">New</option>
                                                            <option value="contacted">Contacted</option>
                                                            <option value="qualified">Qualified</option>
                                                            <option value="converted">Converted</option>
                                                            <option value="lost">Lost</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">No leads yet</p>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
