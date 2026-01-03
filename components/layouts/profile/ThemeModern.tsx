// "use client";

// import { Badge } from "@/components/ui/badge";
// import Link from "next/link";
// import Image from "next/image";
// import { Github, Linkedin, Globe, Mail, ArrowUpRight, CheckCircle2, Command } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { motion } from "framer-motion";
// import { ProfileConfig } from "@/server/actions/profile-config";

// interface ThemeProps {
//     user: any;
//     projects: any[];
//     config: ProfileConfig;
// }

// export function ThemeModern({ user, projects, config }: ThemeProps) {
//     const { customColors } = config;

//     const bg = customColors?.background || "#000000";
//     const fg = customColors?.text || "#ffffff";
//     const accent = customColors?.accent || "#5e6ad2";

//     const fadeInUp = {
//         hidden: { opacity: 0, y: 20 },
//         visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
//     };

//     return (
//         <div
//             className="min-h-screen font-sans selection:bg-white/20"
//             style={{ backgroundColor: bg, color: fg }}
//         >
//             <div className="max-w-[1200px] mx-auto p-6 md:p-12">

//                 {/* Header */}
//                 <header className="flex justify-between items-start mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
//                     <div className="flex items-center gap-4">
//                         {user.image && (
//                             <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 relative">
//                                 <Image src={user.image} alt={user.name} fill className="object-cover" />
//                             </div>
//                         )}
//                         <div>
//                             <h1 className="text-lg font-medium leading-tight">{user.name}</h1>
//                             <p className="text-sm opacity-50">{user.headline || "Product Engineer"}</p>
//                         </div>
//                     </div>
//                     <div className="flex gap-4">
//                         {user.socials?.github && <Link href={user.socials.github} className="opacity-50 hover:opacity-100 transition-opacity"><Github className="w-5 h-5" /></Link>}
//                         {user.socials?.linkedin && <Link href={user.socials.linkedin} className="opacity-50 hover:opacity-100 transition-opacity"><Linkedin className="w-5 h-5" /></Link>}
//                         <Link href={`mailto:${user.email}`} className="opacity-50 hover:opacity-100 transition-opacity"><Mail className="w-5 h-5" /></Link>
//                     </div>
//                 </header>

//                 <motion.main
//                     initial="hidden"
//                     animate="visible"
//                     variants={{
//                         visible: { transition: { staggerChildren: 0.1 } }
//                     }}
//                 >
//                     {/* Hero Statement */}
//                     <motion.section variants={fadeInUp} className="mb-24">
//                         <h2 className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.1] max-w-3xl">
//                             <span className="opacity-50">Building default-to-open </span>
//                             <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
//                                 software for the future of work.
//                             </span>
//                         </h2>
//                         <p className="mt-8 text-xl opacity-60 max-w-2xl leading-relaxed">
//                             {user.bio}
//                         </p>
//                     </motion.section>

//                     {/* Bento Grid Projects */}
//                     <motion.section variants={fadeInUp} className="mb-24">
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {/* Featured / Large Card */}
//                             {projects[0] && (
//                                 <div className="lg:col-span-2 row-span-2 group relative rounded-3xl bg-zinc-900/50 border border-white/5 overflow-hidden hover:border-white/10 transition-colors aspect-square md:aspect-auto">
//                                     <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 to-black/50 z-10" />
//                                     {projects[0].screenshots?.[0] && (
//                                         <Image src={projects[0].screenshots[0]} alt={projects[0].title} fill className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80" unoptimized />
//                                     )}
//                                     <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
//                                         <div className="flex justify-between items-end">
//                                             <div>
//                                                 <h3 className="text-2xl font-medium mb-2">{projects[0].title}</h3>
//                                                 <p className="opacity-70 line-clamp-2 max-w-md">{projects[0].scope}</p>
//                                             </div>
//                                             <Link href={projects[0].liveUrl || '#'} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
//                                                 <ArrowUpRight className="w-5 h-5" />
//                                             </Link>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Small Cards */}
//                             {projects.slice(1).map((project: any) => (
//                                 <div key={project._id} className="group relative rounded-3xl bg-zinc-900/30 border border-white/5 overflow-hidden hover:bg-zinc-900/50 transition-colors min-h-[300px] flex flex-col p-6">
//                                     <div className="flex-1 mb-4 relative rounded-xl overflow-hidden bg-black/20">
//                                         {project.screenshots?.[0] && (
//                                             <Image src={project.screenshots[0]} alt={project.title} fill className="object-cover" unoptimized />
//                                         )}
//                                     </div>
//                                     <div className="flex justify-between items-center">
//                                         <h3 className="font-medium">{project.title}</h3>
//                                         {project.liveUrl && <Link href={project.liveUrl} className="opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity"><ArrowUpRight className="w-4 h-4" /></Link>}
//                                     </div>
//                                     <p className="text-sm opacity-50 mt-1 line-clamp-1">{project.scope}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </motion.section>

