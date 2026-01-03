"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User as UserIcon } from "lucide-react"; // Import UserIcon
import { getPrivateMessages, sendPrivateMessage } from "@/server/actions/chat";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils"; // Import cn

export function PrivateChatView({
    currentUser,
    initialConversations,
    selectedUser // optional initial user to chat with
}: {
    currentUser: any;
    initialConversations: any[];
    selectedUser?: any
}) {
    const [conversations, setConversations] = useState(initialConversations);
    const [activeUser, setActiveUser] = useState<any>(selectedUser || null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const [lastPolled, setLastPolled] = useState(Date.now());

    // If selectedUser is provided but not in conversations, add them temporarily?
    // Usually if I click "Chat" on profile, I might have 0 messages.
    useEffect(() => {
        if (selectedUser && !conversations.find((c: any) => c.user._id === selectedUser._id)) {
            // Add temp conversation
            setConversations(prev => [{ user: selectedUser, lastMessage: null }, ...prev]);
            setActiveUser(selectedUser);
        }
    }, [selectedUser]);

    // Fetch messages when active user changes
    useEffect(() => {
        if (activeUser) {
            getPrivateMessages(activeUser._id).then(setMessages);
        }
    }, [activeUser]);

    // Polling for new messages (every 3s)
    useEffect(() => {
        const interval = setInterval(async () => {
            if (activeUser) {
                const msgs = await getPrivateMessages(activeUser._id);
                // Simple diff or replace
                if (msgs.length !== messages.length) {
                    setMessages(msgs);
                }
            }
            // Also refresh convos?
        }, 3000);
        return () => clearInterval(interval);
    }, [activeUser, messages.length]);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !activeUser) return;

        // Optimistic UI
        const tempMsg = {
            _id: Math.random(),
            content: input,
            senderId: currentUser.id || currentUser._id,
            createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, tempMsg]);
        setInput("");

        await sendPrivateMessage(activeUser._id, input);
        // Refresh to get real ID
        const msgs = await getPrivateMessages(activeUser._id);
        setMessages(msgs);
    };

    return (
        <div className="flex h-full bg-white dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Sidebar List */}
            <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col">
                <div className="p-4 border-b dark:border-slate-800">
                    <h2 className="font-semibold px-2">Messages</h2>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {conversations.map((conv: any) => (
                            <button
                                key={conv.user._id}
                                onClick={() => setActiveUser(conv.user)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                                    activeUser?._id === conv.user._id
                                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                )}
                            >
                                <Avatar>
                                    <AvatarImage src={conv.user.image} />
                                    <AvatarFallback>{conv.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-medium truncate">{conv.user.name}</span>
                                        {conv.lastMessage && (
                                            <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                                                {formatDistanceToNow(new Date(conv.lastMessage.createdAt))}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 truncate h-4">
                                        {conv.lastMessage?.content || "Start a conversation"}
                                    </p>
                                </div>
                            </button>
                        ))}
                        {conversations.length === 0 && (
                            <div className="p-4 text-center text-sm text-slate-500">
                                No conversations yet. Search for a user to start chatting.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            {activeUser ? (
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-950">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={activeUser.image} />
                            <AvatarFallback>{activeUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">{activeUser.name}</h3>
                            <p className="text-xs text-slate-500">Online</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950"
                        ref={scrollRef}
                    >
                        {messages.map((msg: any) => {
                            const isMe = msg.senderId === (currentUser.id || currentUser._id);
                            return (
                                <div key={msg._id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                    <div className={cn(
                                        "max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                                        isMe
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-bl-none"
                                    )}>
                                        <p>{msg.content}</p>
                                        <span className={cn("text-[10px] block text-right mt-1", isMe ? "text-blue-100" : "text-slate-400")}>
                                            {formatDistanceToNow(new Date(msg.createdAt))}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white dark:bg-slate-950 border-t dark:border-slate-800">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1"
                            />
                            <Button onClick={handleSend} size="icon" disabled={!input.trim()}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                        <UserIcon className="w-8 h-8 opacity-50" /> {/* Use imported UserIcon */}
                    </div>
                    <p>Select a conversation to start chatting</p>
                </div>
            )}
        </div>
    );
}
