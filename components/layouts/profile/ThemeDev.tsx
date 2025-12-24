"use client";

import Link from "next/link";
import { Terminal, Github, Linkedin, Cpu, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileConfig } from "@/server/actions/profile-config";

interface ThemeProps {
    user: any;
    projects: any[];
    config: ProfileConfig;
}

export function ThemeDev({ user, projects, config }: ThemeProps) {
    const { customColors } = config;

    const bg = "#0d1117"; // GitHub dark / Terminal bg
    const fg = "#c9d1d9";
    const accent = customColors?.accent || "#3fb950"; // Terminal green

    return (
        <div
            className="min-h-screen font-mono p-4 md:p-10 selection:bg-green-900 selection:text-green-100"
            style={{ backgroundColor: bg, color: fg }}
        >
            <div className="max-w-4xl mx-auto border border-white/10 rounded-lg bg-[#010409] shadow-2xl min-h-[90vh] flex flex-col">
                {/* Terminal Bar */}
                <div className="h-10 border-b border-white/10 bg-[#161b22] flex items-center px-4 gap-2 rounded-t-lg">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    <div className="ml-4 text-xs opacity-50 flex gap-2">
                        <Terminal className="w-3 h-3" />
                        ~/{user.username || "profile"}
                    </div>
                </div>

                <div className="p-8 md:p-12 space-y-12 flex-1">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm opacity-50">
                            <span style={{ color: accent }}>➜</span>
                            <span>whoami</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                            {user.name}
                        </h1>
                        <p className="text-xl max-w-2xl leading-relaxed" style={{ color: imagePalette(accent) }}>
                            {">"} {user.bio} <span className="animate-pulse">_</span>
                        </p>
                    </div>

                    {/* Socials */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm opacity-50">
                            <span style={{ color: accent }}>➜</span>
                            <span>ls ./socials</span>
                        </div>
                        <div className="flex gap-6 text-sm">
                            {user.socials?.github && <Link href={user.socials.github} className="hover:text-white transition-colors hover:underline decoration-1 underline-offset-4">github.sh</Link>}
                            {user.socials?.linkedin && <Link href={user.socials.linkedin} className="hover:text-white transition-colors hover:underline decoration-1 underline-offset-4">linkedin.sh</Link>}
                            <Link href={`mailto:${user.email}`} className="hover:text-white transition-colors hover:underline decoration-1 underline-offset-4">email.sh</Link>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm opacity-50">
                            <span style={{ color: accent }}>➜</span>
                            <span>cat ./skills.json</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {user.skills?.map((skill: string) => (
                                <div key={skill} className="bg-white/5 border border-white/10 p-2 text-xs rounded hover:border-white/20 transition-colors">
                                    "{skill}"
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Projects */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-sm opacity-50">
                            <span style={{ color: accent }}>➜</span>
                            <span>./projects --list --verbose</span>
                        </div>
                        <div className="space-y-8">
                            {projects.map((project) => (
                                <div key={project._id} className="group border-l-2 pl-6 space-y-2 transition-all hover:border-l-[4px]" style={{ borderColor: accent }}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        {project.liveUrl && <Link href={project.liveUrl} className="text-xs border border-white/20 px-2 py-1 rounded hover:bg-white/10">[ EXECUTE ]</Link>}
                                    </div>
                                    <p className="opacity-70 text-sm max-w-xl">{project.scope}</p>
                                    <div className="text-xs opacity-40 flex gap-2">
                                        {project.technologies?.map((t: string) => <span key={t}>--{t}</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-[#161b22] px-6 py-2 text-xs opacity-40 border-t border-white/10 rounded-b-lg flex justify-between">
                    <span>-- NORMAL --</span>
                    <span>100% Top</span>
                </div>
            </div>
        </div>
    );
}

function imagePalette(color: string) {
    // simple helper, though CSS vars are better usually
    return color;
}
