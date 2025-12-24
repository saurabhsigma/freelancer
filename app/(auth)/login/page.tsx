"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
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
                email: fd.get("email") as string,
                password: fd.get("password") as string,
            };

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const json = await res.json();
            if (!res.ok) {
                setError(json?.error || "Login failed");
            } else {
                // Successful login — redirect to home
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
                <h3 className="text-lg font-medium leading-6 text-gray-900">Sign in to your account</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Welcome back.
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
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
                            autoComplete="current-password"
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
                        {pending ? "Signing in..." : "Sign in"}
                    </Button>
                </div>
            </form>

            <div className="text-center text-sm">
                <span className="text-gray-500">Don't have an account? </span>
                <Link href="/signup" className="font-medium text-slate-900 hover:text-slate-800">
                    Sign up
                </Link>
            </div>
        </div>
    );
}
