// "use client";

// import Link from "next/link";
// import { Terminal, Github, Linkedin, Cpu, Code2 } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { ProfileConfig } from "@/server/actions/profile-config";

// interface ThemeProps {
//     user: any;
//     projects: any[];
//     config: ProfileConfig;
// }

// export function ThemeDev({ user, projects, config }: ThemeProps) {
//     const { customColors } = config;

//     const bg = "#0d1117"; // GitHub dark / Terminal bg
//     const fg = "#c9d1d9";
//     const accent = customColors?.accent || "#3fb950"; // Terminal green

//     return (
//         <div
//             className="min-h-screen font-mono p-4 md:p-10 selection:bg-green-900 selection:text-green-100"
//             style={{ backgroundColor: bg, color: fg }}
//         >
//             <div className="max-w-4xl mx-auto border border-white/10 rounded-lg bg-[#010409] shadow-2xl min-h-[90vh] flex flex-col">
//                 {/* Terminal Bar */}
//                 <div className="h-10 border-b border-white/10 bg-[#161b22] flex items-center px-4 gap-2 rounded-t-lg">
//                     <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
//                     <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
//                     <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
//                     <div className="ml-4 text-xs opacity-50 flex gap-2">
//                         <Terminal className="w-3 h-3" />
//                         ~/{user.username || "profile"}
//                     </div>
//                 </div>

//                 <div className="p-8 md:p-12 space-y-12 flex-1">
//                     {/* Header */}
//                     <div className="space-y-4">
//                         <div className="flex items-center gap-2 text-sm opacity-50">
//                             <span style={{ color: accent }}>➜</span>
//                             <span>whoami</span>
//                         </div>
//                         <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
//                             {user.name}
//                         </h1>
//                         <p className="text-xl max-w-2xl leading-relaxed" style={{ color: imagePalette(accent) }}>
//                             {">"} {user.bio} <span className="animate-pulse">_</span>
//                         </p>
//                     </div>

//                     {/* Socials */}
//                     <div className="space-y-2">
//                         <div className="flex items-center gap-2 text-sm opacity-50">
//                             <span style={{ color: accent }}>➜</span>
//                             <span>ls ./socials</span>
//                         </div>
//                         <div className="flex gap-6 text-sm">
//                             {user.socials?.github && <Link href={user.socials.github} className="hover:text-white transition-colors hover:underline decoration-1 underline-offset-4">github.sh</Link>}
//                             {user.socials?.linkedin && <Link href={user.socials.linkedin} className="hover:text-white transition-colors hover:underline decoration-1 underline-offset-4">linkedin.sh</Link>}
//                             <Link href={`mailto:${user.email}`} className="hover:text-white transition-colors hover:underline decoration-1 underline-offset-4">email.sh</Link>
//                         </div>
//                     </div>

//                     {/* Skills */}
//                     <div className="space-y-4">
//                         <div className="flex items-center gap-2 text-sm opacity-50">
//                             <span style={{ color: accent }}>➜</span>
//                             <span>cat ./skills.json</span>
//                         </div>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                             {user.skills?.map((skill: string) => (
//                                 <div key={skill} className="bg-white/5 border border-white/10 p-2 text-xs rounded hover:border-white/20 transition-colors">
//                                     "{skill}"
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Projects */}
//                     <div className="space-y-6">
//                         <div className="flex items-center gap-2 text-sm opacity-50">
//                             <span style={{ color: accent }}>➜</span>
//                             <span>./projects --list --verbose</span>
//                         </div>
//                         <div className="space-y-8">
//                             {projects.map((project) => (
//                                 <div key={project._id} className="group border-l-2 pl-6 space-y-2 transition-all hover:border-l-[4px]" style={{ borderColor: accent }}>
//                                     <div className="flex justify-between items-baseline">
//                                         <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
//                                             {project.title}
//                                         </h3>
//                                         {project.liveUrl && <Link href={project.liveUrl} className="text-xs border border-white/20 px-2 py-1 rounded hover:bg-white/10">[ EXECUTE ]</Link>}
//                                     </div>
//                                     <p className="opacity-70 text-sm max-w-xl">{project.scope}</p>
//                                     <div className="text-xs opacity-40 flex gap-2">
//                                         {project.technologies?.map((t: string) => <span key={t}>--{t}</span>)}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-[#161b22] px-6 py-2 text-xs opacity-40 border-t border-white/10 rounded-b-lg flex justify-between">
//                     <span>-- NORMAL --</span>
//                     <span>100% Top</span>
//                 </div>
//             </div>
//         </div>
//     );
// }

