"use client";

import { motion, Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Globe, Mail, Sun, Moon, Printer, ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// ... imports

export function ProfileView({ user, projects, isOwner }: { user: any; projects: any[]; isOwner: boolean }) {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // ... variants ...
    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-rose-500/30 print:bg-white print:text-black">

            {/* Decorative Background - Hide in Print */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden print:hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
            </div>

            {/* Navbar - Hide in Print */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/50 dark:border-slate-800/50 print:hidden"
            >
                <div className="container mx-auto max-w-5xl py-4 px-6 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold tracking-tighter bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                        Freelancer.
                    </Link>
                    <div className="flex items-center gap-3">
                        {mounted && (
                            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="rounded-full">
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2 hidden md:flex">
                            <Printer className="h-4 w-4" /> Save as PDF
                        </Button>
                        {isOwner ? (
                            <Link href="/settings">
                                <Button variant="secondary" size="sm">Edit Profile</Button>
                            </Link>
                        ) : (
                            <Link href={`mailto:${user.email}`}>
                                <Button size="sm" className="rounded-full px-6 font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-lg shadow-purple-500/20">
                                    Hire Me
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </motion.header>

            <motion.main
                variants={container}
                initial="hidden"
                animate="show"
                className="container mx-auto max-w-4xl py-32 px-6 relative z-10 print:py-10 print:px-0"
            >

                {/* Profile Header */}
                <motion.section variants={item} className="text-center space-y-6 mb-16 print:mb-8">
                    <div className="relative inline-block print:hidden">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 mx-auto overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl relative">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name}
                                    fill
                                    className="object-cover"
                                    priority // High priority as it's above fold
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-400">
                                    {user.name?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-900" title="Available for work" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white print:text-black print:text-5xl">
                            {user.name}
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light print:text-slate-700 print:text-lg">
                            {user.bio || "Crafting digital experiences with passion and precision."}
                        </p>
                    </div>

                    {/* Contact Info - Optimized for Resume View */}
                    <div className="flex flex-wrap justify-center gap-4 pt-2 print:gap-6">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 print:text-black">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${user.email}`} className="hover:underline">{user.email}</a>
                        </div>
                        {user.socials?.website && (
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 print:text-black">
                                <Globe className="h-4 w-4" />
                                <a href={user.socials.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{user.socials.website.replace(/^https?:\/\//, '')}</a>
                            </div>
                        )}
                        {user.socials?.github && (
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 print:text-black">
                                <Github className="h-4 w-4" />
                                <a href={user.socials.github} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                            </div>
                        )}
                        {user.socials?.linkedin && (
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 print:text-black">
                                <Linkedin className="h-4 w-4" />
                                <a href={user.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                            </div>
                        )}
                    </div>
                </motion.section>

                {/* Skills */}
                {user.skills && user.skills.length > 0 && (
                    <motion.section variants={item} className="mb-16 text-center print:mb-8">
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-6 hidden print:block">Skills</h2>
                        <div className="flex flex-wrap justify-center gap-2">
                            {user.skills.map((skill: string) => (
                                <span key={skill} className="px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:scale-105 transition-transform cursor-default print:border-slate-300 print:shadow-none">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Experience / Projects */}
                <motion.section variants={item}>
                    <div className="flex items-center justify-between mb-10 print:mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 print:border-black">
                        <h2 className="text-3xl font-bold tracking-tight print:text-2xl">Experience / Projects</h2>
                        <span className="text-sm text-slate-500 font-medium print:hidden">
                            {projects.length} Projects
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-1 print:gap-6">
                        {projects.length > 0 ? (
                            projects.map((project: any, index: number) => (
                                <motion.div
                                    key={project._id}
                                    whileHover={{ y: -5 }}
                                    className={`group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 print:shadow-none print:border-0 print:border-l-2 print:border-slate-300 print:rounded-none print:pl-4 print:hover:shadow-none print:hover:transform-none ${index === 0 && projects.length % 2 !== 0 ? "md:col-span-2 print:col-span-1" : ""}`}
                                >
                                    {/* Hide visual screenshot in print mode to save ink/space, focus on content */}
                                    <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-950/50 relative overflow-hidden print:hidden">
                                        {project.screenshots && project.screenshots.length > 0 ? (
                                            <Image
                                                src={project.screenshots[0]}
                                                alt={project.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-800">
                                                <Globe className="h-20 w-20 opacity-20" />
                                                <span className="sr-only">No image</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                            <Badge className="bg-white text-black hover:bg-white">{project.scope?.split(' ')[0] || "Project"}</Badge>
                                        </div>
                                    </div>

                                    <div className="p-6 print:p-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors print:text-black">
                                                {project.title}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                {project.startDate && <span className="text-xs text-slate-500 print:text-slate-600">{new Date(project.startDate).getFullYear()}</span>}
                                                {project.link && (
                                                    <ExternalLink className="h-4 w-4 text-slate-400 print:hidden" />
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed print:line-clamp-none print:text-slate-800">
                                            {project.scope}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 print:hidden">
                                <p className="text-lg text-slate-500 font-medium">Work in progress...</p>
                                <p className="text-slate-400 text-sm">Check back soon for updates.</p>
                            </div>
                        )}
                    </div>
                </motion.section>

            </motion.main>

            <footer className="py-8 text-center text-slate-500 text-sm dark:text-slate-600 print:hidden">
                © {new Date().getFullYear()} {user.name}. All rights reserved.
            </footer>
        </div>
    );
}
