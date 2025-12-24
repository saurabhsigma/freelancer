"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setPending(true);
        setError(null);
        try {
            const form = e.currentTarget as HTMLFormElement;
            const fd = new FormData(form);
            const body = {
                name: fd.get("name") as string,
                email: fd.get("email") as string,
                password: fd.get("password") as string,
            };

            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const json = await res.json();
            if (!res.ok) {
                setError(json?.error || "Signup failed");
            } else {
                window.location.href = "/";
            }
        } catch (err) {
            setError("Network error");
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Create your account</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Start organizing your freelance work today.
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="mt-1">
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="email">Email address</Label>
                    <div className="mt-1">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="mt-1">
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                        />
                    </div>
                </div>

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                        {error}
                    </div>
                )}

                <div>
                    <Button
                        type="submit"
                        disabled={pending}
                        className="w-full"
                    >
                        {pending ? "Creating account..." : "Create account"}
                    </Button>
                </div>
            </form>

            <div className="text-center text-sm">
                <span className="text-gray-500">Already have an account? </span>
                <Link href="/login" className="font-medium text-slate-900 hover:text-slate-800">
                    Sign in
                </Link>
            </div>
        </div>
    );
}
