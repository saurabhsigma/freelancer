"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileConfig } from "@/server/actions/profile-config";

interface ThemeProps {
    user: any;
    projects: any[];
    config: ProfileConfig;
}

export function ThemeZen({ user, projects, config }: ThemeProps) {
    const { customColors } = config;

    const bg = customColors?.background || "#fdfbf7"; // Warm paper
    const fg = customColors?.text || "#2c2c2c";

    return (
        <div
            className="min-h-screen font-serif"
            style={{ backgroundColor: bg, color: fg }}
        >
            <div className="max-w-2xl mx-auto px-6 py-24 md:py-32 space-y-24">

                {/* Header */}
                <header className="space-y-8 animate-in fade-in duration-1000">
                    <div className="flex justify-between items-baseline border-b border-black/5 pb-8">
                        <h1 className="text-3xl font-medium tracking-tight">{user.name}</h1>
                        <span className="text-sm font-sans opacity-40 uppercase tracking-widest">{user.headline || "Portfolio"}</span>
                    </div>
                    <p className="text-xl md:text-2xl leading-relaxed opacity-80 font-light">
                        {user.bio}
                    </p>
                    <div className="flex gap-6 font-sans text-sm underline underline-offset-4 decoration-black/20 decoration-1">
                        <a href={`mailto:${user.email}`} className="hover:decoration-black/80 transition-all">Email</a>
                        {user.socials?.linkedin && <a href={user.socials.linkedin} className="hover:decoration-black/80 transition-all">LinkedIn</a>}
                        {user.socials?.github && <a href={user.socials.github} className="hover:decoration-black/80 transition-all">GitHub</a>}
                    </div>
                </header>

                {/* Projects */}
                <section className="space-y-16">
                    <h2 className="font-sans text-xs uppercase tracking-widest opacity-40">Selected Work</h2>

                    <div className="space-y-20">
                        {projects.map((project) => (
                            <div key={project._id} className="group space-y-6">
                                {project.screenshots?.[0] && (
                                    <div className="aspect-[16/10] bg-black/5 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                        <Image src={project.screenshots[0]} alt={project.title} fill className="object-cover" unoptimized />
                                    </div>
                                )}
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2 max-w-lg">
                                        <h3 className="text-2xl font-medium flex items-center gap-2">
                                            {project.title}
                                            {project.liveUrl && <Link href={project.liveUrl} className="opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight className="w-4 h-4 opacity-50" /></Link>}
                                        </h3>
                                        <p className="opacity-60 leading-relaxed font-sans text-sm">{project.scope}</p>
                                    </div>
                                    <div className="hidden md:flex gap-2 font-sans text-xs opacity-40 uppercase tracking-wider">
                                        {project.technologies?.slice(0, 2).map((t: string) => <span key={t}>{t}</span>)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="pt-24 border-t border-black/5 text-center text-sm opacity-30 font-sans">
                    Thinking in systems.
                </footer>
            </div>
        </div>
    );
}