//                     {/* Stack / About */}
//                     <motion.section variants={fadeInUp} className="grid md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
//                         <div>
//                             <h3 className="text-sm font-medium uppercase tracking-widest opacity-40 mb-6">Stack</h3>
//                             <div className="flex flex-wrap gap-2">
//                                 {user.skills?.map((skill: string) => (
//                                     <Badge key={skill} variant="secondary" className="bg-white/5 hover:bg-white/10 text-white/80 font-normal border-white/5">
//                                         {skill}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         </div>
//                         <div>
//                             <h3 className="text-sm font-medium uppercase tracking-widest opacity-40 mb-6">Experience</h3>
//                             <div className="space-y-6">
//                                 {/* Mock experience if none exists or map real data */}
//                                 <div className="flex gap-4">
//                                     <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
//                                     <div>
//                                         <div className="font-medium">Freelance Full Stack Dev</div>
//                                         <div className="text-sm opacity-50">2023 — Present</div>
//                                         <p className="text-sm opacity-70 mt-2">Helping startups build scalable products.</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </motion.section>

//                 </motion.main>

//                 <footer className="mt-24 py-8 border-t border-white/10 flex justify-between text-sm opacity-40">
//                     <div>© {new Date().getFullYear()} {user.name}</div>
//                     <div className="flex gap-4">
//                         <span>Twitter</span>
//                         <span>GitHub</span>
//                     </div>
//                 </footer>
//             </div>
//         </div>
//     );
// }

"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { 
    Github, 
    Linkedin, 
    Mail, 
    ArrowUpRight, 
    Sun, 
    Moon, 
    Zap, 
    Plus,
    Component
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileConfig } from "@/server/actions/profile-config";

interface ThemeProps {
    user: any;
    projects: any[];
    config: ProfileConfig;
}

