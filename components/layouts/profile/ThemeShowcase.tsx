"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Github, ExternalLink, Mail } from "lucide-react";
import { ProfileConfig } from "@/server/actions/profile-config";

interface ThemeProps {
    user: any;
    projects: any[];
    config: ProfileConfig;
}

export function ThemeShowcase({ user, projects, config }: ThemeProps) {
    const gradient = {
        minimal: "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500",
    };

    return (
        <div className={`min-h-screen font-sans bg-white text-slate-900`}> 
            <header className="relative">
                <div className={`absolute inset-0 ${gradient.minimal} opacity-20 blur-3xl pointer-events-none`} />
                <div className="container mx-auto px-6 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div className="space-y-6">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">{user.headline || 'Freelance Creator'}</h2>
                            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">{user.name}
                                <span className="block text-2xl font-medium text-slate-600 mt-3">{user.bio || 'Designing beautiful interfaces & delightful experiences.'}</span>
                            </h1>

                            <div className="flex items-center gap-3">
                                {config.cta?.label && (
                                    <Link href={config.cta?.link || `mailto:${user.email}`} className="no-underline">
                                        <Button size="lg" className={config.cta?.style === 'outline' ? 'bg-transparent border' : config.cta?.style === 'ghost' ? 'bg-transparent' : 'bg-slate-900 text-white px-6'}>{config.cta.label}</Button>
                                    </Link>
                                )}
                                <Link href={user.socials?.github || '#'} target="_blank">
                                    <Button variant="outline" className="gap-2">{user.socials?.github ? <Github className="w-4 h-4" /> : <Globe className="w-4 h-4" />} View work</Button>
                                </Link>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-6">
                                {(user.skills || []).slice(0, 6).map((s: string) => (
                                    <Badge key={s} className="bg-white/80 text-slate-900">{s}</Badge>
                                ))}
                            </div>
                        </div>

                        <div className="w-full">
                            <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-tr from-white/60 to-white/40 border border-white/30">
                                <div className="aspect-[16/10] relative bg-slate-100">
                                    {user.image ? (
                                        <Image src={user.image} alt={user.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-slate-300">{user.name?.charAt(0)}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-16">
                <section>
                    <h3 className="text-3xl font-bold mb-6">Featured Projects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {projects.map((project: any) => (
                            <motion.article key={project._id} whileHover={{ y: -6 }} className="bg-white rounded-2xl p-6 shadow-lg border">
                                <div className="aspect-[4/3] bg-slate-100 rounded-md overflow-hidden mb-4 relative">
                                    {project.screenshots?.[0] ? (
                                        <Image src={project.screenshots[0]} alt={project.title} fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-400">{project.title}</div>
                                    )}
                                </div>
                                <h4 className="text-xl font-semibold mb-2">{project.title}</h4>
                                <p className="text-sm text-slate-600 line-clamp-3">{project.scope}</p>
                                <div className="flex items-center gap-2 mt-4">
                                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 text-slate-600" /></a>}
                                    {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noreferrer"><Github className="w-4 h-4 text-slate-600" /></a>}
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
