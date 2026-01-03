"use client";

import { useState, useEffect, useRef } from "react";
import { getCommunityMessages, sendCommunityMessage } from "@/server/actions/community";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ChatView({ currentUser }: { currentUser: any }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState("");
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        const msgs = await getCommunityMessages();
        // Only update if different? For now just set.
        // In a real app we'd diff or append.
        setMessages(msgs);
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim()) return;
        setSending(true);
        await sendCommunityMessage(inputText);
        setInputText("");
        await fetchMessages();
        setSending(false);
    };

    return (
        <div className="flex flex-col h-[70vh] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Global Freelancer Chat
                </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="text-center text-slate-400 py-10">
                        No messages yet. Say hello!
                    </div>
                )}
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser?.id || msg.senderId === currentUser?._id;
                    return (
                        <div key={msg._id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={msg.senderImage} />
                                <AvatarFallback>{msg.senderName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`p-3 rounded-2xl text-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                                    {msg.content}
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1">
                                    {msg.senderName} • {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                >
                    <Input
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={sending}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={sending || !inputText.trim()} size="icon">
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}
