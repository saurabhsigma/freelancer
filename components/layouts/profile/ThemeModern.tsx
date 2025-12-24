"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Globe, Mail, ArrowUpRight, CheckCircle2, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ProfileConfig } from "@/server/actions/profile-config";

interface ThemeProps {
    user: any;
    projects: any[];
    config: ProfileConfig;
}

export function ThemeModern({ user, projects, config }: ThemeProps) {
    const { customColors } = config;

    const bg = customColors?.background || "#000000";
    const fg = customColors?.text || "#ffffff";
    const accent = customColors?.accent || "#5e6ad2";

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div
            className="min-h-screen font-sans selection:bg-white/20"
            style={{ backgroundColor: bg, color: fg }}
        >
            <div className="max-w-[1200px] mx-auto p-6 md:p-12">

                {/* Header */}
                <header className="flex justify-between items-start mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-4">
                        {user.image && (
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 relative">
                                <Image src={user.image} alt={user.name} fill className="object-cover" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-lg font-medium leading-tight">{user.name}</h1>
                            <p className="text-sm opacity-50">{user.headline || "Product Engineer"}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {user.socials?.github && <Link href={user.socials.github} className="opacity-50 hover:opacity-100 transition-opacity"><Github className="w-5 h-5" /></Link>}
                        {user.socials?.linkedin && <Link href={user.socials.linkedin} className="opacity-50 hover:opacity-100 transition-opacity"><Linkedin className="w-5 h-5" /></Link>}
                        <Link href={`mailto:${user.email}`} className="opacity-50 hover:opacity-100 transition-opacity"><Mail className="w-5 h-5" /></Link>
                    </div>
                </header>

                <motion.main
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {/* Hero Statement */}
                    <motion.section variants={fadeInUp} className="mb-24">
                        <h2 className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.1] max-w-3xl">
                            <span className="opacity-50">Building default-to-open </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                                software for the future of work.
                            </span>
                        </h2>
                        <p className="mt-8 text-xl opacity-60 max-w-2xl leading-relaxed">
                            {user.bio}
                        </p>
                    </motion.section>

                    {/* Bento Grid Projects */}
                    <motion.section variants={fadeInUp} className="mb-24">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Featured / Large Card */}
                            {projects[0] && (
                                <div className="lg:col-span-2 row-span-2 group relative rounded-3xl bg-zinc-900/50 border border-white/5 overflow-hidden hover:border-white/10 transition-colors aspect-square md:aspect-auto">
                                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 to-black/50 z-10" />
                                    {projects[0].screenshots?.[0] && (
                                        <Image src={projects[0].screenshots[0]} alt={projects[0].title} fill className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80" unoptimized />
                                    )}
                                    <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <h3 className="text-2xl font-medium mb-2">{projects[0].title}</h3>
                                                <p className="opacity-70 line-clamp-2 max-w-md">{projects[0].scope}</p>
                                            </div>
                                            <Link href={projects[0].liveUrl || '#'} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Small Cards */}
                            {projects.slice(1).map((project: any) => (
                                <div key={project._id} className="group relative rounded-3xl bg-zinc-900/30 border border-white/5 overflow-hidden hover:bg-zinc-900/50 transition-colors min-h-[300px] flex flex-col p-6">
                                    <div className="flex-1 mb-4 relative rounded-xl overflow-hidden bg-black/20">
                                        {project.screenshots?.[0] && (
                                            <Image src={project.screenshots[0]} alt={project.title} fill className="object-cover" unoptimized />
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium">{project.title}</h3>
                                        {project.liveUrl && <Link href={project.liveUrl} className="opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity"><ArrowUpRight className="w-4 h-4" /></Link>}
                                    </div>
                                    <p className="text-sm opacity-50 mt-1 line-clamp-1">{project.scope}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Stack / About */}
                    <motion.section variants={fadeInUp} className="grid md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
                        <div>
                            <h3 className="text-sm font-medium uppercase tracking-widest opacity-40 mb-6">Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.skills?.map((skill: string) => (
                                    <Badge key={skill} variant="secondary" className="bg-white/5 hover:bg-white/10 text-white/80 font-normal border-white/5">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium uppercase tracking-widest opacity-40 mb-6">Experience</h3>
                            <div className="space-y-6">
                                {/* Mock experience if none exists or map real data */}
                                <div className="flex gap-4">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                    <div>
                                        <div className="font-medium">Freelance Full Stack Dev</div>
                                        <div className="text-sm opacity-50">2023 — Present</div>
                                        <p className="text-sm opacity-70 mt-2">Helping startups build scalable products.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                </motion.main>

                <footer className="mt-24 py-8 border-t border-white/10 flex justify-between text-sm opacity-40">
                    <div>© {new Date().getFullYear()} {user.name}</div>
                    <div className="flex gap-4">
                        <span>Twitter</span>
                        <span>GitHub</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
