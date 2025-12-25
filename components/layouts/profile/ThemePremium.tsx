// "use client";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import Link from "next/link";
// import Image from "next/image";
// import { Github, Linkedin, Globe, Mail, ArrowUpRight, Code2, Layers, Zap } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { ProfileConfig } from "@/server/actions/profile-config";
// import { useRef } from "react";

// interface ThemeProps {
//     user: any;
//     projects: any[];
//     config: ProfileConfig;
// }

// export function ThemePremium({ user, projects, config }: ThemeProps) {
//     const { customColors, font, animationIntensity } = config;

//     // Default to a rich dark theme if custom colors are generic white/black
//     const isDefaultBg = !customColors?.background || customColors.background === "#ffffff";
//     const bg = isDefaultBg ? "#000000" : customColors.background;
//     const fg = customColors?.text || "#ffffff";
//     const accent = customColors?.accent || "#8b5cf6"; // violet-500

//     const fontClass = font === "playfair" ? "font-serif" : font === "roboto_mono" ? "font-mono" : "font-sans";

//     // Animation variants
//     const fadeInUp: any = {
//         hidden: { opacity: 0, y: 40 },
//         visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
//     };

//     const staggerContainer = {
//         hidden: { opacity: 0 },
//         visible: {
//             opacity: 1,
//             transition: {
//                 staggerChildren: 0.1
//             }
//         }
//     };

//     return (
//         <div
//             className={cn(`min-h-screen ${fontClass} selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden`)}
//             style={{ backgroundColor: bg, color: fg }}
//         >
//             {/* Ambient Background Glow */}
//             <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
//                 <div
//                     className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 animate-pulse"
//                     style={{ backgroundColor: accent }}
//                 />
//                 <div
//                     className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-15 animate-pulse"
//                     style={{ backgroundColor: "#3b82f6", animationDelay: "2s" }}
//                 />
//             </div>

//             {/* Navbar */}
//             <nav className="fixed top-0 w-full z-50 px-6 py-4 backdrop-blur-md border-b border-white/5 bg-black/5">
//                 <div className="max-w-6xl mx-auto flex justify-between items-center">
//                     <span className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
//                         {user.name.split(" ")[0]}<span style={{ color: accent }}>.</span>
//                     </span>
//                     <div className="flex gap-4">
//                         <a href={`mailto:${user.email}`} className="text-sm font-medium hover:text-white/80 transition-colors">
//                             Contact
//                         </a>
//                     </div>
//                 </div>
//             </nav>

//             <main className="relative z-10">
//                 {/* Hero Section */}
//                 <section className="min-h-screen flex items-center justify-center px-6 pt-20">
//                     <div className="max-w-4xl mx-auto text-center space-y-8">
//                         <motion.div
//                             initial="hidden"
//                             animate="visible"
//                             variants={staggerContainer}
//                             className="space-y-6"
//                         >
//                             {user.image && (
//                                 <motion.div variants={fadeInUp} className="mx-auto w-32 h-32 md:w-40 md:h-40 relative group">
//                                     <div className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" style={{ backgroundColor: accent }}></div>
//                                     <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10">
//                                         <Image src={user.image} alt={user.name} fill className="object-cover" priority />
//                                     </div>
//                                 </motion.div>
//                             )}

//                             <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
//                                 <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
//                                     Building the
//                                 </span>
//                                 <span style={{ color: accent }} className="block">
//                                     Digital Future
//                                 </span>
//                             </motion.h1>

//                             <motion.p variants={fadeInUp} className="text-lg md:text-xl md:max-w-2xl mx-auto leading-relaxed text-white/60">
//                                 {user.bio || "Creative Developer & UI/UX Designer crafting beautiful digital experiences that leave a lasting impression."}
//                             </motion.p>

//                             <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 pt-4">
//                                 <Button
//                                     size="lg"
//                                     style={{ backgroundColor: accent, color: '#fff' }}
//                                     className="rounded-full px-8 h-12 text-base shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.6)] transition-all"
//                                 >
//                                     Get in touch
//                                 </Button>
//                                 <Button
//                                     variant="outline"
//                                     size="lg"
//                                     className="rounded-full px-8 h-12 text-base border-white/20 hover:bg-white/5 hover:text-white"
//                                 >
//                                     View Projects
//                                 </Button>
//                             </motion.div>
//                         </motion.div>

