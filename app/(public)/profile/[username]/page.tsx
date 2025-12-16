import { getSession } from "@/lib/auth";
import { getProfile } from "@/server/actions/profile";
import { notFound } from "next/navigation";
import { ProfileView } from "@/components/features/profile-view";

export const metadata = {
    title: "Profile",
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const session = await getSession();
    const data = await getProfile(username);

    if (!data) return notFound();

    const { user, projects } = data;
    const isOwner = session?.user?.username === username;

    return <ProfileView user={user} projects={projects} isOwner={isOwner} />;
}


