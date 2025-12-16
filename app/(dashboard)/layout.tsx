import { Sidebar } from "@/components/features/sidebar";
import { Topbar } from "@/components/features/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 text-white transition-all duration-300">
                <Sidebar />
            </div>
            <div className="flex flex-col flex-1 md:pl-64 h-full">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-6 sm:p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
