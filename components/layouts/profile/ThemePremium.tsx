"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Globe, Mail, ArrowUpRight, Code2, Layers, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { ProfileConfig } from "@/server/actions/profile-config";
import { useRef } from "react";

interface ThemeProps {
    user: any;
    projects: any[];
    config: ProfileConfig;
}

export function ThemePremium({ user, projects, config }: ThemeProps) {
    const { customColors, font, animationIntensity } = config;

    // Default to a rich dark theme if custom colors are generic white/black
    const isDefaultBg = !customColors?.background || customColors.background === "#ffffff";
    const bg = isDefaultBg ? "#000000" : customColors.background;
    const fg = customColors?.text || "#ffffff";
    const accent = customColors?.accent || "#8b5cf6"; // violet-500

    const fontClass = font === "playfair" ? "font-serif" : font === "roboto_mono" ? "font-mono" : "font-sans";

    // Animation variants
    const fadeInUp: any = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div
            className={cn(`min-h-screen ${fontClass} selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden`)}
            style={{ backgroundColor: bg, color: fg }}
        >
            {/* Ambient Background Glow */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 animate-pulse"
                    style={{ backgroundColor: accent }}
                />
                <div
                    className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-15 animate-pulse"
                    style={{ backgroundColor: "#3b82f6", animationDelay: "2s" }}
                />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4 backdrop-blur-md border-b border-white/5 bg-black/5">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <span className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        {user.name.split(" ")[0]}<span style={{ color: accent }}>.</span>
                    </span>
                    <div className="flex gap-4">
                        <a href={`mailto:${user.email}`} className="text-sm font-medium hover:text-white/80 transition-colors">
                            Contact
                        </a>
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="min-h-screen flex items-center justify-center px-6 pt-20">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="space-y-6"
                        >
                            {user.image && (
                                <motion.div variants={fadeInUp} className="mx-auto w-32 h-32 md:w-40 md:h-40 relative group">
                                    <div className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" style={{ backgroundColor: accent }}></div>
                                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10">
                                        <Image src={user.image} alt={user.name} fill className="object-cover" priority />
                                    </div>
                                </motion.div>
                            )}

                            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
                                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                                    Building the
                                </span>
                                <span style={{ color: accent }} className="block">
                                    Digital Future
                                </span>
                            </motion.h1>

                            <motion.p variants={fadeInUp} className="text-lg md:text-xl md:max-w-2xl mx-auto leading-relaxed text-white/60">
                                {user.bio || "Creative Developer & UI/UX Designer crafting beautiful digital experiences that leave a lasting impression."}
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 pt-4">
                                <Button
                                    size="lg"
                                    style={{ backgroundColor: accent, color: '#fff' }}
                                    className="rounded-full px-8 h-12 text-base shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.6)] transition-all"
                                >
                                    Get in touch
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full px-8 h-12 text-base border-white/20 hover:bg-white/5 hover:text-white"
                                >
                                    View Projects
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Scrolling Marquee / Tech Stack */}
                        {user.skills?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 1 }}
                                className="pt-20 w-full overflow-hidden"
                            >
                                <p className="text-sm uppercase tracking-widest text-white/30 mb-6 font-semibold">Technologies</p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {user.skills.map((skill: string, i: number) => (
                                        <div
                                            key={skill}
                                            className="px-4 py-2 rounded-full border border-white/5 bg-white/5 text-sm font-medium hover:border-white/20 transition-colors backdrop-blur-sm"
                                        >
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Projects Section */}
                <section className="py-32 px-6">
                    <div className="max-w-6xl mx-auto space-y-20">
                        <div className="flex justify-between items-end border-b border-white/10 pb-6">
                            <h2 className="text-3xl md:text-5xl font-bold">Selected Works</h2>
                            <span className="text-white/40 hidden md:block">2023 — Present</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {projects.map((project: any, index: number) => (
                                <ProjectCard
                                    key={project._id}
                                    project={project}
                                    index={index}
                                    accent={accent}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-20 border-t border-white/10 bg-black/20 backdrop-blur-lg">
                    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Let's work together</h3>
                            <a href={`mailto:${user.email}`} className="text-white/60 hover:text-white transition-colors">
                                {user.email}
                            </a>
                        </div>
                        <div className="flex gap-6">
                            {user.socials?.github && (
                                <Link href={user.socials.github} className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:scale-110 transition-all border border-white/5">
                                    <Github className="w-5 h-5" />
                                </Link>
                            )}
                            {user.socials?.linkedin && (
                                <Link href={user.socials.linkedin} className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:scale-110 transition-all border border-white/5">
                                    <Linkedin className="w-5 h-5" />
                                </Link>
                            )}
                            {user.socials?.website && (
                                <Link href={user.socials.website} className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:scale-110 transition-all border border-white/5">
                                    <Globe className="w-5 h-5" />
                                </Link>
                            )}
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}

function ProjectCard({ project, index, accent }: { project: any, index: number, accent: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative cursor-pointer"
        >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-zinc-900 border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

                {project.screenshots?.[0] ? (
                    <Image
                        src={project.screenshots[0]}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Layers className="w-12 h-12 text-white/10" />
                    </div>
                )}

                <div className="absolute bottom-6 left-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex gap-3">
                        {project.liveUrl && (
                            <Link href={project.liveUrl} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/90">
                                Live Demo <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        )}
                        {project.repoUrl && (
                            <Link href={project.repoUrl} className="flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20 hover:bg-black/70">
                                <Github className="w-4 h-4" /> Code
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <h3 className="text-2xl font-bold mb-2 group-hover:text-violet-400 transition-colors" style={{ color: accent }}>{project.title}</h3>
            <p className="text-white/60 line-clamp-2 mb-4">{project.scope}</p>
            <div className="flex gap-2 flex-wrap">
                {project.technologies?.slice(0, 4).map((tech: string) => (
                    <Badge key={tech} variant="outline" className="border-white/10 bg-white/5 text-white/70">
                        {tech}
                    </Badge>
                ))}
            </div>
        </motion.div>
    );
}
