"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Globe, Mail, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ProfileConfig } from "@/server/actions/profile-config";

interface ThemeProps {
    user: any;
    projects: any[];
    config: ProfileConfig;
}

export function ThemeMinimal({ user, projects, config }: ThemeProps) {
    const { customColors, font, animationIntensity } = config;

    const bg = customColors?.background || "#ffffff";
    const fg = customColors?.text || "#18181b"; // zinc-900
    const accent = customColors?.accent || "#2563eb"; // blue-600

    const fontClass = font === "playfair" ? "font-serif" : font === "roboto_mono" ? "font-mono" : "font-sans";

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: animationIntensity === "high" ? 0.2 : 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div
            className={`min-h-screen ${fontClass}`}
            style={{ backgroundColor: bg, color: fg }}
        >
            <motion.main
                variants={container}
                initial="hidden"
                animate="show"
                className="container mx-auto max-w-3xl px-6 py-24"
            >

                {/* Hero */}
                <motion.header variants={item} className="mb-24 space-y-8">
                    <div className="flex items-center gap-6">
                        {user.image && (
                            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                <Image src={user.image} alt={user.name} fill className="object-cover" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ color: fg }}>{user.name}</h1>
                            <p className="text-xl font-light leading-relaxed max-w-lg opacity-70">
                                {user.bio}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 opacity-60">
                        {user.socials?.github && <Link href={user.socials.github} className="hover:opacity-100 transition-opacity"><Github className="w-5 h-5" /></Link>}
                        {user.socials?.linkedin && <Link href={user.socials.linkedin} className="hover:opacity-100 transition-opacity"><Linkedin className="w-5 h-5" /></Link>}
                        {user.socials?.website && <Link href={user.socials.website} className="hover:opacity-100 transition-opacity"><Globe className="w-5 h-5" /></Link>}
                        <Link href={`mailto:${user.email}`} className="hover:opacity-100 transition-opacity"><Mail className="w-5 h-5" /></Link>
                    </div>
                </motion.header>

                {/* Skills */}
                {user.skills?.length > 0 && (
                    <motion.section variants={item} className="mb-24">
                        <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 opacity-40">Expertise</h2>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-lg font-medium">
                            {user.skills.map((skill: string) => (
                                <span key={skill} style={{ color: accent }}>{skill}</span>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Projects */}
                <motion.section variants={item}>
                    <h2 className="text-xs font-semibold uppercase tracking-widest mb-8 opacity-40">Selected Work</h2>
                    <div className="space-y-16">
                        {projects.map((project: any) => (
                            <div key={project._id} className="group cursor-pointer">
                                <div className="mb-4 overflow-hidden rounded-md bg-zinc-50 dark:bg-zinc-900 aspect-video relative">
                                    {project.screenshots?.[0] ? (
                                        <Image
                                            src={project.screenshots[0]}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-20">No Image</div>
                                    )}
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <h3
                                        className="text-xl font-medium group-hover:underline decoration-1 underline-offset-4"
                                        style={{ textDecorationColor: accent }}
                                    >
                                        {project.title}
                                    </h3>
                                    <span className="text-sm opacity-40">{new Date(project.startDate).getFullYear()}</span>
                                </div>
                                <div className="flex gap-4 mt-1 text-sm opacity-50">
                                    {project.liveUrl && <a href={project.liveUrl} target="_blank" className="hover:opacity-100 transition-opacity">Visit Site</a>}
                                    {project.repoUrl && <a href={project.repoUrl} target="_blank" className="hover:opacity-100 transition-opacity">View Code</a>}
                                </div>
                                <p className="mt-2 line-clamp-2 opacity-60">{project.scope}</p>
                                {project.technologies?.length > 0 && (
                                    <div className="flex gap-2 mt-3 opacity-50 text-xs font-mono">
                                        {project.technologies.slice(0, 3).map((t: string) => <span key={t}>#{t}</span>)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.section>

                <motion.footer variants={item} className="mt-24 pt-12 border-t border-zinc-100 dark:border-zinc-900 text-center text-sm opacity-40 font-light">
                    <p>&copy; {new Date().getFullYear()} {user.name}</p>
                </motion.footer>
            </motion.main>
        </div>
    );
}
