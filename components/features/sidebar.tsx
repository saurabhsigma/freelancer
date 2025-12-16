import { handleLogout } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { SidebarContent } from "./sidebar-content";

export async function Sidebar() {
    const session = await getSession();
    const username = session?.user?.username;

    return (
        <SidebarContent username={username} />
    );
}
