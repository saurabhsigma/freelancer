"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Settings2, Save, X, Type, Palette,
  Layout, Image as ImageIcon, Plus, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeEditable({ user: initialUser, projects: initialProjects, config }: any) {
    // 1. Local state to manage live edits before "Saving"
    // Ensure inputs are always controlled by providing safe defaults for missing fields
    const safeUser = { name: "", headline: "", bio: "", email: "", image: "", socials: {}, skills: [], ... (initialUser || {}) };
    const [user, setUser] = useState<any>(safeUser);
    const [projects, setProjects] = useState<any[]>(Array.isArray(initialProjects) ? initialProjects : (initialProjects ? [initialProjects] : []));
    const [isEditing, setIsEditing] = useState(false);
    const [activePanel, setActivePanel] = useState("content"); // content | style | layout

    // 2. Inline Edit Helper
    const handleUpdateUser = (field: string, value: string) => {
        setUser({ ...user, [field]: value });
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${isEditing ? 'pl-80' : ''}`} 
             style={{ backgroundColor: config.customColors?.background || '#ffffff' }}>
            
            {/* Toolbar Toggle */}
            <button 
                onClick={() => setIsEditing(!isEditing)}
                className="fixed bottom-8 left-8 z-[100] bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2"
            >
                {isEditing ? <Save size={20} /> : <Settings2 size={20} />}
                <span className="font-bold text-sm">{isEditing ? "Save Changes" : "Customize"}</span>
            </button>

            {/* Side Editor Panel */}
            <AnimatePresence>
                {isEditing && (
                    <motion.aside 
                        initial={{ x: -320 }}
                        animate={{ x: 0 }}
                        exit={{ x: -320 }}
                        className="fixed left-0 top-0 h-full w-80 bg-white border-r border-zinc-200 z-[90] shadow-xl p-6 overflow-y-auto font-sans"
                    >
                        <div className="space-y-8 text-black">
                            <header className="flex justify-between items-center">
                                <h2 className="font-bold text-xl">Site Editor</h2>
                                <button onClick={() => setIsEditing(false)}><X size={20}/></button>
                            </header>

                            {/* Panel Tabs */}
                            <div className="flex border-b border-zinc-100">
                                <button 
                                    onClick={() => setActivePanel("content")}
                                    className={`flex-1 pb-2 text-xs font-bold uppercase tracking-widest ${activePanel === 'content' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'opacity-40'}`}
                                >
                                    Content
                                </button>
                                <button 
                                    onClick={() => setActivePanel("style")}
                                    className={`flex-1 pb-2 text-xs font-bold uppercase tracking-widest ${activePanel === 'style' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'opacity-40'}`}
                                >
                                    Style
                                </button>
                            </div>

                            {activePanel === "content" && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase opacity-50">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={user.name} 
                                            onChange={(e) => handleUpdateUser('name', e.target.value)}
                                            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase opacity-50">Headline</label>
                                        <input 
                                            type="text" 
                                            value={user.headline} 
                                            onChange={(e) => handleUpdateUser('headline', e.target.value)}
                                            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase opacity-50">Bio</label>
                                        <textarea 
                                            rows={4}
                                            value={user.bio} 
                                            onChange={(e) => handleUpdateUser('bio', e.target.value)}
                                            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            {activePanel === "style" && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="p-4 bg-zinc-50 rounded-lg">
                                        <p className="text-xs font-bold mb-4 opacity-50">Quick Themes</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            <ThemeCircle color="#000000" label="Dark" />
                                            <ThemeCircle color="#f4f4f0" label="Paper" />
                                            <ThemeCircle color="#5e6ad2" label="Indigo" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Portfolio View (Live Preview) */}
            <main className="max-w-4xl mx-auto py-24 px-8">
                <header className="space-y-6">
                    {/* Elements are highlighted when in edit mode */}
                    <div className={`relative group p-2 rounded-lg transition-all ${isEditing ? 'hover:ring-2 hover:ring-indigo-400 cursor-text' : ''}`}>
                        <EditableText 
                            value={user.name} 
                            onChange={(val) => handleUpdateUser('name', val)} 
                            isEditing={isEditing}
                            className="text-6xl font-black tracking-tighter"
                        />
                    </div>

                    <div className={`relative group p-2 rounded-lg transition-all ${isEditing ? 'hover:ring-2 hover:ring-indigo-400 cursor-text' : ''}`}>
                        <EditableText 
                            value={user.bio} 
                            onChange={(val) => handleUpdateUser('bio', val)} 
                            isEditing={isEditing}
                            className="text-2xl text-zinc-500 leading-relaxed max-w-2xl"
                        />
                    </div>
                </header>

                <section className="mt-32 space-y-24">
                    <h3 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30">Projects</h3>
                    <div className="grid gap-20">
                        {projects.map((project: any, idx: number) => (
                            <div key={idx} className={`relative group p-4 rounded-2xl transition-all ${isEditing ? 'hover:ring-2 hover:ring-indigo-400' : ''}`}>
                                <div className="flex flex-col md:flex-row gap-10">
                                    <div className="flex-1 aspect-video bg-zinc-100 rounded-xl overflow-hidden relative">
                                        {project.screenshots?.[0] && <Image src={project.screenshots[0]} alt="" fill className="object-cover" />}
                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="bg-white text-black p-3 rounded-full shadow-xl"><ImageIcon size={20}/></button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <EditableText 
                                            value={project.title} 
                                            isEditing={isEditing}
                                            onChange={(v) => {
                                                const newP = [...projects];
                                                newP[idx].title = v;
                                                setProjects(newP);
                                            }}
                                            className="text-3xl font-bold"
                                        />
                                        <EditableText 
                                            value={project.scope} 
                                            isEditing={isEditing}
                                            onChange={(v) => {
                                                const newP = [...projects];
                                                newP[idx].scope = v;
                                                setProjects(newP);
                                            }}
                                            className="text-zinc-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

// 3. Helper Component: Inline Text Editor
function EditableText({ value, onChange, isEditing, className }: { value: string; onChange: (val: string) => void; isEditing: boolean; className?: string }) {
    if (!isEditing) return <p className={className}>{value}</p>;

    return (
        <textarea
            className={`${className} w-full bg-transparent border-none focus:ring-0 resize-none p-0 overflow-hidden`}
            value={value}
            rows={1}
            onChange={(e) => {
                onChange(e.target.value);
                // Auto resize height
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
            }}
            onFocus={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
            }}
        />
    );
}

function ThemeCircle({ color, label }: any) {
    return (
        <button className="flex flex-col items-center gap-2 group">
            <div className="w-10 h-10 rounded-full border border-zinc-200 group-hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
            <span className="text-[10px] opacity-40 uppercase font-bold">{label}</span>
        </button>
    );
}
