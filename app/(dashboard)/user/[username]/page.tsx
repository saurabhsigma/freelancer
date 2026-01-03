import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSocialProfile } from "@/server/actions/user";
import { SocialProfileView } from "@/components/features/social/social-profile-view";

export default async function UserProfilePage({ params }: { params: { username: string } }) {
    const session = await getSession();
    if (!session) redirect("/login");

    // params is a promise in Next 15+? No, in Next 14 it's standard, but since it's used in 16 (beta/rc?) from package.json it might be.
    // The previous file I saw used `await params`. I'll do the same for safety.
    const { username } = await params;

    const profile = await getSocialProfile(username);

    if (!profile) return notFound();

    const isMe = (session.user.id || session.user._id) === profile.user._id;

    return <SocialProfileView profile={profile} currentUser={session.user} isMe={isMe} />;
}
