import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/features/settings-form";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileEditor } from "@/components/features/profile-builder/ProfileEditor";
import { getProjects } from "@/server/actions/project";
export default async function SettingsPage() {
    const session = await getSession();
    if (!session?.user?.id) redirect("/login");

    await connectToDatabase();
    const user = await User.findById(session.user.id).select("-passwordHash");
    const projects = await getProjects(); // Fetch projects for preview

    if (!user) {
        // Should not happen for logged in user, but handle safety
        return <div>User not found in database. Please contact support.</div>;
    }

    // Parse once
    const userJson = JSON.parse(JSON.stringify(user));

    return (
        <div className="max-w-4xl space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-8">
                    <TabsTrigger value="general">General Account</TabsTrigger>
                    <TabsTrigger value="profile">Profile & Design</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <SettingsForm user={userJson} />
                </TabsContent>

                <TabsContent value="profile">
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
                        <ProfileEditor
                            // Pass the serialized profileConfig from the JSON copy to avoid
                            // accidentally passing Mongoose documents (which may contain
                            // circular references) into client state.
                            initialConfig={userJson.profileConfig}
                            user={userJson}
                            projects={projects}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
