"use client";

// Using API endpoint instead of server action for client creation
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ClientForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const form = e.currentTarget as HTMLFormElement;
            const fd = new FormData(form);
            const body = {
                name: fd.get('name'),
                company: fd.get('company'),
                email: fd.get('email'),
                phone: fd.get('phone'),
                notes: fd.get('notes'),
            };

            const res = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const json = await res.json();
            if (!res.ok) {
                setError(json?.error || 'Something went wrong');
                setLoading(false);
            } else {
                // Redirect to clients list
                window.location.href = '/clients';
            }
        } catch (e) {
            setError('Something went wrong');
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg border border-slate-200">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Client Name *</Label>
                    <Input id="name" name="name" placeholder="Jane Doe" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" name="company" placeholder="Acme Inc." />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="jane@example.com" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" placeholder="+1 (555) 000-0000" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Additional details..."
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Client"}</Button>
            </div>
        </form>
    );
}
