"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    FileText,
    LogOut,
    Settings,
    FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleLogout } from "@/server/actions/auth";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Projects", href: "/projects", icon: Briefcase },
    { name: "Invoices", href: "/invoices", icon: FileText },
];

export function SidebarContent({ username }: { username?: string }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full w-64 bg-slate-900 text-slate-300 border-r border-slate-800">
            <div className="flex items-center h-16 px-6 border-b border-slate-800 bg-slate-950">
                <FolderOpen className="w-6 h-6 text-white mr-2" />
                <span className="text-lg font-bold text-white tracking-tight">Freelancer OS</span>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
                                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}

                {/* Profile Group (Hover to expand) */}
                <div className="relative group">
                    <div
                        className={cn(
                            "flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors text-slate-400 hover:bg-slate-800 hover:text-white",
                             pathname.startsWith("/settings") ? "text-white bg-slate-800" : ""
                        )}
                    >
                        <Users className={cn("mr-3 flex-shrink-0 h-5 w-5 transition-colors", pathname.startsWith("/settings") ? "text-white" : "text-slate-400 group-hover:text-white")} />
                        <span>Profile Settings</span>
                        {/* Hover Menu */}
                        <div className="absolute left-full top-0 ml-2 w-48 rounded-md bg-slate-900 border border-slate-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <div className="py-1">
                                <Link
                                    href="/settings/general"
                                    className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                >
                                    General Account
                                </Link>
                                <Link
                                    href="/settings/profile"
                                    className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                >
                                    Profile & Design
                                </Link>
                                {username && (
                                    <div className="border-t border-slate-800 mt-1 pt-1">
                                        <Link
                                            href={`/profile/${username}`}
                                            target="_blank"
                                            className="block px-4 py-2 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                                        >
                                            View Public Page ↗
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="p-4 border-t border-slate-800">

                <button
                    type="button"
                    onClick={async () => {
                        try {
                            await fetch("/api/auth/logout", { method: "POST" });
                            window.location.href = "/login";
                        } catch (e) {
                            // ignore
                        }
                    }}
                    className="flex w-full items-center px-3 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign out
                </button>
            </div>
        </div>
    );
}
