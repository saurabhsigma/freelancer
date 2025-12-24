
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { Client } from "@/models/Client";
import { ProfileEditor } from "@/components/features/profile-builder/ProfileEditor";
import { getProjects } from "@/server/actions/project";

export default async function SettingsProfilePage() {
    const session = await getSession();
    if (!session?.user?.id) redirect("/login");

    await connectToDatabase();
    const user = await User.findById(session.user.id).select("-passwordHash");
    
    // Ensure Client is registered to avoid MissingSchemaError when fetching projects if they populate client
    const _client = Client; 
    
    const projects = await getProjects();

    if (!user) {
        return <div>User not found.</div>;
    }

    const userJson = JSON.parse(JSON.stringify(user));

    return (
        <div className="max-w-[1600px] space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Profile & Design</h2>
                {userJson.username && (
                    <a 
                        href={`/profile/${userJson.username}`} 
                        target="_blank" 
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                        View Public Profile
                    </a>
                )}
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
                <ProfileEditor
                    initialConfig={userJson.profileConfig}
                    user={userJson}
                    projects={projects}
                />
            </div>
        </div>
    );
}
