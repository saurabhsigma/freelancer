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
import { ExternalLink, Trash2, Plus } from "lucide-react";
import { ProfileImageUpload } from "./profile-image-upload";

// Form Component
function SettingsForm({ user }: { user: any }) {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(user.image);
    const [experience, setExperience] = useState(user.experience || []);
    const [education, setEducation] = useState(user.education || []);
    const [certifications, setCertifications] = useState(user.certifications || []);
    const [services, setServices] = useState(user.services || []);
    const [hourlyRate, setHourlyRate] = useState(user.hourlyRate || "");
    const [availability, setAvailability] = useState(user.availability || { status: 'available', hoursPerWeek: 40, timezone: 'UTC' });

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const fd = new FormData(form);

        const data = {
            username: fd.get("username") as string,
            bio: fd.get("bio") as string,
            image: image,
            skills: (fd.get("skills") as string || "").split(",").map((s: string) => s.trim()).filter(Boolean),
            socials: {
                twitter: fd.get("twitter") as string,
                linkedin: fd.get("linkedin") as string,
                github: fd.get("github") as string,
                website: fd.get("website") as string,
            },
            experience,
            education,
            certifications,
            services,
            hourlyRate: hourlyRate ? parseInt(hourlyRate) : undefined,
            availability
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

    const addExperience = () => {
        setExperience([...experience, { title: '', company: '', startDate: '', endDate: '', current: false, description: '' }]);
    };

    const removeExperience = (idx: number) => {
        setExperience(experience.filter((_: any, i: number) => i !== idx));
    };

    const updateExperience = (idx: number, field: string, value: any) => {
        const updated = [...experience];
        updated[idx] = { ...updated[idx], [field]: value };
        setExperience(updated);
    };

    const addEducation = () => {
        setEducation([...education, { school: '', degree: '', field: '', graduationYear: new Date().getFullYear(), description: '' }]);
    };

    const removeEducation = (idx: number) => {
        setEducation(education.filter((_: any, i: number) => i !== idx));
    };

    const updateEducation = (idx: number, field: string, value: any) => {
        const updated = [...education];
        updated[idx] = { ...updated[idx], [field]: value };
        setEducation(updated);
    };

    const addCertification = () => {
        setCertifications([...certifications, { name: '', issuer: '', issueDate: '', expiryDate: '', credentialUrl: '' }]);
    };

    const removeCertification = (idx: number) => {
        setCertifications(certifications.filter((_: any, i: number) => i !== idx));
    };

    const updateCertification = (idx: number, field: string, value: any) => {
        const updated = [...certifications];
        updated[idx] = { ...updated[idx], [field]: value };
        setCertifications(updated);
    };

    const addService = () => {
        setServices([...services, { name: '', description: '', price: '' }]);
    };

    const removeService = (idx: number) => {
        setServices(services.filter((_: any, i: number) => i !== idx));
    };

    const updateService = (idx: number, field: string, value: any) => {
        const updated = [...services];
        updated[idx] = { ...updated[idx], [field]: value };
        setServices(updated);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-end">
                {user.username && (
                    <Link href={`/profile/${user.username}`} target="_blank" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
                        View Public Profile <ExternalLink className="h-3 w-3" />
                    </Link>
                )}
            </div>

            {/* Basic Info Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid gap-4">
                    <div className="flex justify-center mb-4">
                        <ProfileImageUpload initialImage={user.image} onImageChange={setImage} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="username">Username (Public Profile URL)</Label>
                        <Input id="username" name="username" defaultValue={user.username} placeholder="johndoe" required />
                        <p className="text-xs text-muted-foreground">Local: /profile/{user.username || 'username'}</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" name="bio" defaultValue={user.bio} placeholder="Senior React Developer..." className="min-h-[100px]" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="skills">Skills (comma separated)</Label>
                        <Input id="skills" name="skills" defaultValue={user.skills?.join(", ")} placeholder="React, Node.js, Design" />
                    </div>

                    <div className="grid gap-2">
                        <Label>Social Links</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <Input name="twitter" defaultValue={user.socials?.twitter} placeholder="Twitter URL" />
                            <Input name="linkedin" defaultValue={user.socials?.linkedin} placeholder="LinkedIn URL" />
                            <Input name="github" defaultValue={user.socials?.github} placeholder="GitHub URL" />
                            <Input name="website" defaultValue={user.socials?.website} placeholder="Portfolio Website" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Professional Info Section */}
            <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Professional Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                        <Input 
                            id="hourlyRate" 
                            type="number" 
                            value={hourlyRate} 
                            onChange={(e) => setHourlyRate(e.target.value)}
                            placeholder="50"
                            min="1"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="availability">Availability Status</Label>
                        <select 
                            id="availability"
                            value={availability.status}
                            onChange={(e) => setAvailability({...availability, status: e.target.value})}
                            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                        >
                            <option value="available">Available</option>
                            <option value="busy">Busy</option>
                            <option value="unavailable">Unavailable</option>
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="hoursPerWeek">Hours Per Week</Label>
                        <Input 
                            id="hoursPerWeek" 
                            type="number" 
                            value={availability.hoursPerWeek}
                            onChange={(e) => setAvailability({...availability, hoursPerWeek: parseInt(e.target.value) || 0})}
                            placeholder="40"
                            min="1"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input 
                            id="timezone" 
                            value={availability.timezone}
                            onChange={(e) => setAvailability({...availability, timezone: e.target.value})}
                            placeholder="UTC, EST, PST, etc."
                        />
                    </div>
                </div>
            </div>

            {/* Experience Section */}
            <div className="border-t pt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Work Experience</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addExperience} className="gap-2">
                        <Plus className="h-4 w-4" /> Add
                    </Button>
                </div>
                <div className="space-y-4">
                    {experience.map((exp: any, idx: number) => (
                        <div key={idx} className="border rounded-lg p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <Input 
                                    placeholder="Job Title" 
                                    value={exp.title} 
                                    onChange={(e) => updateExperience(idx, 'title', e.target.value)}
                                />
                                <Input 
                                    placeholder="Company Name" 
                                    value={exp.company}
                                    onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Input 
                                    type="date" 
                                    placeholder="Start Date"
                                    value={exp.startDate ? exp.startDate.substring(0, 10) : ''}
                                    onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                                />
                                <Input 
                                    type="date" 
                                    placeholder="End Date"
                                    value={exp.endDate && !exp.current ? exp.endDate.substring(0, 10) : ''}
                                    onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                                    disabled={exp.current}
                                />
                            </div>
                            <label className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={exp.current}
                                    onChange={(e) => updateExperience(idx, 'current', e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm">Currently working here</span>
                            </label>
                            <Textarea 
                                placeholder="Description..." 
                                value={exp.description}
                                onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                                className="min-h-[80px]"
                            />
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeExperience(idx)}
                                className="text-red-600 gap-2"
                            >
                                <Trash2 className="h-4 w-4" /> Remove
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Education Section */}
            <div className="border-t pt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addEducation} className="gap-2">
                        <Plus className="h-4 w-4" /> Add
                    </Button>
                </div>
                <div className="space-y-4">
                    {education.map((edu: any, idx: number) => (
                        <div key={idx} className="border rounded-lg p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <Input 
                                    placeholder="School/University" 
                                    value={edu.school}
                                    onChange={(e) => updateEducation(idx, 'school', e.target.value)}
                                />
                                <Input 
                                    placeholder="Degree (e.g., B.S., M.A.)" 
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Input 
                                    placeholder="Field of Study" 
                                    value={edu.field}
                                    onChange={(e) => updateEducation(idx, 'field', e.target.value)}
                                />
                                <Input 
                                    type="number" 
                                    placeholder="Graduation Year"
                                    value={edu.graduationYear}
                                    onChange={(e) => updateEducation(idx, 'graduationYear', parseInt(e.target.value) || new Date().getFullYear())}
                                    min="1950"
                                    max={new Date().getFullYear() + 10}
                                />
                            </div>
                            <Textarea 
                                placeholder="Description (optional)..." 
                                value={edu.description}
                                onChange={(e) => updateEducation(idx, 'description', e.target.value)}
                                className="min-h-[80px]"
                            />
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeEducation(idx)}
                                className="text-red-600 gap-2"
                            >
                                <Trash2 className="h-4 w-4" /> Remove
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Certifications Section */}
            <div className="border-t pt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Certifications & Credentials</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addCertification} className="gap-2">
                        <Plus className="h-4 w-4" /> Add
                    </Button>
                </div>
                <div className="space-y-4">
                    {certifications.map((cert: any, idx: number) => (
                        <div key={idx} className="border rounded-lg p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <Input 
                                    placeholder="Certification Name" 
                                    value={cert.name}
                                    onChange={(e) => updateCertification(idx, 'name', e.target.value)}
                                />
                                <Input 
                                    placeholder="Issuing Organization" 
                                    value={cert.issuer}
                                    onChange={(e) => updateCertification(idx, 'issuer', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Input 
                                    type="date" 
                                    placeholder="Issue Date"
                                    value={cert.issueDate ? cert.issueDate.substring(0, 10) : ''}
                                    onChange={(e) => updateCertification(idx, 'issueDate', e.target.value)}
                                />
                                <Input 
                                    type="date" 
                                    placeholder="Expiry Date"
                                    value={cert.expiryDate ? cert.expiryDate.substring(0, 10) : ''}
                                    onChange={(e) => updateCertification(idx, 'expiryDate', e.target.value)}
                                />
                            </div>
                            <Input 
                                placeholder="Credential URL (optional)" 
                                value={cert.credentialUrl}
                                onChange={(e) => updateCertification(idx, 'credentialUrl', e.target.value)}
                            />
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeCertification(idx)}
                                className="text-red-600 gap-2"
                            >
                                <Trash2 className="h-4 w-4" /> Remove
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Services Section */}
            <div className="border-t pt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Services Offered</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addService} className="gap-2">
                        <Plus className="h-4 w-4" /> Add
                    </Button>
                </div>
                <div className="space-y-4">
                    {services.map((service: any, idx: number) => (
                        <div key={idx} className="border rounded-lg p-4 space-y-3">
                            <Input 
                                placeholder="Service Name (e.g., Web Development)" 
                                value={service.name}
                                onChange={(e) => updateService(idx, 'name', e.target.value)}
                            />
                            <Textarea 
                                placeholder="Service Description..." 
                                value={service.description}
                                onChange={(e) => updateService(idx, 'description', e.target.value)}
                                className="min-h-[80px]"
                            />
                            <Input 
                                type="number" 
                                placeholder="Price (USD)"
                                value={service.price}
                                onChange={(e) => updateService(idx, 'price', e.target.value ? parseInt(e.target.value) : '')}
                                min="1"
                            />
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeService(idx)}
                                className="text-red-600 gap-2"
                            >
                                <Trash2 className="h-4 w-4" /> Remove
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <Button type="submit" className="w-full">Save All Changes</Button>
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
