// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { ArrowDownRight, ArrowUpRight } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { ProfileConfig } from "@/server/actions/profile-config";
// import { useRef } from "react";

// interface ThemeProps {
//     user: any;
//     projects: any[];
//     config: ProfileConfig;
// }

// export function ThemeCreative({ user, projects, config }: ThemeProps) {
//     const { customColors } = config;
//     const scrollRef = useRef(null);

//     const bg = customColors?.background || "#f4f4f0"; // Off-white/cream default
//     const fg = customColors?.text || "#1a1a1a";
//     const accent = customColors?.accent || "#ff4d00"; // International Orange

//     return (
//         <div
//             ref={scrollRef}
//             className="min-h-screen font-serif"
//             style={{ backgroundColor: bg, color: fg }}
//         >
//             {/* Massive Name Header */}
//             <header className="fixed top-0 left-0 w-full p-4 mix-blend-difference z-50 text-white flex justify-between uppercase text-xs font-bold tracking-widest">
//                 <span>{user.name}</span>
//                 <span>Portfolio {new Date().getFullYear()}</span>
//             </header>

//             <main className="relative">
//                 {/* Intro */}
//                 <section className="h-screen flex flex-col justify-center px-6 md:px-20 relative overflow-hidden">
//                     <motion.div
//                         initial={{ x: -100, opacity: 0 }}
//                         animate={{ x: 0, opacity: 1 }}
//                         transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
//                         className="relative z-10"
//                     >
//                         <h1 className="text-[12vw] leading-[0.85] font-black uppercase tracking-tighter" style={{ color: fg }}>
//                             {user.headline?.split(" ")[0] || "Creative"} <br />
//                             <span className="ml-[10vw]" style={{ color: accent }}>{user.headline?.split(" ")[1] || "Developer"}</span>
//                         </h1>
//                     </motion.div>

//                     <div className="absolute bottom-10 right-10 md:right-20 max-w-sm text-lg md:text-xl font-sans leading-tight">
//                         {user.bio}
//                         <ArrowDownRight className="w-8 h-8 mt-4" style={{ color: accent }} />
//                     </div>
//                 </section>

//                 {/* Projects - Sticky Scroll */}
//                 <div className="relative">
//                     {projects.map((project, i) => (
//                         <div key={project._id} className="sticky top-0 h-screen flex flex-col md:flex-row bg-white border-t border-black overflow-hidden" style={{ zIndex: i + 1, backgroundColor: i % 2 === 0 ? bg : '#fff' }}>
//                             <div className="flex-1 p-10 md:p-20 flex flex-col justify-between">
//                                 <div className="text-9xl font-bold opacity-10">0{i + 1}</div>
//                                 <div>
//                                     <h2 className="text-5xl md:text-7xl font-bold mb-6 uppercase tracking-tighter">{project.title}</h2>
//                                     <div className="flex gap-2 mb-8 font-sans text-sm uppercase tracking-widest border-y border-black/10 py-4">
//                                         {project.technologies?.slice(0, 3).map((t: string) => <span key={t}>{t}</span>)}
//                                     </div>
//                                     <p className="font-sans text-xl opacity-70 max-w-md">{project.scope}</p>
//                                 </div>
//                                 <div className="flex gap-4">
//                                     {project.liveUrl && (
//                                         <Link href={project.liveUrl} className="px-8 py-4 bg-black text-white font-sans font-bold hover:bg-transparent hover:text-black border-2 border-black transition-colors rounded-full flex gap-2 items-center">
//                                             Visit Site <ArrowUpRight className="w-4 h-4" />
//                                         </Link>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="flex-1 relative h-[50vh] md:h-auto border-l border-black">
//                                 {project.screenshots?.[0] && (
//                                     <Image src={project.screenshots[0]} alt={project.title} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" unoptimized />
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Footer */}
//                 <section className="h-[50vh] flex items-center justify-center bg-black text-white relative z-50">
//                     <div className="text-center">
//                         <h2 className="text-4xl md:text-6xl font-bold mb-8">Let's create something.</h2>
//                         <a href={`mailto:${user.email}`} className="text-2xl hover:underline underline-offset-8 decoration-2" style={{ textDecorationColor: accent }}>
//                             {user.email}
//                         </a>
//                     </div>
//                 </section>
//             </main>
//         </div>
//     );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ProfileConfig } from "@/server/actions/profile-config";
import { useRef, useState, useEffect } from "react";

interface ThemeProps {
    user: any;
    projects: any[];
    config: ProfileConfig;
}

