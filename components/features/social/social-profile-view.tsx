"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, UserPlus, UserCheck, MapPin, Link as LinkIcon, Calendar, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { toggleFollow } from "@/server/actions/user";
import { FeedView } from "@/components/features/social/feed-view";
import Link from "next/link";

export function SocialProfileView({ profile, currentUser, isMe }: { profile: any; currentUser: any; isMe: boolean }) {
    const { user, stats, posts } = profile;
    const [isFollowing, setIsFollowing] = useState(user.followers?.includes(currentUser?.id || currentUser?._id));
    const [followerCount, setFollowerCount] = useState(stats.followerCount);

    const handleFollow = async () => {
        // Optimistic
        const newStatus = !isFollowing;
        setIsFollowing(newStatus);
        setFollowerCount((prev: number) => newStatus ? prev + 1 : prev - 1);

        await toggleFollow(user._id);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header / Cover */}
            <div className="h-48 bg-gradient-to-r from-slate-200 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-b-xl relative mb-16">
                {/* Avatar */}
                <div className="absolute -bottom-16 left-8">
                    <Avatar className="w-32 h-32 border-4 border-white dark:border-slate-950 shadow-xl">
                        <AvatarImage src={user.image} className="object-cover" />
                        <AvatarFallback className="text-4xl">{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>

                {/* Actions */}
                <div className="absolute -bottom-12 right-8 flex gap-3">
                    {!isMe && (
                        <>
                            <Button
                                onClick={handleFollow}
                                variant={isFollowing ? "outline" : "default"}
                                className="rounded-full px-6"
                            >
                                {isFollowing ? (
                                    <><UserCheck className="w-4 h-4 mr-2" /> Following</>
                                ) : (
                                    <><UserPlus className="w-4 h-4 mr-2" /> Follow</>
                                )}
                            </Button>

                            <Link href={`/chat?userId=${user._id}`}>
                                <Button variant="secondary" className="rounded-full px-6 shadow-sm">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Message
                                </Button>
                            </Link>
                        </>
                    )}
                    <Link href={`/profile/${user.name}`} target="_blank">
                        <Button variant="secondary" className="rounded-full shadow-sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Portfolio
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="px-8 space-y-6">
                {/* Info */}
                <div>
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <p className="text-slate-500">@{user.username || user.name?.toLowerCase().replace(/\s+/g, '')}</p>

                    <p className="mt-4 text-lg max-w-2xl text-slate-700 dark:text-slate-300">
                        {user.bio || "No bio yet."}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
                        {user.location && <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {user.location}</div>}
                        {user.socials?.website && <div className="flex items-center gap-1"><LinkIcon className="w-4 h-4" /> <a href={user.socials.website} target="_blank" className="hover:underline text-blue-500">{user.socials.website}</a></div>}
                        <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {format(new Date(user.createdAt), 'MMMM yyyy')}</div>
                    </div>

                    <div className="flex gap-6 mt-4">
                        <div className="flex gap-1">
                            <span className="font-bold text-slate-900 dark:text-white">{followerCount}</span>
                            <span className="text-slate-500">Followers</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="font-bold text-slate-900 dark:text-white">{stats.followingCount}</span>
                            <span className="text-slate-500">Following</span>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="posts" className="w-full">
                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                        <TabsTrigger
                            value="posts"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-6 py-3"
                        >
                            Posts
                        </TabsTrigger>
                        <TabsTrigger
                            value="works"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-6 py-3"
                        >
                            Works / Portfolio
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="posts" className="pt-6">
                        <FeedView posts={posts} currentUser={currentUser} />
                    </TabsContent>

                    <TabsContent value="works" className="pt-6">
                        {/* Mini Portfolio Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Fetch projects from user.functionality.projects if available?? 
                                 We don't have them in 'profile' object fully structured maybe.
                                 Ideally we'd fetch them. For now, show a placeholder or basic list.
                              */}
                            <Card className="p-6 text-center text-slate-500 border-dashed">
                                <p>Projects are showcased on the main portfolio.</p>
                                <Link href={`/profile/${user.name}`} className="text-blue-500 underline mt-2 block">
                                    View Full Portfolio
                                </Link>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
