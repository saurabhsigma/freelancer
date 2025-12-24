
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/features/settings-form";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";

export default async function SettingsGeneralPage() {
    const session = await getSession();
    if (!session?.user?.id) redirect("/login");

    await connectToDatabase();
    const user = await User.findById(session.user.id).select("-passwordHash");

    if (!user) {
        return <div>User not found.</div>;
    }

    const userJson = JSON.parse(JSON.stringify(user));

    return (
        <div className="max-w-4xl space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">General Account</h2>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
                <SettingsForm user={userJson} />
            </div>
        </div>
    );
}