export function ThemeCreative({ user, projects, config }: ThemeProps) {
    const [isDark, setIsDark] = useState(false);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const bg = isDark ? "#0a0a0a" : (config.customColors?.background || "#f4f4f0");
    const fg = isDark ? "#f4f4f0" : (config.customColors?.text || "#1a1a1a");
    const accent = config.customColors?.accent || "#ff4d00";

    return (
        <div
            ref={containerRef}
            className="transition-colors duration-700 ease-in-out selection:bg-[#ff4d00] selection:text-white"
            style={{ backgroundColor: bg, color: fg }}
        >
            {/* Minimal Navigation */}
            <header className="fixed top-0 left-0 w-full p-6 md:p-10 mix-blend-difference z-[100] text-white flex justify-between items-center uppercase text-[10px] tracking-[0.3em] font-sans">
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {user.name} — {user.headline || "Creative Focus"}
                </motion.span>
                <div className="flex items-center gap-8">
                    <button 
                        onClick={() => setIsDark(!isDark)}
                        className="hover:scale-110 transition-transform p-2 bg-white/10 rounded-full"
                    >
                        {isDark ? <Sun size={14} /> : <Moon size={14} />}
                    </button>
                    <span className="hidden md:block italic lowercase opacity-70">Available for projects</span>
                </div>
            </header>

            <main className="relative">
                {/* Hero Section */}
                <section className="h-[110vh] flex flex-col justify-center px-6 md:px-20 relative">
                    <div className="relative z-10 space-y-4">
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h1 className="text-[clamp(3rem,15vw,18rem)] leading-[0.8] font-black uppercase tracking-tighter italic">
                                {user.name.split(" ")[0]}<br />
                                <span style={{ WebkitTextStroke: `2px ${fg}`, color: 'transparent' }}>
                                    {user.name.split(" ")[1] || "Dev"}
                                </span>
                            </h1>
                        </motion.div>
                        
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ delay: 0.5 }}
                            className="text-xs md:text-sm font-sans uppercase tracking-[0.5em] ml-2"
                        >
                            Digital Portfolio / {new Date().getFullYear()}
                        </motion.p>
                    </div>

                    <motion.div 
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
                        className="absolute bottom-20 left-6 md:left-20 max-w-sm"
                    >
                        <p className="text-xl md:text-2xl font-serif leading-tight">
                            {user.bio}
                        </p>
                        <ArrowDownRight className="w-12 h-12 mt-6 animate-bounce" style={{ color: accent }} />
                    </motion.div>
                </section>

                {/* Projects Section */}
                <section className="relative z-20">
                    {projects.map((project, i) => (
                        <ProjectCard 
                            key={project._id} 
                            project={project} 
                            index={i} 
                            accent={accent} 
                            fg={fg}
                            bg={i % 2 === 0 ? bg : (isDark ? "#111" : "#fff")}
                        />
                    ))}
                </section>

                {/* Epic Footer */}
                <footer className="relative h-screen flex flex-col justify-center items-center bg-black text-white z-50 overflow-hidden">
                    <motion.div 
                        whileInView={{ y: [50, 0], opacity: [0, 1] }}
                        className="text-center space-y-12 px-6"
                    >
                        <h2 className="text-6xl md:text-[10vw] font-black uppercase tracking-tighter leading-none">
                            Let's <br /> <span style={{ color: accent }}>Talk.</span>
                        </h2>
                        <div className="space-y-4">
                            <a 
                                href={`mailto:${user.email}`} 
                                className="text-2xl md:text-4xl font-serif hover:italic transition-all inline-block border-b border-white/20 pb-2"
                            >
                                {user.email}
                            </a>
                            <div className="flex justify-center gap-8 pt-8 font-sans text-xs uppercase tracking-widest opacity-40">
                                {user.socials?.linkedin && <a href={user.socials.linkedin} className="hover:opacity-100">LinkedIn</a>}
                                {user.socials?.github && <a href={user.socials.github} className="hover:opacity-100">GitHub</a>}
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Decorative Background Text */}
                    <div className="absolute bottom-10 whitespace-nowrap opacity-[0.03] text-[20vw] font-black pointer-events-none uppercase">
                        {user.name} {user.name}
                    </div>
                </footer>
            </main>
        </div>
    );
}

function ProjectCard({ project, index, accent, fg, bg }: any) {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "start start"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <div ref={cardRef} className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
            <motion.div 
                style={{ scale, backgroundColor: bg }}
                className="w-full h-full flex flex-col md:flex-row border-t border-black/10 shadow-[0_-50px_100px_rgba(0,0,0,0.1)]"
            >
                <div className="flex-1 p-8 md:p-20 flex flex-col justify-between relative">
                    <span className="text-[15vw] font-black opacity-5 absolute -top-10 -left-4 pointer-events-none">
                        0{index + 1}
                    </span>
                    
                    <div className="relative z-10 pt-12 md:pt-0">
                        <h2 className="text-5xl md:text-8xl font-bold mb-8 uppercase tracking-tighter leading-[0.9]">
                            {project.title}
                        </h2>
                        <div className="flex flex-wrap gap-3 mb-10">
                            {project.technologies?.map((t: string) => (
                                <span key={t} className="px-3 py-1 border border-current opacity-40 rounded-full text-[10px] uppercase font-sans tracking-widest">
                                    {t}
                                </span>
                            ))}
                        </div>
                        <p className="font-serif text-lg md:text-2xl opacity-80 max-w-md leading-snug">
                            {project.scope}
                        </p>
                    </div>

                    <div className="flex gap-6 mt-12 relative z-10">
                        {project.liveUrl && (
                            <Link 
                                href={project.liveUrl} 
                                className="group flex items-center gap-4 font-sans text-xs uppercase tracking-[0.3em] font-bold"
                            >
                                <span className="w-12 h-12 rounded-full border border-current flex items-center justify-center group-hover:bg-current group-hover:text-white transition-all">
                                    <ArrowUpRight size={20} />
                                </span>
                                View Project
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex-1 relative h-[40vh] md:h-auto overflow-hidden bg-neutral-100">
                    <motion.div style={{ y: imageY, height: "120%", top: "-10%" }} className="relative w-full">
                        {project.screenshots?.[0] && (
                            <Image 
                                src={project.screenshots[0]} 
                                alt={project.title} 
                                fill 
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out scale-105 hover:scale-100" 
                                unoptimized 
                            />
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}