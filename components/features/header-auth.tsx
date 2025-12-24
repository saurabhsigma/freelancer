"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard } from "lucide-react";

export function HeaderAuth({ session }: { session: any }) {
    if (session) {
        return (
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-sm font-medium hover:text-slate-600 dark:hover:text-slate-300 transition-colors gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 dark:hover:text-red-400 transition-colors gap-2"
                    onClick={async () => {
                        try {
                            await fetch("/api/auth/logout", { method: "POST" });
                            window.location.href = "/"; // Refresh/redirect to home
                        } catch (e) {
                            console.error("Logout failed", e);
                        }
                    }}
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </Button>
            </div>
        );
    }

    return (
        <>
            <Link href="/login" className="text-sm font-medium hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                Login
            </Link>
            <Link href="/signup">
                <Button size="sm" className="rounded-full px-5">Get Started</Button>
            </Link>
        </>
    );
}
