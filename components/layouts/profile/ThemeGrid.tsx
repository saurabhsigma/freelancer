"use client";

import { motion, Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Globe, Mail, ExternalLink, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProfileConfig } from "@/server/actions/profile-config";

interface ThemeGridProps {
    user: any;
    projects: any[];
    config: ProfileConfig;
}

export function ThemeGrid({ user, projects, config }: ThemeGridProps) {
    const { customColors, font, animationIntensity } = config;

    // safe defaults
    const bg = customColors?.background || "#ffffff";
    const text = customColors?.text || "#0f172a";
    const accent = customColors?.accent || "#2563eb";

    const fontClass = font === "playfair" ? "font-serif" : font === "roboto_mono" ? "font-mono" : "font-sans";

    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: animationIntensity === "high" ? 0.2 : 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const item: Variants = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } },
    };

    return (
        <div
            className={`min-h-screen p-4 md:p-8 ${fontClass}`}
            style={{ backgroundColor: bg, color: text }}
        >
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-7xl mx-auto space-y-12"
            >
                {/* Header */}
                <motion.header variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter" style={{ color: text }}>
                            {user.name}
                        </h1>
                        <p className="text-xl md:text-2xl font-light opacity-80" style={{ color: text }}>
                            {user.bio}
                        </p>
                        <div className="flex gap-4">
                            {user.socials?.github && (
                                <Link href={user.socials.github} target="_blank" className="p-2 rounded-full border border-current hover:opacity-50 transition-opacity">
                                    <Github className="w-5 h-5" />
                                </Link>
                            )}
                            {user.socials?.linkedin && (
                                <Link href={user.socials.linkedin} target="_blank" className="p-2 rounded-full border border-current hover:opacity-50 transition-opacity">
                                    <Linkedin className="w-5 h-5" />
                                </Link>
                            )}
                            <Link href={`mailto:${user.email}`} className="px-6 py-2 rounded-full font-bold transition-all hover:scale-105" style={{ backgroundColor: text, color: bg }}>
                                Contact Me
                            </Link>
                        </div>
                    </div>
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4" style={{ borderColor: accent }}>
                        {user.image ? (
                            <Image src={user.image} alt={user.name} width={128} height={128} className="object-cover w-full h-full" />
                        ) : (
                            <div className="w-full h-full bg-slate-200" />
                        )}
                    </div>
                </motion.header>

                {/* Projects Grid (Masonry-ish) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, idx) => (
                        <motion.div
                            key={project._id}
                            variants={item}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className={`group rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 ${idx % 3 === 0 ? "md:col-span-2" : ""}`}
                            style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${text}20` }}
                        >
                            <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                                {project.screenshots?.[0] ? (
                                    <Image
                                        src={project.screenshots[0]}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-20 text-4xl font-black">
                                        {project.title.charAt(0)}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    {project.liveUrl && (
                                        <Link href={project.liveUrl} target="_blank" className="bg-white text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                                            View Live <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-2xl font-bold" style={{ color: text }}>{project.title}</h3>
                                    <Badge variant="outline" style={{ borderColor: accent, color: accent }}>
                                        {project.status}
                                    </Badge>
                                </div>
                                <p className="opacity-70 line-clamp-2" style={{ color: text }}>{project.scope}</p>
                                {project.technologies && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {project.technologies.map((tech: string) => (
                                            <span key={tech} className="text-xs font-mono opacity-60">#{tech}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
