import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPosts } from "@/server/actions/feed";
import { FeedView } from "@/components/features/social/feed-view";

export default async function FeedPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const posts = await getPosts();

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Home</h1>
            <FeedView posts={posts} currentUser={session.user} />
        </div>
    );
}
