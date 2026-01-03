import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCommunityFreelancers } from "@/server/actions/community";
import { ChatView } from "@/components/features/community/chat-view";
import { FreelancerGrid } from "@/components/features/community/freelancer-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function CommunityPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const freelancers = await getCommunityFreelancers();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Community Hub</h2>
                    <p className="text-muted-foreground">
                        Connect with other freelancers, share ideas, and explore portfolios.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="chat" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="chat">Live Chat</TabsTrigger>
                    <TabsTrigger value="explore">Explore Freelancers</TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5">
                        <div className="col-span-1 md:col-span-3 lg:col-span-4">
                            <ChatView currentUser={session.user} />
                        </div>
                        <div className="col-span-1 hidden md:block">
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border h-[70vh] overflow-y-auto">
                                <h4 className="font-bold text-sm mb-4">Online Members</h4>
                                {/* Mock online members for now */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 opacity-50">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-sm">You ({session.user?.name})</span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-4 text-center">
                                        Active recently will appear here.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="explore" className="space-y-4">
                    <FreelancerGrid freelancers={freelancers} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
