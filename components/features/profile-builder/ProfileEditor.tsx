"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateProfileConfig, ProfileConfig } from "@/server/actions/profile-config";
import { Card } from "@/components/ui/card";
import { Check, ArrowUp, ArrowDown, Eye, EyeOff, LayoutTemplate, Palette, Type, MonitorPlay, Save, Smartphone, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ThemePremium } from "@/components/layouts/profile/ThemePremium";
import { ThemeModern } from "@/components/layouts/profile/ThemeModern";
import { ThemeCreative } from "@/components/layouts/profile/ThemeCreative";
import { ThemeDev } from "@/components/layouts/profile/ThemeDev";
import { ThemeZen } from "@/components/layouts/profile/ThemeZen";
import { ThemeEditable } from "@/components/layouts/profile/ThemeEditable";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileEditorProps {
    initialConfig: ProfileConfig;
    user: any;
    projects: any[];
}

export function ProfileEditor({ initialConfig, user, projects }: ProfileEditorProps) {
    // Merge initial config with validation to ensure no missing fields
    const defaultSections = [
        { id: "hero", type: "hero", visible: true, order: 0 },
        { id: "skills", type: "skills", visible: true, order: 1 },
        { id: "projects", type: "projects", visible: true, order: 2 },
        { id: "contact", type: "contact", visible: true, order: 3 }
    ];

    const [config, setConfig] = useState<ProfileConfig>({
        theme: initialConfig?.theme || "minimal",
        colorMode: initialConfig?.colorMode || "system",
        primaryColor: initialConfig?.primaryColor || "blue",
        font: initialConfig?.font || "inter",
        animationIntensity: initialConfig?.animationIntensity || "medium",
        customColors: initialConfig?.customColors || {
            background: "#ffffff",
            text: "#0f172a",
            accent: "#2563eb"
        },
        heroBackground: initialConfig?.heroBackground || '',
        cta: initialConfig?.cta || { label: 'Hire me', style: 'solid', link: '' },
        sections: initialConfig?.sections?.length ? initialConfig.sections : defaultSections,
        customDomain: initialConfig?.customDomain
    });

    const [saving, setSaving] = useState(false);
    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
    const router = useRouter();
    const { toast } = useToast();

    // Sync state if props change (e.g. strict refresh from server)
    useEffect(() => {
        if (initialConfig) {
            setConfig(prev => ({
                ...prev,
                ...initialConfig, // overwrite with DB values
                sections: initialConfig.sections?.length ? initialConfig.sections : prev.sections // ensure sections aren't overwritten by empty if bug
            }));
        }
    }, [initialConfig]);

    const themes = [
        { id: "premium", name: "Premium ✨", description: "Glassmorphism, animations, and high-end aesthetics." },
        { id: "modern", name: "Modern ✦", description: "Linear-style. Bento grids, clean lines, subtle glows." },
        { id: "creative", name: "Creative 🎨", description: "Bold typography, sticky scrolling, vibrant." },
        { id: "dev", name: "Dev / Terminal 👨‍💻", description: "Monospace, neon accents, cyber aesthetic." },
        { id: "zen", name: "Zen 🍵", description: "Editorial style. Serif fonts, paper texture, minimal." },
        { id: "editable", name: "Editable (Live)", description: "A live editable preview with inline controls." }
    ];

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await updateProfileConfig(config);
            if (result?.error) {
                toast({ title: "Error", description: "Failed to save changes", variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Profile updated successfully" });
                router.refresh();
            }
        } catch (e) {
            toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const toggleSection = (id: string) => {
        setConfig(prev => ({
            ...prev,
            sections: prev.sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s)
        }));
    };

    const moveSection = (index: number, direction: "up" | "down") => {
        const sections = [...config.sections];
        if (direction === "up" && index > 0) {
            [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
        } else if (direction === "down" && index < sections.length - 1) {
            [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
        }
        sections.forEach((s, i) => s.order = i);
        setConfig(prev => ({ ...prev, sections }));
    };

    const updateCustomColor = (key: 'background' | 'text' | 'accent', value: string) => {
        setConfig(prev => ({
            ...prev,
            customColors: {
                ...prev.customColors,
                [key]: value
            }
        }));
    };

    return (
        <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-100px)]">
            {/* Editor Sidebar */}
            <div className="w-full xl:w-[400px] flex flex-col gap-6 overflow-y-auto pr-2 pb-10">
                <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10 py-4 border-b">
                    <h2 className="text-2xl font-bold tracking-tight">Editor</h2>
                    <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2">
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </div>

                <Tabs defaultValue="theme" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="theme"><LayoutTemplate className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="style"><Palette className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="content"><Type className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="fx"><MonitorPlay className="w-4 h-4" /></TabsTrigger>
                    </TabsList>

                    {/* Theme Tab */}
                    <TabsContent value="theme" className="space-y-4 mt-4">
                        <div className="space-y-4">
                            {themes.map(theme => (
                                <Card
                                    key={theme.id}
                                    className={cn(
                                        "p-4 cursor-pointer border-2 transition-all hover:border-slate-400 relative",
                                        config.theme === theme.id ? "border-slate-900 dark:border-white ring-2 ring-slate-900/10" : "border-slate-100 dark:border-slate-800"
                                    )}
                                    onClick={() => setConfig({ ...config, theme: theme.id })}
                                >
                                    {config.theme === theme.id && (
                                        <div className="absolute top-2 right-2 bg-slate-900 text-white rounded-full p-1 shadow-sm">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                    <h3 className="font-bold">{theme.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{theme.description}</p>
                                </Card>
                            ))}
                        </div>
                        {/* Hero & CTA picker for Showcase */}
                        <div className="mt-4">
                            <Label className="text-sm font-medium">Hero Background (URL or color)</Label>
                            <Input
                                placeholder="e.g. /uploads/hero.jpg or #0ea5e9"
                                value={config.heroBackground || ''}
                                onChange={(e) => setConfig({ ...config, heroBackground: e.target.value })}
                                className="mt-2"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                                <Input value={config.cta?.label || ''} onChange={(e) => setConfig({ ...config, cta: { ...config.cta, label: e.target.value } })} placeholder="CTA label" />
                                <Input value={config.cta?.link || ''} onChange={(e) => setConfig({ ...config, cta: { ...config.cta, link: e.target.value } })} placeholder="CTA link (mailto: or /contact)" />
                                <Select value={config.cta?.style || 'solid'} onValueChange={(v) => setConfig({ ...config, cta: { ...config.cta, style: v } })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="solid">Solid</SelectItem>
                                        <SelectItem value="outline">Outline</SelectItem>
                                        <SelectItem value="ghost">Ghost</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Style Tab (Colors & Fonts) */}
                    <TabsContent value="style" className="space-y-6 mt-4">
                        <div className="space-y-4">
                            <Label>Color Mode</Label>
                            <Tabs value={config.colorMode} onValueChange={(v) => setConfig({ ...config, colorMode: v })} className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="light">Light</TabsTrigger>
                                    <TabsTrigger value="dark">Dark</TabsTrigger>
                                    <TabsTrigger value="system">System</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="space-y-4">
                            <Label>Font Family</Label>
                            <Select value={config.font} onValueChange={(v) => setConfig({ ...config, font: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Font" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="inter">Inter (Modern)</SelectItem>
                                    <SelectItem value="playfair">Playfair Display (Elegant)</SelectItem>
                                    <SelectItem value="roboto_mono">Roboto Mono (Code)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <Label className="text-base font-semibold">Custom Colors</Label>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase">Background</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="color"
                                            value={config.customColors?.background || "#ffffff"}
                                            onChange={(e) => updateCustomColor('background', e.target.value)}
                                            className="w-10 h-10 p-1 rounded-md cursor-pointer"
                                        />
                                        <Input
                                            value={config.customColors?.background || "#ffffff"}
                                            onChange={(e) => updateCustomColor('background', e.target.value)}
                                            className="w-24 h-8 text-xs font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase">Text Base</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="color"
                                            value={config.customColors?.text || "#0f172a"}
                                            onChange={(e) => updateCustomColor('text', e.target.value)}
                                            className="w-10 h-10 p-1 rounded-md cursor-pointer"
                                        />
                                        <Input
                                            value={config.customColors?.text || "#0f172a"}
                                            onChange={(e) => updateCustomColor('text', e.target.value)}
                                            className="w-24 h-8 text-xs font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase">Accent / Primary</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="color"
                                            value={config.customColors?.accent || "#2563eb"}
                                            onChange={(e) => updateCustomColor('accent', e.target.value)}
                                            className="w-10 h-10 p-1 rounded-md cursor-pointer"
                                        />
                                        <Input
                                            value={config.customColors?.accent || "#2563eb"}
                                            onChange={(e) => updateCustomColor('accent', e.target.value)}
                                            className="w-24 h-8 text-xs font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Content Tab (Sections) */}
                    <TabsContent value="content" className="space-y-6 mt-4">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                            {config.sections?.sort((a, b) => a.order - b.order).map((section, index) => (
                                <div key={section.id} className="flex items-center justify-between p-3 border-b last:border-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col gap-0.5">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 text-slate-400 hover:text-slate-900"
                                                onClick={() => moveSection(index, "up")}
                                                disabled={index === 0}
                                            >
                                                <ArrowUp className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 text-slate-400 hover:text-slate-900"
                                                onClick={() => moveSection(index, "down")}
                                                disabled={index === config.sections.length - 1}
                                            >
                                                <ArrowDown className="w-3 h-3" />
                                            </Button>
                                        </div>
                                        <span className="font-medium text-sm capitalize">{section.id}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleSection(section.id)}
                                        className={section.visible ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-slate-300"}
                                    >
                                        {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Reorder sections to change the layout flow.
                        </p>
                    </TabsContent>

                    {/* FX Tab */}
                    <TabsContent value="fx" className="space-y-6 mt-4">
                        <div className="space-y-4">
                            <Label>Animation Intensity</Label>
                            <Select value={config.animationIntensity} onValueChange={(v) => setConfig({ ...config, animationIntensity: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Intensity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low (Professional)</SelectItem>
                                    <SelectItem value="medium">Medium (Standard)</SelectItem>
                                    <SelectItem value="high">High (Dynamic)</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Controls how elements enter the screen.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Live Preview Area */}
            <div className="hidden xl:flex flex-1 flex-col bg-slate-100 dark:bg-zinc-950 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative transition-all duration-300">
                {/* Preview Toolbar */}
                <div className="h-12 bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 flex items-center justify-between px-4 z-20">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-2 bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode("desktop")}
                                className={cn("h-7 px-2 hover:bg-white dark:hover:bg-zinc-700", viewMode === "desktop" && "bg-white dark:bg-zinc-700 shadow-sm")}
                            >
                                <Laptop className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode("mobile")}
                                className={cn("h-7 px-2 hover:bg-white dark:hover:bg-zinc-700", viewMode === "mobile" && "bg-white dark:bg-zinc-700 shadow-sm")}
                            >
                                <Smartphone className="w-4 h-4" />
                            </Button>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">Live Preview</span>
                    </div>
                    <div className="bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-500/20 font-medium flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Auto-updating
                    </div>
                </div>

                {/* Preview Viewport */}
                <div className="flex-1 overflow-hidden bg-slate-200/50 dark:bg-zinc-950/50 grid place-items-center relative">
                    <div
                        className={cn(
                            "transition-all duration-500 ease-in-out shadow-2xl overflow-y-auto custom-scrollbar relative",
                            viewMode === "mobile" ? "w-[375px] h-[812px] rounded-[3rem] border-[8px] border-zinc-900 bg-black" : "w-full h-full rounded-none border-0",
                            // Ensure the preview content has the correct theme context
                            config.colorMode === 'dark' ? 'dark' : config.colorMode === 'light' ? '' : 'system'
                        )}
                        style={viewMode === 'mobile' ? { boxShadow: '0 0 0 2px #333' } : {}}
                    >
                        {/* Mobile Notch */}
                        {viewMode === 'mobile' && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-zinc-900 rounded-b-2xl z-50 pointer-events-none" />
                        )}

                        {/* Content Wrapper - Applies theme variables correctly */}
                        <div className="min-h-full bg-background text-foreground animate-in fade-in duration-300">
                            {config.theme === 'premium' && <ThemePremium user={user} projects={projects} config={config} />}
                            {config.theme === 'modern' && <ThemeModern user={user} projects={projects} config={config} />}
                            {config.theme === 'creative' && <ThemeCreative user={user} projects={projects} config={config} />}
                            {config.theme === 'dev' && <ThemeDev user={user} projects={projects} config={config} />}
                            {config.theme === 'zen' && <ThemeZen user={user} projects={projects} config={config} />}
                            {config.theme === 'editable' && <ThemeEditable user={user} projects={projects} config={config} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
