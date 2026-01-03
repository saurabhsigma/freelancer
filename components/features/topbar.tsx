import { getSession } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export async function Topbar() {
    const session = await getSession();
    const userName = session?.user?.name || "Freelancer";

    return (
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-6 sm:px-8 transition-colors duration-300">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                {/* Dynamic Title could go here, for now keeping generic or context based */}
                Workspace
            </h1>
            <div className="flex items-center gap-4">
                {/* View Public Profile Button */}
                {session?.user?.username && (
                    <Link
                        href={`/profile/${session.user.username}`}
                        target="_blank"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:text-slate-50 h-9 px-3 hidden md:flex gap-2 mr-4"
                    >
                        View Public Profile <ExternalLink size={14} />
                    </Link>
                )}

                <ThemeToggle />
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-medium transition-colors">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block transition-colors">
                        {userName}
                    </span>
                </div>
            </div>
        </header>
    );
}
