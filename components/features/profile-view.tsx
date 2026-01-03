import { ThemePremium } from "@/components/layouts/profile/ThemePremium";
import { ThemeModern } from "@/components/layouts/profile/ThemeModern";
import { ThemeCreative } from "@/components/layouts/profile/ThemeCreative";
import { ThemeDev } from "@/components/layouts/profile/ThemeDev";
import { ThemeZen } from "@/components/layouts/profile/ThemeZen";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings } from "lucide-react";

export function ProfileView({ user, projects, isOwner }: { user: any; projects: any[]; isOwner: boolean }) {
    const config = user.profileConfig || {};
    const theme = config.theme || "minimal";

    // Common overlay for owner to edit profile
    const EditOverlay = () => (
        isOwner ? (
            <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
                <Link href="/settings">
                    <Button className="shadow-2xl rounded-full h-14 px-6 gap-2 bg-slate-900 text-white hover:bg-slate-800 border border-white/10">
                        <Settings className="w-5 h-5" />
                        Customize Profile
                    </Button>
                </Link>
            </div>
        ) : null
    );

    const renderTheme = () => {
        switch (theme) {
            case "modern":
                return <ThemeModern user={user} projects={projects} config={config} />;
            case "creative":
                return <ThemeCreative user={user} projects={projects} config={config} />;
            case "dev":
                return <ThemeDev user={user} projects={projects} config={config} />;
            case "zen":
                return <ThemeZen user={user} projects={projects} config={config} />;
            case "premium":
            default:
                return <ThemePremium user={user} projects={projects} config={config} />;
        }
    };

    return (
        <div className={config.colorMode === "dark" ? "dark" : ""}>
            <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
                {renderTheme()}
            </div>
            <EditOverlay />
        </div>
    );
}