export function ThemeModern({ user, projects, config }: ThemeProps) {
    const [mounted, setMounted] = useState(false);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => setMounted(true), []);

    const bg = isDark ? "#080808" : "#fbfbfb";
    const fg = isDark ? "#ffffff" : "#09090b";
    const accent = config.customColors?.accent || "#5e6ad2";

    if (!mounted) return null;

    return (
        <div
            className={cn(
                "min-h-screen font-sans transition-colors duration-500 ease-in-out selection:bg-indigo-500/30",
                isDark ? "dark" : ""
            )}
            style={{ backgroundColor: bg, color: fg }}
        >
            {/* Ambient Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div 
                    className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-[0.08] blur-[120px]"
                    style={{ backgroundColor: accent }}
                />
            </div>

            <div className="max-w-[1100px] mx-auto p-6 md:p-12 relative z-10">
                {/* Refined Header */}
                <header className="flex justify-between items-center mb-32 py-4 sticky top-0 backdrop-blur-md z-50 border-b border-transparent">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-500 dark:from-zinc-700 dark:to-zinc-900 flex items-center justify-center text-black dark:text-white font-bold text-sm overflow-hidden border border-white/10 shadow-lg">
                            {user.image ? <Image src={user.image} alt={user.name} width={36} height={36} className="object-cover" /> : user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold tracking-tight">{user.name}</span>
                            <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Available for hire</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-zinc-500/5 p-1 rounded-full border border-white/5 backdrop-blur-xl">
                        <button 
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-full hover:bg-zinc-500/10 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun size={16} className="text-zinc-400" /> : <Moon size={16} className="text-zinc-600" />}
                        </button>
                        <Link 
                            href={`mailto:${user.email}`} 
                            className="bg-white dark:bg-zinc-100 text-black px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95"
                        >
                            Hire Me
                        </Link>
                    </div>
                </header>

                <motion.main
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {/* Hero Section */}
                    <motion.section 
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
                        className="mb-32 space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-500/10 border border-zinc-500/20 text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
                            <Zap size={12} className="text-yellow-500" /> {user.headline || "Full Stack Engineer"}
                        </div>
                        <h2 className="text-5xl md:text-8xl font-bold tracking-tight leading-[0.95] max-w-4xl italic">
                            Building <span className="text-zinc-500 not-italic font-light">interfaces</span> <br /> 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500 dark:from-white dark:to-zinc-500">that scale.</span>
                        </h2>
                        <p className="text-lg md:text-xl opacity-50 max-w-xl leading-relaxed font-light">
                            {user.bio}
                        </p>
                    </motion.section>

                    {/* Bento Grid */}
                    <motion.section variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="mb-40">
                        <div className="grid grid-cols-12 gap-4 auto-rows-[300px]">
                            {projects.map((project, i) => {
                                const isHero = i === 0;
                                return (
                                    <motion.div
                                        key={project._id}
                                        whileHover={{ y: -4 }}
                                        className={cn(
                                            "relative rounded-[2rem] overflow-hidden border transition-all duration-500 group",
                                            isDark ? "bg-zinc-900/40 border-white/5 hover:border-white/20 shadow-2xl" : "bg-zinc-100 border-black/5 hover:border-black/20",
                                            isHero ? "col-span-12 md:col-span-8 row-span-2" : "col-span-12 md:col-span-4"
                                        )}
                                    >
                                        <div className="absolute inset-0 p-8 flex flex-col justify-between z-20">
                                            <div className="flex justify-between items-start">
                                                <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 text-white">
                                                    <Component size={20} />
                                                </div>
                                                {project.liveUrl && (
                                                    <Link 
                                                        href={project.liveUrl} 
                                                        className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all p-3 bg-white text-black rounded-full"
                                                    >
                                                        <ArrowUpRight size={20} />
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-bold tracking-tight text-white">{project.title}</h3>
                                                <p className="text-sm opacity-60 line-clamp-2 max-w-xs text-zinc-300">{project.scope}</p>
                                            </div>
                                        </div>

                                        {/* Image Overlay */}
                                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                        {project.screenshots?.[0] && (
                                            <Image 
                                                src={project.screenshots[0]} 
                                                alt={project.title} 
                                                fill 
                                                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" 
                                                unoptimized 
                                            />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.section>

                    {/* Technical Stack Section */}
                    <motion.section 
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        className="grid md:grid-cols-2 gap-20 pt-20 border-t border-zinc-500/10"
                    >
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] opacity-30 mb-8 flex items-center gap-2">
                                <Plus size={14} /> Core Stack
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {user.skills?.map((skill: string) => (
                                    <div 
                                        key={skill} 
                                        className="px-5 py-2.5 rounded-2xl bg-zinc-500/5 border border-zinc-500/10 hover:border-zinc-500/30 transition-all cursor-default text-sm font-medium opacity-70 hover:opacity-100"
                                    >
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-8">
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] opacity-30 mb-8 flex items-center gap-2">
                                <Plus size={14} /> Philosophy
                            </h3>
                            <p className="text-2xl font-light leading-snug opacity-80">
                                Engineering is more than just code; it's about solving human problems through <span className="text-zinc-500 italic">minimalist design</span> and <span className="underline underline-offset-8 decoration-zinc-500/30">robust systems</span>.
                            </p>
                        </div>
                    </motion.section>

                    {/* Experience Section */}
                    {(
                        (config.showExperience && user.experience?.length > 0) ||
                        (config.showEducation && user.education?.length > 0) ||
                        (config.showCertifications && user.certifications?.length > 0)
                    ) && (
                        <motion.section 
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                            className="pt-20 border-t border-zinc-500/10"
                        >
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] opacity-30 mb-12 flex items-center gap-2">
                                <Plus size={14} /> Professional
                            </h3>
                            
                            <div className="grid md:grid-cols-3 gap-12">
                                {/* Experience */}
                                {config.showExperience && user.experience?.length > 0 && (
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-semibold opacity-70 uppercase tracking-wider">Experience</h4>
                                        <div className="space-y-6">
                                            {user.experience.map((exp: any, i: number) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500/60 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <h5 className="font-medium text-sm">{exp.title}</h5>
                                                            <p className="text-xs opacity-50 mt-0.5">{exp.company}</p>
                                                            <p className="text-xs opacity-40 mt-1">
                                                                {exp.startDate ? new Date(exp.startDate).getFullYear() : ''}{" "}
                                                                {exp.current ? "— Present" : exp.endDate ? `— ${new Date(exp.endDate).getFullYear()}` : ""}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {config.showEducation && user.education?.length > 0 && (
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-semibold opacity-70 uppercase tracking-wider">Education</h4>
                                        <div className="space-y-6">
                                            {user.education.map((edu: any, i: number) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500/60 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <h5 className="font-medium text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</h5>
                                                            <p className="text-xs opacity-50 mt-0.5">{edu.school}</p>
                                                            <p className="text-xs opacity-40 mt-1">{edu.graduationYear}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Certifications */}
                                {config.showCertifications && user.certifications?.length > 0 && (
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-semibold opacity-70 uppercase tracking-wider">Certifications</h4>
                                        <div className="space-y-6">
                                            {user.certifications.map((cert: any, i: number) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-amber-500/60 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <h5 className="font-medium text-sm">{cert.name}</h5>
                                                            <p className="text-xs opacity-50 mt-0.5">{cert.issuer}</p>
                                                            {cert.credentialUrl && (
                                                                <a href={cert.credentialUrl} className="text-xs opacity-40 hover:opacity-100 transition-opacity mt-1 inline-block">View Credential →</a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.section>
                    )}

                    {/* Services & Rates Section */}
                    {((config.showServices && user.services?.length > 0) || (config.showHourlyRate && user.hourlyRate)) && (
                        <motion.section 
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                            className="pt-20 border-t border-zinc-500/10 grid md:grid-cols-2 gap-20"
                        >
                            {config.showHourlyRate && user.hourlyRate && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] opacity-30 mb-6 flex items-center gap-2">
                                        <Plus size={14} /> Rates
                                    </h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold">${user.hourlyRate}</span>
                                        <span className="text-sm opacity-50">/hour</span>
                                    </div>
                                    <p className="text-xs opacity-40 mt-4">Status: {user.availability?.status || 'available'}</p>
                                </div>
                            )}

                            {config.showServices && user.services?.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] opacity-30 mb-8 flex items-center gap-2">
                                        <Plus size={14} /> Services
                                    </h3>
                                    <div className="space-y-4">
                                        {user.services.map((service: any, i: number) => (
                                            <div key={i} className="border border-zinc-500/10 rounded-xl p-4 hover:border-zinc-500/30 transition-all">
                                                <h4 className="font-medium text-sm">{service.name}</h4>
                                                <p className="text-xs opacity-50 mt-1">{service.description}</p>
                                                {service.price && (
                                                    <p className="text-xs font-semibold mt-2 opacity-70">${service.price}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.section>
                    )}

                </motion.main>

                <footer className="mt-40 pb-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-zinc-500/10 pt-12">
                    <div className="text-[10px] uppercase tracking-[0.4em] opacity-30 font-bold italic">
                        &copy; {new Date().getFullYear()} {user.name} — Crafted with Precision
                    </div>
                    <div className="flex gap-12 text-[10px] uppercase tracking-[0.2em] font-bold opacity-30">
                        <Link href={user.socials?.github || "#"} className="hover:opacity-100 transition-opacity">GitHub</Link>
                        <Link href={user.socials?.linkedin || "#"} className="hover:opacity-100 transition-opacity">LinkedIn</Link>
                        <Link href="/" className="hover:opacity-100 transition-opacity">Top</Link>
                    </div>
                </footer>
            </div>
        </div>
    );
}