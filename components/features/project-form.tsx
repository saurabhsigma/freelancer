"use client";

import { createProject } from "@/server/actions/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function ProjectForm({ clients }: { clients: any[] }) {
    const searchParams = useSearchParams();
    const preSelectedClientId = searchParams.get("clientId");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(formData: FormData) {
        setLoading(true);
        setError("");
        try {
            const result = await createProject(formData);
            if (result?.error) {
                setError(result.error);
                setLoading(false);
            }
            // If success, server action handles redirect
        } catch (e) {
            setError("Something went wrong");
            setLoading(false);
        }
    }

    return (
        <form action={onSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg border border-slate-200">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input id="title" name="title" placeholder="Website Redesign" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="clientId">Client *</Label>
                    <select
                        id="clientId"
                        name="clientId"
                        required
                        defaultValue={preSelectedClientId || ""}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="" disabled>Select a client...</option>
                        {clients.map((client) => (
                            <option key={client._id} value={client._id}>{client.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" name="startDate" type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input id="dueDate" name="dueDate" type="date" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            name="status"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="paymentType">Payment Type</Label>
                        <select
                            id="paymentType"
                            name="paymentType"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="fixed">Fixed Price</option>
                            <option value="hourly">Hourly</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="scope">Scope / Description</Label>
                    <textarea
                        id="scope"
                        name="scope"
                        rows={4}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Brief description of the project..."
                    />
                </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Project"}</Button>
            </div>
        </form>
    );
}
