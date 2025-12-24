"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Twitter, Globe, Moon, Sun, MapPin, Mail, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ProfileConfig } from "@/server/actions/profile-config";

interface ThemeProps {
    user: any;
    projects: any[];
    config: ProfileConfig;
}

export function ThemeClassic({ user, projects, config }: ThemeProps) {
    // Classic theme ignores most dynamic color config to preserve the "Original" look
    // But we respect the manual dark mode toggle
    const [isDark, setIsDark] = useState(false);

    // Sync with system or config initially
    useEffect(() => {
        if (config.colorMode === 'dark') setIsDark(true);
        else if (config.colorMode === 'light') setIsDark(false);
        else if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDark(true);
        }
    }, [config.colorMode]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <div className={`min-h-screen transition-colors duration-300 font-sans ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 border-b backdrop-blur-md transition-colors duration-300 ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <span className="text-xl font-bold tracking-tight">{user.name}</span>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex gap-6 text-sm font-medium opacity-80">
                            <a href="#about" className="hover:opacity-100">About</a>
                            <a href="#projects" className="hover:opacity-100">Projects</a>
                            <a href="#contact" className="hover:opacity-100">Contact</a>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="rounded-full"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 pt-32 pb-20">
                {/* Hero */}
                <section id="about" className="flex flex-col-reverse md:flex-row items-center gap-12 mb-32">
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="space-y-2">
                            <h2 className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                {user.headline || "Software Developer"}
                            </h2>
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                                Hello, I'm <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>{user.username || user.name.split(' ')[0]}</span>.
                            </h1>
                        </div>
                        <p className="text-lg md:text-xl opacity-70 leading-relaxed max-w-2xl mx-auto md:mx-0">
                            {user.bio || "I build things for the web."}
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                            {user.socials?.github && (
                                <Link href={user.socials.github} target="_blank">
                                    <Button variant={isDark ? "secondary" : "default"} className="gap-2">
                                        <Github className="w-4 h-4" /> GitHub
                                    </Button>
                                </Link>
                            )}
                            {user.socials?.linkedin && (
                                <Link href={user.socials.linkedin} target="_blank">
                                    <Button variant="outline" className="gap-2">
                                        <Linkedin className="w-4 h-4" /> LinkedIn
                                    </Button>
                                </Link>
                            )}
                            {user.resumeUrl && (
                                <Link href={user.resumeUrl} target="_blank">
                                    <Button variant="outline" className="gap-2">
                                        <FileText className="w-4 h-4" /> Resume
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {user.location && (
                            <div className="flex items-center justify-center md:justify-start gap-2 opacity-60 text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>{user.location}</span>
                            </div>
                        )}
                    </div>

                    <div className="relative w-48 h-48 md:w-80 md:h-80 flex-shrink-0">
                        <div className={`absolute inset-0 rounded-full border-2 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}></div>
                        <div className="absolute inset-4 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 relative shadow-2xl">
                            {user.image ? (
                                <Image src={user.image} alt={user.name} fill className="object-cover" priority />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-blue-500 text-white">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Skills */}
                <section className="mb-32">
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <span className={`w-8 h-1 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`}></span>
                        Skills & Technologies
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {user.skills?.map((skill: string) => (
                            <div
                                key={skill}
                                className={`px-4 py-2 rounded-full font-medium ${isDark ? 'bg-slate-800 text-blue-300' : 'bg-slate-100 text-blue-700'}`}
                            >
                                {skill}
                            </div>
                        )) || <p className="opacity-50">No skills listed yet.</p>}
                    </div>
                </section>

                {/* Projects */}
                <section id="projects" className="mb-32">
                    <h3 className="text-2xl font-bold mb-12 flex items-center gap-2">
                        <span className={`w-8 h-1 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`}></span>
                        Featured Projects
                    </h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project: any) => (
                            <div
                                key={project._id}
                                className={`group rounded-xl overflow-hidden border transition-all hover:shadow-xl ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}
                            >
                                <div className="aspect-video relative overflow-hidden bg-slate-200 dark:bg-slate-900">
                                    {project.screenshots?.[0] ? (
                                        <Image
                                            src={project.screenshots[0]}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-30 font-bold text-xl">
                                            {project.title}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-xl font-bold group-hover:text-blue-500 transition-colors">{project.title}</h4>
                                        <div className="flex gap-2">
                                            {project.liveUrl && <a href={project.liveUrl} target="_blank" className="hover:text-blue-500"><ExternalLink className="w-4 h-4" /></a>}
                                            {project.repoUrl && <a href={project.repoUrl} target="_blank" className="hover:text-blue-500"><Github className="w-4 h-4" /></a>}
                                        </div>
                                    </div>
                                    <p className="text-sm opacity-70 line-clamp-3">{project.scope} {project.longDescription}</p>

                                    {project.technologies?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {project.technologies.slice(0, 3).map((t: string) => (
                                                <Badge key={t} variant={isDark ? "outline" : "secondary"} className="text-xs font-normal">
                                                    {t}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact */}
                <section id="contact" className={`rounded-3xl p-12 text-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <h3 className="text-3xl font-bold mb-4">Get In Touch</h3>
                    <p className="opacity-70 mb-8 max-w-lg mx-auto">
                        Currently {user.availability || "open to new opportunities"}. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>
                    <a href={`mailto:${user.email}`}>
                        <Button size="lg" className={`px-8 ${isDark ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                            Say Hello <Mail className="w-4 h-4 ml-2" />
                        </Button>
                    </a>
                </section>
            </main>
        </div>
    );
}
