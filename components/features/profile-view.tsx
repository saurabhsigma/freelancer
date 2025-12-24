import { ThemeMinimal } from "@/components/layouts/profile/ThemeMinimal";
import { ThemeBold } from "@/components/layouts/profile/ThemeBold";
import { ThemeProfessional } from "@/components/layouts/profile/ThemeProfessional";
import { ThemeGrid } from "@/components/layouts/profile/ThemeGrid";
import { ThemeClassic } from "@/components/layouts/profile/ThemeClassic";
import { ThemeShowcase } from "@/components/layouts/profile/ThemeShowcase";
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
            case "bold":
                return <ThemeBold user={user} projects={projects} config={config} />;
            case "professional":
                return <ThemeProfessional user={user} projects={projects} config={config} />;
            case "showcase":
                return <ThemeShowcase user={user} projects={projects} config={config} />;
            case "classic":
                return <ThemeClassic user={user} projects={projects} config={config} />;
            case "grid":
                return <ThemeGrid user={user} projects={projects} config={config} />;
            case "minimal":
            default:
                return <ThemeMinimal user={user} projects={projects} config={config} />;
        }
    };

    return (
        <>
            {renderTheme()}
            <EditOverlay />
        </>
    );
}