//                         {/* Scrolling Marquee / Tech Stack */}
//                         {user.skills?.length > 0 && (
//                             <motion.div
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 transition={{ delay: 0.8, duration: 1 }}
//                                 className="pt-20 w-full overflow-hidden"
//                             >
//                                 <p className="text-sm uppercase tracking-widest text-white/30 mb-6 font-semibold">Technologies</p>
//                                 <div className="flex flex-wrap justify-center gap-3">
//                                     {user.skills.map((skill: string, i: number) => (
//                                         <div
//                                             key={skill}
//                                             className="px-4 py-2 rounded-full border border-white/5 bg-white/5 text-sm font-medium hover:border-white/20 transition-colors backdrop-blur-sm"
//                                         >
//                                             {skill}
//                                         </div>
//                                     ))}
//                                 </div>
//                             </motion.div>
//                         )}
//                     </div>
//                 </section>

//                 {/* Projects Section */}
//                 <section className="py-32 px-6">
//                     <div className="max-w-6xl mx-auto space-y-20">
//                         <div className="flex justify-between items-end border-b border-white/10 pb-6">
//                             <h2 className="text-3xl md:text-5xl font-bold">Selected Works</h2>
//                             <span className="text-white/40 hidden md:block">2023 — Present</span>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                             {projects.map((project: any, index: number) => (
//                                 <ProjectCard
//                                     key={project._id}
//                                     project={project}
//                                     index={index}
//                                     accent={accent}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 </section>

//                 {/* Footer */}
//                 <footer className="py-20 border-t border-white/10 bg-black/20 backdrop-blur-lg">
//                     <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
//                         <div>
//                             <h3 className="text-2xl font-bold mb-2">Let's work together</h3>
//                             <a href={`mailto:${user.email}`} className="text-white/60 hover:text-white transition-colors">
//                                 {user.email}
//                             </a>
//                         </div>
//                         <div className="flex gap-6">
//                             {user.socials?.github && (
//                                 <Link href={user.socials.github} className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:scale-110 transition-all border border-white/5">
//                                     <Github className="w-5 h-5" />
//                                 </Link>
//                             )}
//                             {user.socials?.linkedin && (
//                                 <Link href={user.socials.linkedin} className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:scale-110 transition-all border border-white/5">
//                                     <Linkedin className="w-5 h-5" />
//                                 </Link>
//                             )}
//                             {user.socials?.website && (
//                                 <Link href={user.socials.website} className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:scale-110 transition-all border border-white/5">
//                                     <Globe className="w-5 h-5" />
//                                 </Link>
//                             )}
//                         </div>
//                     </div>
//                 </footer>
//             </main>
//         </div>
//     );
// }

// function ProjectCard({ project, index, accent }: { project: any, index: number, accent: string }) {
//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, margin: "-100px" }}
//             transition={{ duration: 0.6, delay: index * 0.1 }}
//             className="group relative cursor-pointer"
//         >
//             <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-zinc-900 border border-white/10">
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

//                 {project.screenshots?.[0] ? (
//                     <Image
//                         src={project.screenshots[0]}
//                         alt={project.title}
//                         fill
//                         className="object-cover transition-transform duration-700 group-hover:scale-105"
//                         unoptimized
//                     />
//                 ) : (
//                     <div className="absolute inset-0 flex items-center justify-center">
//                         <Layers className="w-12 h-12 text-white/10" />
//                     </div>
//                 )}

//                 <div className="absolute bottom-6 left-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
//                     <div className="flex gap-3">
//                         {project.liveUrl && (
//                             <Link href={project.liveUrl} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/90">
//                                 Live Demo <ArrowUpRight className="w-4 h-4" />
//                             </Link>
//                         )}
//                         {project.repoUrl && (
//                             <Link href={project.repoUrl} className="flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20 hover:bg-black/70">
//                                 <Github className="w-4 h-4" /> Code
//                             </Link>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             <h3 className="text-2xl font-bold mb-2 group-hover:text-violet-400 transition-colors" style={{ color: accent }}>{project.title}</h3>
//             <p className="text-white/60 line-clamp-2 mb-4">{project.scope}</p>
//             <div className="flex gap-2 flex-wrap">
//                 {project.technologies?.slice(0, 4).map((tech: string) => (
//                     <Badge key={tech} variant="outline" className="border-white/10 bg-white/5 text-white/70">
//                         {tech}
//                     </Badge>
//                 ))}
//             </div>
//         </motion.div>
//     );
// }


"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Globe, Mail, ArrowUpRight, Code2, Layers, Zap, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ProfileConfig } from "@/server/actions/profile-config";

interface ThemeProps {
    user: any;
    projects: any[];
    config: ProfileConfig;
}

