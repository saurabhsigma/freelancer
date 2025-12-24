"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { ProfileConfig } from "@/server/actions/profile-config";
import { useRef } from "react";

interface ThemeProps {
    user: any;
    projects: any[];
    config: ProfileConfig;
}

export function ThemeCreative({ user, projects, config }: ThemeProps) {
    const { customColors } = config;
    const scrollRef = useRef(null);

    const bg = customColors?.background || "#f4f4f0"; // Off-white/cream default
    const fg = customColors?.text || "#1a1a1a";
    const accent = customColors?.accent || "#ff4d00"; // International Orange

    return (
        <div
            ref={scrollRef}
            className="min-h-screen font-serif"
            style={{ backgroundColor: bg, color: fg }}
        >
            {/* Massive Name Header */}
            <header className="fixed top-0 left-0 w-full p-4 mix-blend-difference z-50 text-white flex justify-between uppercase text-xs font-bold tracking-widest">
                <span>{user.name}</span>
                <span>Portfolio {new Date().getFullYear()}</span>
            </header>

            <main className="relative">
                {/* Intro */}
                <section className="h-screen flex flex-col justify-center px-6 md:px-20 relative overflow-hidden">
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-10"
                    >
                        <h1 className="text-[12vw] leading-[0.85] font-black uppercase tracking-tighter" style={{ color: fg }}>
                            {user.headline?.split(" ")[0] || "Creative"} <br />
                            <span className="ml-[10vw]" style={{ color: accent }}>{user.headline?.split(" ")[1] || "Developer"}</span>
                        </h1>
                    </motion.div>

                    <div className="absolute bottom-10 right-10 md:right-20 max-w-sm text-lg md:text-xl font-sans leading-tight">
                        {user.bio}
                        <ArrowDownRight className="w-8 h-8 mt-4" style={{ color: accent }} />
                    </div>
                </section>

                {/* Projects - Sticky Scroll */}
                <div className="relative">
                    {projects.map((project, i) => (
                        <div key={project._id} className="sticky top-0 h-screen flex flex-col md:flex-row bg-white border-t border-black overflow-hidden" style={{ zIndex: i + 1, backgroundColor: i % 2 === 0 ? bg : '#fff' }}>
                            <div className="flex-1 p-10 md:p-20 flex flex-col justify-between">
                                <div className="text-9xl font-bold opacity-10">0{i + 1}</div>
                                <div>
                                    <h2 className="text-5xl md:text-7xl font-bold mb-6 uppercase tracking-tighter">{project.title}</h2>
                                    <div className="flex gap-2 mb-8 font-sans text-sm uppercase tracking-widest border-y border-black/10 py-4">
                                        {project.technologies?.slice(0, 3).map((t: string) => <span key={t}>{t}</span>)}
                                    </div>
                                    <p className="font-sans text-xl opacity-70 max-w-md">{project.scope}</p>
                                </div>
                                <div className="flex gap-4">
                                    {project.liveUrl && (
                                        <Link href={project.liveUrl} className="px-8 py-4 bg-black text-white font-sans font-bold hover:bg-transparent hover:text-black border-2 border-black transition-colors rounded-full flex gap-2 items-center">
                                            Visit Site <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 relative h-[50vh] md:h-auto border-l border-black">
                                {project.screenshots?.[0] && (
                                    <Image src={project.screenshots[0]} alt={project.title} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" unoptimized />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <section className="h-[50vh] flex items-center justify-center bg-black text-white relative z-50">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8">Let's create something.</h2>
                        <a href={`mailto:${user.email}`} className="text-2xl hover:underline underline-offset-8 decoration-2" style={{ textDecorationColor: accent }}>
                            {user.email}
                        </a>
                    </div>
                </section>
            </main>
        </div>
    );
}
