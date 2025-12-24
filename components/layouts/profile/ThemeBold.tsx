"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Globe, Mail, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { ProfileConfig } from "@/server/actions/profile-config";

interface ThemeProps {
    user: any;
    projects: any[];
    config: ProfileConfig;
}

export function ThemeBold({ user, projects, config }: ThemeProps) {
    const { customColors, font, animationIntensity } = config;

    const bg = customColors?.background || "#000000";
    const text = customColors?.text || "#ffffff";
    const accent = customColors?.accent || "#fbbf24"; // yellow-400

    const fontClass = font === "playfair" ? "font-serif" : font === "roboto_mono" ? "font-mono" : "font-sans";

    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: animationIntensity === "high" ? 0.3 : 0.15 }
        }
    };

    const item: Variants = {
        hidden: { opacity: 0, x: -50 },
        show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 50 } }
    };

    return (
        <div
            className={`min-h-screen ${fontClass} selection:bg-yellow-400 selection:text-black`}
            style={{ backgroundColor: bg, color: text }}
        >

            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-6 flex justify-between items-center border-b"
                style={{ borderColor: `${text}33` }} // 20% opacity
            >
                <div className="font-bold text-xl uppercase tracking-widest">{user.name}</div>
                <Button
                    className="rounded-none font-bold uppercase tracking-wider transition-colors"
                    style={{ backgroundColor: text, color: bg, borderColor: text }}
                >
                    <Mail className="w-4 h-4 mr-2" /> Let's Talk
                </Button>
            </motion.header>

            <motion.main variants={container} initial="hidden" animate="show">
                {/* Hero */}
                <motion.section variants={item} className="px-6 py-32 border-b" style={{ borderColor: `${text}33` }}>
                    <div className="max-w-5xl mx-auto">
                        <h1 className="text-6xl md:text-9xl font-black uppercase leading-none mb-8 break-words text-transparent stroke-text"
                            style={{ WebkitTextStroke: `2px ${text}`, color: 'transparent' }}
                        >
                            {user.bio ? user.bio.split(" ").slice(0, 3).join(" ") : "DIGITAL"} <br />
                            <span
                                className="transition-colors duration-300 cursor-default hover:text-current"
                                style={{ color: accent, WebkitTextStroke: "0px" }}
                            >
                                CREATOR
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl max-w-2xl font-light opacity-70">
                            {user.bio}
                        </p>

                        <div className="flex gap-6 mt-12">
                            {user.socials?.github && <Link href={user.socials.github} className="border p-4 hover:opacity-50 transition-all" style={{ borderColor: `${text}80` }}><Github className="w-6 h-6" /></Link>}
                            {user.socials?.linkedin && <Link href={user.socials.linkedin} className="border p-4 hover:opacity-50 transition-all" style={{ borderColor: `${text}80` }}><Linkedin className="w-6 h-6" /></Link>}
                        </div>
                    </div>
                </motion.section>

                {/* Skills Marquee (Simulated) */}
                <motion.div variants={item} className="border-b overflow-hidden py-4" style={{ backgroundColor: accent, color: bg, borderColor: `${text}33` }}>
                    <div className="flex gap-8 animate-marquee whitespace-nowrap font-bold text-lg uppercase tracking-wider">
                        {[...user.skills, ...user.skills, ...user.skills].map((skill: string, i: number) => (
                            <span key={i} className="flex items-center gap-8">
                                {skill} <span className="w-2 h-2 rounded-full" style={{ backgroundColor: bg }} />
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Projects */}
                <motion.section variants={item} className="px-6 py-24">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl font-bold uppercase mb-16 flex items-center gap-4">
                            Selected Works <ArrowUpRight className="w-10 h-10" />
                        </h2>

                        <div className="grid gap-12">
                            {projects.map((project: any, index: number) => (
                                <div key={project._id} className="group border-t pt-12 transition-colors" style={{ borderColor: `${text}33` }}>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <span className="font-bold mb-2 block" style={{ color: accent }}>0{index + 1}</span>
                                            <h3 className="text-5xl font-bold uppercase mb-4 leading-none transition-colors group-hover:text-opacity-80" style={{ color: text }}>{project.title}</h3>
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                <Badge variant="outline" className="rounded-none uppercase" style={{ borderColor: `${text}66`, color: text }}>{project.scope}</Badge>
                                                <Badge variant="outline" className="rounded-none uppercase" style={{ borderColor: `${text}66`, color: text }}>{new Date(project.startDate).getFullYear()}</Badge>
                                            </div>
                                        </div>
                                        <div className="relative aspect-video border grayscale group-hover:grayscale-0 transition-all duration-500" style={{ borderColor: `${text}20`, backgroundColor: `${text}05` }}>
                                            {project.screenshots?.[0] && (
                                                <Image
                                                    src={project.screenshots[0]}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>
            </motion.main>
        </div>
    );
}