export function ThemePremium({ user, projects, config }: ThemeProps) {
    const { customColors, font } = config;
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync Mouse Position for the "Spotlight" effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const bg = customColors?.background || "#050505";
    const fg = customColors?.text || "#ffffff";
    const accent = customColors?.accent || "#8b5cf6";

    const fontClass = font === "playfair" ? "font-serif" : font === "roboto_mono" ? "font-mono" : "font-sans";

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div
            ref={containerRef}
            className={cn(`min-h-screen ${fontClass} selection:bg-violet-500/30 overflow-x-hidden relative`)}
            style={{ backgroundColor: bg, color: fg }}
        >
            {/* Dynamic Spotlight Layer */}
            <div 
                className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000"
                style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${accent}15, transparent 80%)`
                }}
            />

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div
                    className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-10"
                    style={{ backgroundColor: accent }}
                />
                <div
                    className="absolute bottom-[5%] right-[-5%] w-[30vw] h-[30vw] rounded-full blur-[100px] opacity-10"
                    style={{ backgroundColor: "#3b82f6" }}
                />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-[100] px-8 py-6 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: accent, color: '#fff' }}>
                            {user.name.charAt(0)}
                        </div>
                        <span className="font-bold tracking-tight uppercase text-xs tracking-[0.3em]">
                            {user.name}
                        </span>
                    </motion.div>
                    <div className="flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">
                        <Link href="#work" className="hover:opacity-100 transition-opacity">Work</Link>
                        <Link href={`mailto:${user.email}`} className="hover:opacity-100 transition-opacity">Contact</Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="h-screen flex flex-col items-center justify-center px-6 relative">
                    <motion.div 
                        style={{ y: y1, opacity: opacityHero }}
                        className="max-w-5xl mx-auto text-center z-10"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h1 className="text-[clamp(3rem,10vw,8rem)] font-black tracking-tighter leading-[0.85] mb-8">
                                <span className="block opacity-20">CRAFTING</span>
                                <span className="block">DIGITAL</span>
                                <span style={{ color: accent }} className="block italic underline decoration-1 underline-offset-8">POETRY</span>
                            </h1>
                        </motion.div>

                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 0.6 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed mb-10"
                        >
                            {user.bio}
                        </motion.p>

                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex gap-4 justify-center"
                        >
                            <Button
                                size="lg"
                                style={{ backgroundColor: accent }}
                                className="rounded-none px-10 h-14 text-xs uppercase tracking-widest font-bold shadow-2xl hover:brightness-110 transition-all"
                            >
                                Let's Talk
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20">
                        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                        <div className="w-px h-12 bg-current" />
                    </div>
                </section>

                {/* Projects Section */}
                <section id="work" className="py-40 px-6">
                    <div className="max-w-7xl mx-auto">
                        <header className="mb-24 flex items-end justify-between">
                            <div className="space-y-2">
                                <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold">Case Studies</p>
                                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Selected Work</h2>
                            </div>
                            <div className="h-px flex-1 bg-white/10 mx-10 hidden md:block" />
                            <span className="text-xs font-mono opacity-30">[{projects.length}] Total Units</span>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32">
                            {projects.map((project: any, index: number) => (
                                <ProjectItem
                                    key={project._id}
                                    project={project}
                                    index={index}
                                    accent={accent}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Big Footer Call to Action */}
                <section className="py-40 border-t border-white/5 bg-zinc-950/50">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h2 className="text-[12vw] font-black tracking-tighter opacity-10 absolute left-0 w-full pointer-events-none overflow-hidden whitespace-nowrap">
                            HAVE A PROJECT? HAVE A PROJECT? HAVE A PROJECT?
                        </h2>
                        <div className="relative z-10 py-20">
                            <h3 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">Ready to start?</h3>
                            <a 
                                href={`mailto:${user.email}`}
                                className="text-2xl md:text-4xl font-light hover:text-indigo-400 transition-colors border-b-2 border-current pb-2"
                                style={{ borderColor: accent }}
                            >
                                {user.email}
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function ProjectItem({ project, index, accent }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className="group flex flex-col"
        >
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900 mb-8 border border-white/5">
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full"
                >
                    {project.screenshots?.[0] ? (
                        <Image
                            src={project.screenshots[0]}
                            alt={project.title}
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-800">
                            <Layers size={64} />
                        </div>
                    )}
                </motion.div>
                
                {/* Floating Meta */}
                <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Link href={project.liveUrl || "#"} className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
                        <ArrowUpRight size={18} />
                    </Link>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono opacity-30">0{index + 1}</span>
                    <h3 className="text-3xl font-bold tracking-tight">{project.title}</h3>
                </div>
                <p className="text-zinc-500 font-light leading-relaxed max-w-md">
                    {project.scope}
                </p>
                <div className="flex gap-2 flex-wrap pt-2">
                    {project.technologies?.slice(0, 3).map((tech: string) => (
                        <span key={tech} className="text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1 bg-white/5 border border-white/10">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}