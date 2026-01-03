import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrivateChatView } from "@/components/features/chat/private-chat-view";
import { getConversations } from "@/server/actions/chat";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";

export default async function ChatPage({ searchParams }: { searchParams: { userId?: string } }) {
    const session = await getSession();
    if (!session) redirect("/login");

    const conversations = await getConversations();

    // If param userId is present (clicked from profile), fetch that user details
    let selectedUser = null;
    const { userId } = await (searchParams || {}); // Await in case params are promise in future? Next 15+ convention usually props are promises but searchParams often object.
    // In Next 13/14 searchParams is object.

    if (userId) {
        await connectToDB();
        const user = await User.findById(userId).select("name image _id").lean();
        if (user) {
            selectedUser = JSON.parse(JSON.stringify(user));
        }
    }

    return (
        <div className="h-[calc(100vh-100px)]">
            <PrivateChatView
                currentUser={session.user}
                initialConversations={conversations}
                selectedUser={selectedUser}
            />
        </div>
    );
}
