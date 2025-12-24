import { getSession } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";

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
