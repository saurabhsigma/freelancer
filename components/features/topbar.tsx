import { getSession } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export async function Topbar() {
    const session = await getSession();
    const userName = session?.user?.name || "Freelancer";

    return (
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sm:px-8">
            <h1 className="text-xl font-semibold text-slate-900">
                {/* Dynamic Title could go here, for now keeping generic or context based */}
                Workspace
            </h1>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-700 hidden sm:block">
                        {userName}
                    </span>
                </div>
            </div>
        </header>
    );
}
