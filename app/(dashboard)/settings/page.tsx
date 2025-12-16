import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/features/settings-form";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";

export default async function SettingsPage() {
    const session = await getSession();
    if (!session?.user?.id) redirect("/login");

    await connectToDatabase();
    const user = await User.findById(session.user.id).select("-passwordHash");

    if (!user) {
        // Should not happen for logged in user, but handle safety
        return <div>User not found in database. Please contact support.</div>;
    }

    return (
        <div className="max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Settings</h2>
            <SettingsForm user={JSON.parse(JSON.stringify(user))} />
        </div>
    );
}