// function imagePalette(color: string) {
//     // simple helper, though CSS vars are better usually
//     return color;
// }
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Terminal, 
  Github, 
  Linkedin, 
  Mail, 
  FileCode, 
  FolderSearch, 
  Binary, 
  Sun, 
  Moon, 
  Zap, 
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { ProfileConfig } from "@/server/actions/profile-config";

interface ThemeProps {
    user: any;
    projects: any[];
    config: ProfileConfig;
}

export function ThemeDev({ user, projects, config }: ThemeProps) {
    const [mounted, setMounted] = useState(false);
    const [isMatrixMode, setIsMatrixMode] = useState(true);

    useEffect(() => setMounted(true), []);

    // Theme Variables based on toggle
    const accent = isMatrixMode ? "#3fb950" : "#bd93f9"; // Green vs Purple
    const bgMain = isMatrixMode ? "#0d1117" : "#1a1b26"; // GitHub Dark vs Tokyo Night
    const bgCanvas = isMatrixMode ? "#010409" : "#16161e";

    if (!mounted) return null;

    return (
        <div
            className="min-h-screen font-mono p-4 md:p-8 transition-colors duration-500 selection:bg-opacity-30"
            style={{ 
                backgroundColor: bgMain, 
                color: "#c9d1d9",
                // @ts-ignore
                "--accent-color": accent 
            }}
        >
            {/* Floating Theme Toggle */}
            <button 
                onClick={() => setIsMatrixMode(!isMatrixMode)}
                className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-neutral-900 border border-white/10 hover:border-white/40 transition-all shadow-2xl group"
                style={{ boxShadow: `0 0 20px ${accent}33` }}
            >
                {isMatrixMode ? (
                    <Zap size={20} className="text-green-400 group-hover:scale-110 transition-transform" />
                ) : (
                    <Sun size={20} className="text-purple-400 group-hover:rotate-45 transition-transform" />
                )}
            </button>

            <div className="max-w-6xl mx-auto border border-white/10 rounded-xl overflow-hidden bg-canvas shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row min-h-[85vh]">
                
                {/* Sidebar - IDE Explorer */}
                <aside className="w-full md:w-64 border-r border-white/10 bg-opacity-50 flex flex-col shrink-0" style={{ backgroundColor: bgMain }}>
                    <div className="p-4 border-b border-white/10 flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-inner" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-inner" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-inner" />
                    </div>
                    
                    <div className="p-4 flex-1 space-y-8 overflow-y-auto">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-4 font-bold">Explorer</p>
                            <div className="space-y-1 text-sm">
                                <SidebarItem icon={<FileCode size={14} className="text-blue-400" />} label="bio.tsx" active />
                                <SidebarItem icon={<FolderSearch size={14} className="text-yellow-500" />} label="projects/" />
                                <SidebarItem icon={<Binary size={14} className="text-purple-400" />} label="skills.json" />
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-4 font-bold">Connections</p>
                            <div className="flex flex-col gap-1">
                                {user.socials?.github && <SocialLink href={user.socials.github} icon={<Github size={14} />} label="GitHub" />}
                                {user.socials?.linkedin && <SocialLink href={user.socials.linkedin} icon={<Linkedin size={14} />} label="LinkedIn" />}
                                <SocialLink href={`mailto:${user.email}`} icon={<Mail size={14} />} label="Email" />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* Tab Bar */}
                    <div className="h-11 bg-[#161b22] bg-opacity-50 border-b border-white/10 flex items-center px-4">
                        <div className="bg-canvas px-4 h-full flex items-center gap-2 border-t-2 text-xs" style={{ borderColor: accent }}>
                            <FileCode size={14} style={{ color: accent }} />
                            <span className="text-white font-medium">portfolio.tsx</span>
                        </div>
                    </div>

                    {/* Editor View */}
                    <div className="p-6 md:p-12 overflow-y-auto custom-scrollbar">
                        
                        {/* 01: Hero Section */}
                        <section className="mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10" style={{ color: accent }}>
                                    public
                                </span>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8">
                                {user.name}<span style={{ color: accent }}>_</span>
                            </h1>
                            
                            <div className="p-6 bg-white/[0.02] border-l-2 rounded-r-lg group hover:bg-white/[0.04] transition-all" style={{ borderColor: accent }}>
                                <p className="text-xl md:text-2xl leading-relaxed text-gray-300 font-light italic">
                                    "{user.bio || "Building high-performance applications with clean, scalable code."}"
                                </p>
                            </div>
                        </section>

                        {/* 02: Skills / Tech Stack */}
                        <section className="mb-24">
                            <h2 className="text-xs font-bold tracking-[0.3em] opacity-30 uppercase mb-8 flex items-center gap-4">
                                <span>Tech Stack</span>
                                <div className="h-px flex-1 bg-white/5" />
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {user.skills?.map((skill: string) => (
                                    <div key={skill} className="group flex items-center gap-3 p-3 rounded-md bg-[#161b22]/50 border border-white/5 hover:border-white/20 transition-all">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                                        <code className="text-xs">
                                            <span className="text-purple-400">export</span> <span className="text-blue-400">const</span> <span className="text-white">{skill.replace(/\s+/g, '')}</span>
                                        </code>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 03: Projects */}
                        <section className="space-y-12">
                            <h2 className="text-xs font-bold tracking-[0.3em] opacity-30 uppercase flex items-center gap-4">
                                <span>git_log --projects</span>
                                <div className="h-px flex-1 bg-white/5" />
                            </h2>
                            
                            <div className="grid gap-8">
                                {projects.map((project) => (
                                    <div 
                                        key={project._id} 
                                        className="group relative p-1 rounded-xl bg-gradient-to-br from-white/10 to-transparent hover:from-white/20 transition-all"
                                    >
                                        <div className="bg-canvas p-6 rounded-[10px] space-y-6">
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                                <div className="space-y-2">
                                                    <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text transition-all" style={{ backgroundImage: `linear-gradient(to right, #fff, ${accent})` }}>
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-sm opacity-60 leading-relaxed max-w-xl">{project.scope}</p>
                                                </div>
                                                {project.liveUrl && (
                                                    <Link 
                                                        href={project.liveUrl} 
                                                        className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border rounded transition-all hover:bg-white hover:text-black flex items-center gap-2"
                                                        style={{ borderColor: accent, color: accent }}
                                                    >
                                                        Run Application <ArrowUpRight size={14} />
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {project.technologies?.map((t: string) => (
                                                    <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 opacity-50 font-sans uppercase">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Status Bar */}
                    <footer className="h-8 bg-[#161b22] border-t border-white/10 flex items-center justify-between px-4 text-[10px] font-sans opacity-40">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                                main*
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Terminal size={12} />
                                zsh
                            </div>
                        </div>
                        <div className="hidden sm:flex gap-4">
                            <span>UTF-8</span>
                            <span style={{ color: accent }}>Next.js Prettier ✓</span>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}

// Sub-components for cleaner structure
function SidebarItem({ icon, label, active = false }: { icon: any; label: string; active?: boolean }) {
    return (
        <div className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${active ? 'bg-white/10 text-white shadow-sm' : 'hover:bg-white/5 text-gray-500 hover:text-gray-300'}`}>
            {icon}
            <span className="font-medium">{label}</span>
        </div>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: any; label: string }) {
    return (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2 py-1 text-gray-500 hover:text-white transition-colors group"
        >
            <span className="opacity-50 group-hover:opacity-100 transition-opacity">{icon}</span>
            <span className="text-xs">{label}</span>
        </a>
    );
}