"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavActionsProps {
    user?: {
        name?: string;
        email?: string;
    } | null;
}

export function NavActions({ user }: NavActionsProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.refresh(); 
        } catch (e) {
            console.error("Logout failed", e);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
                <>
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Button 
                        onClick={handleLogout} 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full px-5 border-slate-200 dark:border-slate-800"
                    >
                        Sign out
                    </Button>
                    <Link href="/dashboard" className="sm:hidden">
                         <Button size="sm" className="rounded-full">Dashboard</Button>
                    </Link>
                </>
            ) : (
                <>
                    <Link href="/login" className="text-sm font-medium hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        Login
                    </Link>
                    <Link href="/signup">
                        <Button size="sm" className="rounded-full px-5">Get Started</Button>
                    </Link>
                </>
            )}
        </div>
    );
}
