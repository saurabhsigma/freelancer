// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { ArrowUpRight } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { ProfileConfig } from "@/server/actions/profile-config";

// interface ThemeProps {
//     user: any;
//     projects: any[];
//     config: ProfileConfig;
// }

// export function ThemeZen({ user, projects, config }: ThemeProps) {
//     const { customColors } = config;

//     const bg = customColors?.background || "#fdfbf7"; // Warm paper
//     const fg = customColors?.text || "#2c2c2c";

//     return (
//         <div
//             className="min-h-screen font-serif"
//             style={{ backgroundColor: bg, color: fg }}
//         >
//             <div className="max-w-2xl mx-auto px-6 py-24 md:py-32 space-y-24">

//                 {/* Header */}
//                 <header className="space-y-8 animate-in fade-in duration-1000">
//                     <div className="flex justify-between items-baseline border-b border-black/5 pb-8">
//                         <h1 className="text-3xl font-medium tracking-tight">{user.name}</h1>
//                         <span className="text-sm font-sans opacity-40 uppercase tracking-widest">{user.headline || "Portfolio"}</span>
//                     </div>
//                     <p className="text-xl md:text-2xl leading-relaxed opacity-80 font-light">
//                         {user.bio}
//                     </p>
//                     <div className="flex gap-6 font-sans text-sm underline underline-offset-4 decoration-black/20 decoration-1">
//                         <a href={`mailto:${user.email}`} className="hover:decoration-black/80 transition-all">Email</a>
//                         {user.socials?.linkedin && <a href={user.socials.linkedin} className="hover:decoration-black/80 transition-all">LinkedIn</a>}
//                         {user.socials?.github && <a href={user.socials.github} className="hover:decoration-black/80 transition-all">GitHub</a>}
//                     </div>
//                 </header>

//                 {/* Projects */}
//                 <section className="space-y-16">
//                     <h2 className="font-sans text-xs uppercase tracking-widest opacity-40">Selected Work</h2>

//                     <div className="space-y-20">
//                         {projects.map((project) => (
//                             <div key={project._id} className="group space-y-6">
//                                 {project.screenshots?.[0] && (
//                                     <div className="aspect-[16/10] bg-black/5 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
//                                         <Image src={project.screenshots[0]} alt={project.title} fill className="object-cover" unoptimized />
//                                     </div>
//                                 )}
//                                 <div className="flex justify-between items-start">
//                                     <div className="space-y-2 max-w-lg">
//                                         <h3 className="text-2xl font-medium flex items-center gap-2">
//                                             {project.title}
//                                             {project.liveUrl && <Link href={project.liveUrl} className="opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight className="w-4 h-4 opacity-50" /></Link>}
//                                         </h3>
//                                         <p className="opacity-60 leading-relaxed font-sans text-sm">{project.scope}</p>
//                                     </div>
//                                     <div className="hidden md:flex gap-2 font-sans text-xs opacity-40 uppercase tracking-wider">
//                                         {project.technologies?.slice(0, 2).map((t: string) => <span key={t}>{t}</span>)}
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </section>

//                 <footer className="pt-24 border-t border-black/5 text-center text-sm opacity-30 font-sans">
//                     Thinking in systems.
//                 </footer>
//             </div>
//         </div>
//     );
// }


"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sun, Moon, Github, Linkedin, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { ProfileConfig } from "@/server/actions/profile-config";

interface ThemeProps {
    user: any;
    projects: any[];
    config: ProfileConfig;
    resumeMode?: boolean;
}

