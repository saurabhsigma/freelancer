"use client";

import { useEffect, useState } from "react";
import { updateProfile } from "@/server/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ExternalLink, Plus, Trash2, Download, Eye, Save } from "lucide-react";
import { ProfileImageUpload } from "./profile-image-upload";
import { ThemeZen } from "@/components/layouts/profile/ThemeZen";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Form Component
function SettingsForm({ user, projects = [] }: { user: any, projects?: any[] }) {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState(user);
    const [isSaving, setIsSaving] = useState(false);

    // Sync formData with props if they change deep (optional, but good for resets)
    useEffect(() => {
        // Only if user ID changes to avoid overwriting types
        if (user._id !== formData._id) setFormData(user);
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.includes("socials.")) {
            const socialKey = name.split(".")[1];
            setFormData({
                ...formData,
                socials: { ...formData.socials, [socialKey]: value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const skills = e.target.value.split(",").map(s => s.trim());
        setFormData({ ...formData, skills });
    };

    const handleImageChange = (url: string) => {
        setFormData({ ...formData, image: url });
    };

    // Experience Management
    const addExperience = () => {
        setFormData({
            ...formData,
            experience: [...(formData.experience || []), { title: "", company: "", startDate: "", endDate: "", description: "" }]
        });
    };

    const removeExperience = (index: number) => {
        const newExp = [...(formData.experience || [])];
        newExp.splice(index, 1);
        setFormData({ ...formData, experience: newExp });
    };

    const updateExperience = (index: number, field: string, value: string) => {
        const newExp = [...(formData.experience || [])];
        newExp[index] = { ...newExp[index], [field]: value };
        setFormData({ ...formData, experience: newExp });
    };

    // Education Management
    const addEducation = () => {
        setFormData({
            ...formData,
            education: [...(formData.education || []), { school: "", degree: "", graduationYear: "", description: "" }]
        });
    };

    const removeEducation = (index: number) => {
        const newEdu = [...(formData.education || [])];
        newEdu.splice(index, 1);
        setFormData({ ...formData, education: newEdu });
    };

    const updateEducation = (index: number, field: string, value: string) => {
        const newEdu = [...(formData.education || [])];
        newEdu[index] = { ...newEdu[index], [field]: value };
        setFormData({ ...formData, education: newEdu });
    };


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSaving(true);
        setMessage("");

        // Prepare payload (Sanitize if needed)
        // Ensure arrays are arrays
        const payload = {
            ...formData,
            skills: Array.isArray(formData.skills) ? formData.skills : []
        };

        try {
            const res = await fetch('/api/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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
        } finally {
            setIsSaving(false);
        }
    }

    const handlePrint = () => {
        // We can use a print stylesheet or just window.print() 
        // Note: Layout needs to handle print media query to hide sidebar/form
        window.print();
    };

    return (
        <div className="flex flex-col xl:flex-row gap-8">
            {/* LEFT: Form Editor */}
            <div className="flex-1 min-w-0 space-y-6 print:hidden">
                <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-lg border sticky top-0 z-10 shadow-sm">
                    <div>
                        <h2 className="text-lg font-bold">Edit Profile</h2>
                        <p className="text-xs text-muted-foreground">Changes reflect live on the right.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrint}>
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSaving} size="sm">
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
                {message && <p className={cn("text-sm font-medium px-4", message.includes("Error") ? "text-red-500" : "text-green-500")}>{message}</p>}

                <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border shadow-sm space-y-8">
                    {/* Basic Info */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Basic Info</h3>
                        <div className="flex gap-6 items-start">
                            <ProfileImageUpload initialImage={formData.image} onImageChange={handleImageChange} />
                            <div className="flex-1 space-y-4">
                                <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="headline">Headline</Label>
                                    <Input id="headline" name="headline" value={formData.headline || ""} onChange={handleChange} placeholder="e.g. Senior Frontend Developer" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="bio">Bio / Summary</Label>
                            <Textarea id="bio" name="bio" value={formData.bio || ""} onChange={handleChange} className="min-h-[100px]" placeholder="Tell your story..." />
                        </div>
                        <div>
                            <Label htmlFor="username">Username / Profile URL</Label>
                            <Input id="username" name="username" value={formData.username || ""} onChange={handleChange} />
                        </div>
                    </section>

                    <hr />

                    {/* Socials */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Contact & Socials</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label>Email</Label><Input name="email" value={formData.email || ""} disabled className="bg-slate-100" /></div>
                            <div><Label>Website</Label><Input name="socials.website" value={formData.socials?.website || ""} onChange={handleChange} placeholder="https://..." /></div>
                            <div><Label>LinkedIn</Label><Input name="socials.linkedin" value={formData.socials?.linkedin || ""} onChange={handleChange} placeholder="https://linkedin.com/..." /></div>
                            <div><Label>GitHub</Label><Input name="socials.github" value={formData.socials?.github || ""} onChange={handleChange} placeholder="https://github.com/..." /></div>
                        </div>
                    </section>

                    <hr />

                    {/* Skills */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Skills</h3>
                        <Label>Comma separated list</Label>
                        <Input name="skills" value={Array.isArray(formData.skills) ? formData.skills.join(", ") : (formData.skills || "")} onChange={handleSkillsChange} placeholder="React, Node.js, Design..." />
                    </section>

                    <hr />

                    {/* Experience */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Experience</h3>
                            <Button variant="outline" size="sm" onClick={addExperience} type="button"><Plus className="w-3 h-3 mr-1" /> Add</Button>
                        </div>
                        <div className="space-y-4">
                            {formData.experience?.map((exp: any, i: number) => (
                                <div key={i} className="p-4 border rounded-md space-y-3 bg-slate-50 dark:bg-slate-800/50">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input placeholder="Job Title" value={exp.title || ""} onChange={(e) => updateExperience(i, "title", e.target.value)} />
                                        <Input placeholder="Company" value={exp.company || ""} onChange={(e) => updateExperience(i, "company", e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input placeholder="Start Date" value={exp.startDate || ""} onChange={(e) => updateExperience(i, "startDate", e.target.value)} />
                                        <Input placeholder="End Date" value={exp.endDate || ""} onChange={(e) => updateExperience(i, "endDate", e.target.value)} />
                                    </div>
                                    <Textarea placeholder="Description of role..." value={exp.description || ""} onChange={(e) => updateExperience(i, "description", e.target.value)} />
                                    <div className="flex justify-end">
                                        <Button variant="ghost" size="sm" onClick={() => removeExperience(i)} className="text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-3 h-3 mr-1" /> Remove</Button>
                                    </div>
                                </div>
                            ))}
                            {(!formData.experience || formData.experience.length === 0) && <p className="text-sm text-muted-foreground italic">No experience added yet.</p>}
                        </div>
                    </section>
                    <hr />
                    {/* Education */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Education</h3>
                            <Button variant="outline" size="sm" onClick={addEducation} type="button"><Plus className="w-3 h-3 mr-1" /> Add</Button>
                        </div>
                        <div className="space-y-4">
                            {formData.education?.map((edu: any, i: number) => (
                                <div key={i} className="p-4 border rounded-md space-y-3 bg-slate-50 dark:bg-slate-800/50">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input placeholder="School / University" value={edu.school || ""} onChange={(e) => updateEducation(i, "school", e.target.value)} />
                                        <Input placeholder="Degree" value={edu.degree || ""} onChange={(e) => updateEducation(i, "degree", e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input placeholder="Graduation Year" value={edu.graduationYear || ""} onChange={(e) => updateEducation(i, "graduationYear", e.target.value)} />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button variant="ghost" size="sm" onClick={() => removeEducation(i)} className="text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-3 h-3 mr-1" /> Remove</Button>
                                    </div>
                                </div>
                            ))}
                            {(!formData.education || formData.education.length === 0) && <p className="text-sm text-muted-foreground italic">No education added yet.</p>}
                        </div>
                    </section>
                </div>
            </div>

            {/* RIGHT: Live Preview (Sticky) */}
            <div className="hidden xl:block w-[50%] min-w-[600px] shrink-0">
                <div className="sticky top-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold flex items-center gap-2"><Eye className="w-4 h-4" /> Live Resume Preview</h3>
                    </div>

                    {/* Document Simulator Container */}
                    <div className="border rounded-xl overflow-hidden shadow-sm bg-slate-100/50 dark:bg-slate-900/50 h-[calc(100vh-100px)] relative flex justify-center p-8 overflow-y-auto custom-scrollbar">
                        <div
                            id="resume-preview"
                            className="bg-white text-black shadow-2xl w-[210mm] min-h-[297mm] origin-top transform scale-[0.65] lg:scale-[0.75] xl:scale-[0.8] transition-transform duration-300"
                            style={{ marginBottom: "-100px" }} // Counteract scaling whitespace
                        >
                            <ThemeZen user={formData} projects={projects} config={formData.profileConfig || {}} resumeMode={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsForm;
