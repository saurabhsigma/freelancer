"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchUsers } from "@/server/actions/search";
import Link from "next/link";

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Simple debounce
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                const data = await searchUsers(query);
                setResults(data);
                setIsOpen(true);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="relative w-full max-w-sm ml-4 lg:ml-8 hidden md:block">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-9 bg-slate-100 dark:bg-slate-800 border-none focus-visible:ring-1"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                // onBlur with delay to allow click
                />
            </div>
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50">
                    <div className="space-y-1">
                        {results.map((user) => (
                            <Link
                                href={`/user/${user.name}`} // Or username if available
                                key={user._id}
                                className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.image} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{user.name}</span>
                                    <span className="text-xs text-slate-500 line-clamp-1">{user.headline || "Freelancer"}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Inline useDebounce if not available externally, but I used useEffect above directly.