export function ThemeZen({ user, projects, config, resumeMode = false }: ThemeProps) {
    const [mounted, setMounted] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Sync with system preference or state
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Force light mode for resume
    const effectiveDark = resumeMode ? false : isDark;

    return (
        <div
            className={`transition-colors duration-700 ease-in-out ${effectiveDark ? "bg-[#121212] text-[#e4e4e4]" : "bg-[#fdfbf7] text-[#1a1a1a]"
                } ${resumeMode ? "min-h-[100%] w-full bg-white !text-black font-sans" : "min-h-screen font-serif"}`}
        >
            {/* Minimal Nav / Theme Toggle - Hide in Resume Mode */}
            {!resumeMode && (
                <nav className="fixed top-0 w-full z-50 px-6 py-8 flex justify-between items-center mix-blend-difference pointer-events-none">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-sans text-white">
                        {user.name} // {new Date().getFullYear()}
                    </span>
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="pointer-events-auto p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        {isDark ? <Sun size={18} className="text-white" /> : <Moon size={18} className="text-white" />}
                    </button>
                </nav>
            )}

            <div className={`mx-auto ${resumeMode ? "p-8 max-w-none space-y-8 text-black" : "max-w-3xl px-6 pt-40 pb-24 space-y-32"}`}>

                {/* Header */}
                <header className={resumeMode ? "space-y-4 border-b border-black/10 pb-6" : "space-y-8"}>
                    <div className="space-y-2">
                        <h1 className={`${resumeMode ? "text-3xl font-bold tracking-tight not-italic" : "text-5xl md:text-7xl font-light tracking-tight italic"}`}>
                            {user.name}
                        </h1>
                        <p className={`font-sans text-xs uppercase tracking-[0.2em] ${resumeMode ? "opacity-70 font-semibold" : "opacity-50 tracking-[0.4em]"}`}>
                            {user.headline || "Digital Craftsman"}
                        </p>
                    </div>

                    <p className={`${resumeMode ? "text-sm leading-relaxed max-w-full opacity-80" : "text-2xl md:text-3xl leading-[1.4] font-light max-w-xl"}`}>
                        {user.bio || "Crafting digital experiences with a focus on simplicity and functional elegance."}
                    </p>

                    <div className={`flex items-center ${resumeMode ? "gap-4 text-xs" : "gap-8 pt-4"}`}>
                        <SocialLink href={`mailto:${user.email}`} icon={<Mail size={resumeMode ? 14 : 16} />} label="Email" className={resumeMode ? "opacity-100 text-black font-semibold" : ""} />
                        {user.socials?.linkedin && <SocialLink href={user.socials.linkedin} icon={<Linkedin size={resumeMode ? 14 : 16} />} label="LinkedIn" className={resumeMode ? "opacity-100 text-black font-semibold" : ""} />}
                        {user.socials?.github && <SocialLink href={user.socials.github} icon={<Github size={resumeMode ? 14 : 16} />} label="GitHub" className={resumeMode ? "opacity-100 text-black font-semibold" : ""} />}
                        {user.socials?.website && <SocialLink href={user.socials.website} icon={<ArrowUpRight size={resumeMode ? 14 : 16} />} label="Portfolio" className={resumeMode ? "opacity-100 text-black font-semibold" : ""} />}
                    </div>
                </header>

                {/* Experience Section - Prioritize for Resume */}
                {user.experience && user.experience.length > 0 && (
                    <section className={resumeMode ? "space-y-4" : "space-y-16"}>
                        <div className="flex items-center gap-4">
                            {!resumeMode && <div className="h-[1px] flex-1 bg-current opacity-10"></div>}
                            <h2 className={`font-sans text-[10px] uppercase tracking-[0.2em] opacity-100 font-bold ${resumeMode ? "border-b border-black pb-1 w-full" : "opacity-40 tracking-[0.5em]"}`}>Experience</h2>
                        </div>
                        <div className={resumeMode ? "space-y-4" : "space-y-12"}>
                            {user.experience.map((exp: any, i: number) => (
                                <div key={i} className={resumeMode ? "grid grid-cols-1 gap-1" : "grid md:grid-cols-12 gap-4 md:gap-8"}>
                                    <div className={`${resumeMode ? "flex justify-between items-baseline" : "md:col-span-3 text-sm opacity-50 font-sans tracking-wide"}`}>
                                        <h3 className={`${resumeMode ? "text-sm font-bold" : "text-xl font-medium"}`}>{exp.title}</h3>
                                        <span className={`${resumeMode ? "text-xs font-semibold opacity-100" : "hidden"}`}>{exp.startDate} — {exp.endDate}</span>
                                    </div>
                                    <div className={`${resumeMode ? "text-xs" : "md:col-span-9 space-y-2"}`}>
                                        {!resumeMode && <div className="text-sm opacity-50 font-sans tracking-wide mb-2">{exp.startDate} — {exp.endDate}</div>}
                                        <div className={`${resumeMode ? "font-semibold opacity-100" : "text-sm uppercase tracking-widest opacity-60 font-sans"}`}>{exp.company}</div>
                                        <p className={`opacity-80 leading-relaxed font-sans whitespace-pre-line ${resumeMode ? "text-xs mt-1" : "text-sm pt-2"}`}>
                                            {exp.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects Section - Simplified for Resume */}
                <section className={resumeMode ? "space-y-4" : "space-y-24"}>
                    <div className="flex items-center gap-4">
                        {!resumeMode && <div className="h-[1px] flex-1 bg-current opacity-10"></div>}
                        <h2 className={`font-sans text-[10px] uppercase tracking-[0.2em] opacity-100 font-bold ${resumeMode ? "border-b border-black pb-1 w-full" : "opacity-40 tracking-[0.5em]"}`}>Selected Works</h2>
                    </div>

                    <div className={resumeMode ? "space-y-4" : "space-y-32"}>
                        {projects.map((project, idx) => (
                            <div key={project._id} className="group relative">
                                <div className={resumeMode ? "" : "grid md:grid-cols-12 gap-8 items-center"}>
                                    {/* Image Column - Hidden in Resume Mode */}
                                    {!resumeMode && (
                                        <div className="md:col-span-7 overflow-hidden bg-neutral-100 dark:bg-neutral-900 rounded-sm">
                                            {project.screenshots?.[0] && (
                                                <div className="aspect-[4/3] relative overflow-hidden grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out">
                                                    <Image src={project.screenshots[0]} alt={project.title} fill className="object-cover" unoptimized />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Text Column */}
                                    <div className={resumeMode ? "flex flex-col gap-1" : "md:col-span-5 space-y-6"}>
                                        <div className={resumeMode ? "flex justify-between items-baseline" : "space-y-2"}>
                                            {!resumeMode && <span className="font-sans text-[10px] opacity-40">0{idx + 1}</span>}
                                            <h3 className={`${resumeMode ? "text-sm font-bold" : "text-3xl font-medium tracking-tight"}`}>
                                                {project.title}
                                            </h3>
                                            {resumeMode && project.liveUrl && <Link href={project.liveUrl} className="text-[10px] underline opacity-70">View Project</Link>}
                                        </div>
                                        <p className={`font-sans ${resumeMode ? "text-xs opacity-80 line-clamp-2" : "opacity-70 leading-relaxed text-sm line-clamp-3"}`}>
                                            {project.scope}
                                        </p>
                                        {!resumeMode && (
                                            <div className="flex flex-wrap gap-3">
                                                {project.technologies?.map((t: string) => (
                                                    <span key={t} className="px-2 py-1 border border-current border-opacity-10 text-[9px] uppercase tracking-widest font-sans">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {!resumeMode && project.liveUrl && (
                                            <Link href={project.liveUrl} className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300">
                                                View Project <ArrowUpRight size={14} />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education Section */}
                {user.education && user.education.length > 0 && (
                    <section className={resumeMode ? "space-y-4" : "space-y-16"}>
                        <div className="flex items-center gap-4">
                            {!resumeMode && <div className="h-[1px] flex-1 bg-current opacity-10"></div>}
                            <h2 className={`font-sans text-[10px] uppercase tracking-[0.2em] opacity-100 font-bold ${resumeMode ? "border-b border-black pb-1 w-full" : "opacity-40 tracking-[0.5em]"}`}>Education</h2>
                        </div>
                        <div className={resumeMode ? "space-y-2" : "space-y-8"}>
                            {user.education.map((edu: any, i: number) => (
                                <div key={i} className={resumeMode ? "flex justify-between items-baseline text-xs" : "grid md:grid-cols-12 gap-4 md:gap-8 border-b border-black/5 pb-8 last:border-0"}>
                                    <div className={resumeMode ? "font-bold" : "md:col-span-9"}>
                                        <h3 className={resumeMode ? "text-sm" : "text-lg font-medium"}>{edu.school}</h3>
                                        <div className={resumeMode ? "opacity-80" : "text-sm opacity-60 font-sans"}>{edu.degree}</div>
                                    </div>
                                    <div className={resumeMode ? "opacity-70 whitespace-nowrap" : "md:col-span-3 text-sm opacity-50 font-sans tracking-wide"}>
                                        {edu.graduationYear}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills Section */}
                {user.skills && user.skills.length > 0 && (
                    <section className={resumeMode ? "space-y-4" : "space-y-16"}>
                        <div className="flex items-center gap-4">
                            {!resumeMode && <div className="h-[1px] flex-1 bg-current opacity-10"></div>}
                            <h2 className={`font-sans text-[10px] uppercase tracking-[0.2em] opacity-100 font-bold ${resumeMode ? "border-b border-black pb-1 w-full" : "opacity-40 tracking-[0.5em]"}`}>Expertise</h2>
                        </div>
                        <div className={`flex flex-wrap ${resumeMode ? "gap-2 text-xs" : "gap-x-8 gap-y-4 max-w-2xl"}`}>
                            {user.skills.map((skill: string, i: number) => (
                                <span key={i} className={resumeMode ? "bg-black/5 px-2 py-1 rounded-sm font-medium" : "text-xl md:text-2xl font-light opacity-80"}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {!resumeMode && (
                    <footer className="pt-32 pb-12 flex flex-col items-center gap-8">
                        <div className="h-12 w-[1px] bg-current opacity-20"></div>
                        <p className="text-sm opacity-40 font-sans tracking-widest uppercase italic">
                            Less, but better.
                        </p>
                    </footer>
                )}
            </div>
        </div>
    );
}

function SocialLink({ href, icon, label, className }: { href: string; icon: React.ReactNode; label: string, className?: string }) {
    return (
        <a
            href={href}
            className={`flex items-center gap-2 font-sans text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity ${className}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </a>
    );
}