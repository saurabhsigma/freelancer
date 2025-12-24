
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Globe, Mail, MapPin, Calendar, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { ProfileConfig } from "@/server/actions/profile-config";

interface ThemeProps {
    user: any;
    projects: any[];
    config: ProfileConfig;
}

export function ThemeProfessional({ user, projects, config }: ThemeProps) {
    const { customColors, font, animationIntensity } = config;

    // Professional theme defaults are usually safer to keep standard, but let's allow overrides
    // We only use the accent color heavily, background/text are usually better kept white/slate for "Professional" look
    // unless user explicitly overrides.

    // safe defaults
    const bg = customColors?.background || "#f8fafc"; // slate-50
    const text = customColors?.text || "#0f172a"; // slate-900
    const accent = customColors?.accent || "#2563eb"; // blue-600

    const fontClass = font === "playfair" ? "font-serif" : font === "roboto_mono" ? "font-mono" : "font-sans";

    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: animationIntensity === "high" ? 0.2 : 0.1 }
        }
    };

    const slideIn: Variants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { duration: 0.4 } }
    };

    const fadeIn: Variants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <div
            className={`min-h-screen ${fontClass}`}
            style={{ backgroundColor: bg, color: text }}
        >
            <div className="container mx-auto max-w-6xl px-4 py-8 md:py-16">

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid md:grid-cols-12 gap-6"
                >
                    {/* Sidebar / Personal Info */}
                    <motion.aside variants={slideIn} className="md:col-span-4 lg:col-span-3 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border p-6 text-center" style={{ borderColor: `${text}15` }}>
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-slate-200 mb-4 border-4" style={{ borderColor: `${bg}` }}>
                                {user.image ? (
                                    <Image src={user.image} alt={user.name} width={128} height={128} className="object-cover w-full h-full" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold opacity-30">{user.name[0]}</div>
                                )}
                            </div>
                            <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                            <p className="text-sm mb-6 opacity-70">{user.bio}</p>

                            <div className="space-y-3 text-left">
                                <div className="flex items-center gap-3 text-sm opacity-80">
                                    <Mail className="w-4 h-4" />
                                    <a href={`mailto:${user.email}`} className="hover:underline truncate">{user.email}</a>
                                </div>
                                {user.socials?.website && (
                                    <div className="flex items-center gap-3 text-sm opacity-80">
                                        <Globe className="w-4 h-4" />
                                        <a href={user.socials.website} className="hover:underline truncate">{user.socials.website.replace('https://', '')}</a>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm opacity-80">
                                    <MapPin className="w-4 h-4" />
                                    <span>Remote / Worldwide</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t flex justify-center gap-4" style={{ borderColor: `${text}10` }}>
                                {user.socials?.github && <Link href={user.socials.github} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><Github className="w-5 h-5" /></Link>}
                                {user.socials?.linkedin && <Link href={user.socials.linkedin} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><Linkedin className="w-5 h-5" /></Link>}
                            </div>
                        </div>

                        {/* Skills Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border p-6" style={{ borderColor: `${text}15` }}>
                            <h3 className="font-bold mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map((skill: string) => (
                                    <Badge key={skill} variant="secondary" className="font-normal" style={{ backgroundColor: `${text}10`, color: text }}>
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </motion.aside>

                    {/* Main Content */}
                    <motion.main variants={fadeIn} className="md:col-span-8 lg:col-span-9 space-y-6">
                        {/* Projects */}
                        <section className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border p-8" style={{ borderColor: `${text}15` }}>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: accent }}>
                                <BriefcaseIcon className="w-5 h-5" />
                                Projects & Experience
                            </h2>

                            <div className="space-y-8">
                                {projects.map((project: any) => (
                                    <div key={project._id} className="relative pl-8 border-l-2 last:border-0 pb-8 last:pb-0" style={{ borderColor: `${text}10` }}>
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full ring-4 ring-white dark:ring-slate-900" style={{ backgroundColor: accent }}></div>

                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold">{project.title}</h3>
                                                <p className="font-medium text-sm text-opacity-80" style={{ color: accent }}>{project.scope}</p>
                                                <div className="flex gap-3 mt-1 text-xs">
                                                    {project.liveUrl && <a href={project.liveUrl} target="_blank" className="hover:underline flex items-center gap-1 opacity-70">Live Demo <ExternalLink className="w-3 h-3" /></a>}
                                                    {project.repoUrl && <a href={project.repoUrl} target="_blank" className="hover:underline flex items-center gap-1 opacity-70">Code <Github className="w-3 h-3" /></a>}
                                                </div>
                                            </div>
                                            <span className="text-xs px-2 py-1 rounded mt-2 sm:mt-0 inline-block opacity-60 bg-slate-100 dark:bg-slate-800">
                                                {new Date(project.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                            </span>
                                        </div>

                                        <p className="leading-relaxed mb-4 opacity-70">
                                            {project.description || project.longDescription || "Project details..."}
                                        </p>

                                        {project.technologies?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.technologies.map((t: string) => (
                                                    <span key={t} className="text-xs font-mono opacity-50">#{t}</span>
                                                ))}
                                            </div>
                                        )}

                                        {project.screenshots?.[0] && (
                                            <div className="mt-4 rounded-lg overflow-hidden border max-w-md" style={{ borderColor: `${text}20` }}>
                                                <Image
                                                    src={project.screenshots[0]}
                                                    alt={project.title}
                                                    width={400}
                                                    height={250}
                                                    className="w-full object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </motion.main>
                </motion.div>
            </div>
        </div>
    );
}

function BriefcaseIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    )
}
