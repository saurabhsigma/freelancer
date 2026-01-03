"use client";

import { useState } from "react";
import { createPost, likePost, addComment } from "@/server/actions/feed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link"; // Changed to Next.js Link

export function FeedView({ posts, currentUser }: { posts: any[]; currentUser: any }) {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <CreatePostBox currentUser={currentUser} />
            <div className="space-y-4">
                {posts.map((post) => (
                    <PostCard key={post._id} post={post} currentUser={currentUser} />
                ))}
                {posts.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                        No posts yet. Be the first to share something!
                    </div>
                )}
            </div>
        </div>
    );
}

function CreatePostBox({ currentUser }: { currentUser: any }) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;
        setLoading(true);
        await createPost(content);
        setContent("");
        setLoading(false);
    };

    return (
        <Card className="p-4">
            <div className="flex gap-4">
                <Avatar>
                    <AvatarImage src={currentUser?.image} />
                    <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                    <Textarea
                        placeholder="What's happening?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="resize-none border-none focus-visible:ring-0 text-lg p-0 min-h-[50px] bg-transparent"
                    />
                    <div className="flex justify-end pt-2 border-t">
                        <Button onClick={handleSubmit} disabled={loading || !content.trim()} size="sm" className="rounded-full px-6">
                            {loading ? "Posting..." : "Post"}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function PostCard({ post, currentUser }: { post: any; currentUser: any }) {
    const [commenting, setCommenting] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser?.id || currentUser?._id));
    const [likesCount, setLikesCount] = useState(post.likes.length);

    const handleLike = async () => {
        // Optimistic update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount((prev: number) => newIsLiked ? prev + 1 : prev - 1);

        await likePost(post._id);
    };

    const handleComment = async () => {
        if (!commentText.trim()) return;
        await addComment(post._id, commentText);
        setCommentText("");
        setCommenting(false);
    };

    // Generate valid profile slug from name
    const authorName = post.author?.name || "Anonymous";
    const authorSlug = authorName.toLowerCase().replace(/\s+/g, "");

    return (
        <Card className="p-5 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
            <div className="flex gap-4">
                <Link href={`/user/${authorSlug}`}>
                    <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                        <AvatarImage src={post.author?.image} />
                        <AvatarFallback>{post.author?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <Link href={`/user/${authorSlug}`} className="font-bold hover:underline">
                            {post.author?.name}
                        </Link>
                        <span className="text-sm text-slate-500">
                            • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </span>
                    </div>

                    <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {post.content}
                    </p>

                    <div className="flex items-center gap-6 pt-3">
                        <button
                            onClick={handleLike}
                            className={cn(
                                "flex items-center gap-2 text-sm transition-colors group",
                                isLiked ? "text-pink-600" : "text-slate-500 hover:text-pink-600"
                            )}
                        >
                            <div className={cn("p-2 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20", isLiked && "text-pink-600")}>
                                <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                            </div>
                            <span>{likesCount > 0 && likesCount}</span>
                        </button>

                        <button
                            onClick={() => setCommenting(!commenting)}
                            className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-500 transition-colors group"
                        >
                            <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            <span>{post.comments?.length > 0 && post.comments.length}</span>
                        </button>
                    </div>

                    {commenting && (
                        <div className="flex gap-2 pt-2 animate-in fade-in slide-in-from-top-2">
                            <Textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a reply..."
                                className="min-h-[40px] h-[40px] resize-none"
                            />
                            <Button size="icon" onClick={handleComment} disabled={!commentText.trim()}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    {post.comments?.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                            {post.comments.map((comment: any, idx: number) => (
                                <div key={idx} className="flex gap-2">
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={comment.author?.image} />
                                        <AvatarFallback>{comment.author?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 py-2 text-sm flex-1">
                                        <div className="flex justify-between items-baseline">
                                            <span className="font-bold text-xs">{comment.author?.name}</span>
                                            <span className="text-[10px] text-slate-400">{formatDistanceToNow(new Date(comment.createdAt))}</span>
                                        </div>
                                        <p className="mt-0.5">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
