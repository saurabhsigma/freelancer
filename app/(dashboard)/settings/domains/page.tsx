import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { DomainSettingsForm } from "@/components/features/domain-settings-form";

export default async function DomainsPage() {
    const session = await getSession();
    if (!session?.user?.id) redirect("/login");

    await connectToDatabase();
    const user = await User.findById(session.user.id);

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Domains & Hosting</h1>
                <p className="text-muted-foreground mt-2">
                    Configure your portfolio's domain settings
                </p>
            </div>

            <DomainSettingsForm username={user.username || ""} />
        </div>
    );
}
