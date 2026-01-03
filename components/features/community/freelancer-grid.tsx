"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

export function FreelancerGrid({ freelancers }: { freelancers: any[] }) {
    if (!freelancers || freelancers.length === 0) {
        return <div className="text-center py-20 text-slate-500">No active freelancers found.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((user) => (
                <Card key={user._id} className="p-6 hover:shadow-lg transition-all dark:bg-slate-900 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12 border-2 border-white dark:border-slate-800 shadow-sm">
                                <AvatarImage src={user.image} />
                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{user.name}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            {/* Show skills or simple role if available. Using placeholder for now if skills not in basic profile */}
                            <Badge variant="secondary" className="text-xs font-normal">Freelancer</Badge>
                            <Badge variant="outline" className="text-xs font-normal capitalize">{user.profileConfig?.theme || "No Theme"}</Badge>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                            <Link
                                href={`/user/${user.name}`}
                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white hover:underline"
                            >
                                View Profile
                            </Link>
                            <Link
                                href={`/profile/${user.name}`}
                                target="_blank"
                                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Portfolio
                                <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
