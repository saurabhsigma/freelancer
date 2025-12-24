"use client";

import { useEffect, useState } from "react";
import { updateProfile } from "@/server/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ProfileImageUpload } from "./profile-image-upload";

// Form Component
function SettingsForm({ user }: { user: any }) {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(user.image);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const fd = new FormData(form);

        const data = {
            username: fd.get("username") as string,
            bio: fd.get("bio") as string,
            image: image, // Use state for image
            skills: (fd.get("skills") as string || "").split(",").map((s: string) => s.trim()).filter(Boolean),
            socials: {
                twitter: fd.get("twitter") as string,
                linkedin: fd.get("linkedin") as string,
                github: fd.get("github") as string,
                website: fd.get("website") as string,
            }
        };

        try {
            const res = await fetch('/api/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) {
                setMessage(json?.error || 'Error updating profile.');
            } else {
                setMessage('Profile updated successfully!');
                router.refresh();
            }
        } catch (err) {
            setMessage('Network error');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-end">
                {user.username && (
                    <Link href={`/profile/${user.username}`} target="_blank" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
                        View Public Profile <ExternalLink className="h-3 w-3" />
                    </Link>
                )}
            </div>

            <div className="grid gap-4">
                <div className="flex justify-center mb-6">
                    <ProfileImageUpload initialImage={user.image} onImageChange={setImage} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="username">Username (Public Profile URL)</Label>
                    <Input id="username" name="username" defaultValue={user.username} placeholder="johndoe" required />
                    <p className="text-xs text-muted-foreground">Local: /profile/{user.username || 'username'}</p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" name="bio" defaultValue={user.bio} placeholder="Senior React Developer..." className="min-h-[120px]" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input id="skills" name="skills" defaultValue={user.skills?.join(", ")} placeholder="React, Node.js, Design" />
                </div>

                <div className="grid gap-2">
                    <Label>Social Links</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <Input name="twitter" defaultValue={user.socials?.twitter} placeholder="Twitter URL" />
                        <Input name="linkedin" defaultValue={user.socials?.linkedin} placeholder="LinkedIn URL" />
                        <Input name="github" defaultValue={user.socials?.github} placeholder="GitHub URL" />
                        <Input name="website" defaultValue={user.socials?.website} placeholder="Portfolio Website" />
                    </div>
                </div>
            </div>

            <Button type="submit">Save Changes</Button>
            {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
        </form>
    );
}

// Page Component
export default function SettingsPage({ user }: { user: any }) {
    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your public profile information.</CardDescription>
            </CardHeader>
            <CardContent>
                <SettingsForm user={user} />
            </CardContent>
        </Card>
    );
}
