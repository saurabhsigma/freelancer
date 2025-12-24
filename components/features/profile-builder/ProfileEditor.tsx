"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateProfileConfig, ProfileConfig } from "@/server/actions/profile-config";
import { Card } from "@/components/ui/card";
import { Check, ArrowUp, ArrowDown, Eye, EyeOff, LayoutTemplate, Palette, Type, MonitorPlay, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ThemeMinimal } from "@/components/layouts/profile/ThemeMinimal";
import { ThemeBold } from "@/components/layouts/profile/ThemeBold";
import { ThemeProfessional } from "@/components/layouts/profile/ThemeProfessional";
import { ThemeGrid } from "@/components/layouts/profile/ThemeGrid";
import { ThemeClassic } from "@/components/layouts/profile/ThemeClassic";
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
        sections: initialConfig?.sections?.length ? initialConfig.sections : defaultSections,
        customDomain: initialConfig?.customDomain
    });

    const [saving, setSaving] = useState(false);
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
        { id: "minimal", name: "Minimal", description: "Clean, whitespace-heavy layout focus on typography." },
        { id: "showcase", name: "Showcase", description: "Big hero, gradient background and project-focused layout." },
        { id: "classic", name: "Classic Portfolio", description: "The original timeless look with dark mode toggle." },
        { id: "bold", name: "Bold", description: "High contrast, large type, dark mode default." },
        { id: "professional", name: "Professional", description: "Standard resume/portfolio layout with sidebar." },
        { id: "grid", name: "Creative Grid", description: "Masonry style grid for visual portfolios." },
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
                                    <p className="text-xs text-slate-500 mt-1">{theme.description}</p>
                                </Card>
                            ))}
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
                                    <Label className="text-xs text-slate-500 uppercase">Background</Label>
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
                                    <Label className="text-xs text-slate-500 uppercase">Text Base</Label>
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
                                    <Label className="text-xs text-slate-500 uppercase">Accent / Primary</Label>
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
                        <p className="text-xs text-slate-500">
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
                            <p className="text-xs text-slate-500">
                                Controls how elements enter the screen.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Live Preview Area */}
            <div className="hidden xl:flex flex-1 bg-slate-100 dark:bg-black/50 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md z-50">
                    Live Preview
                </div>
                <div className="w-full h-full overflow-y-auto custom-scrollbar bg-white dark:bg-slate-950">
                    {/* Pass live config to themes */}
                    <div className={cn(
                        "min-h-full",
                        config.colorMode === 'dark' ? 'dark' : config.colorMode === 'light' ? '' : 'system', // naive toggle, actual provider needed for real mode switch
                        // If we want real dark mode preview, we might need a wrapper div with 'dark' class if mode is dark
                    )}>
                        {/* We mimic the ProfileView logic here but with passed config */}

                        {config.theme === 'bold' && <ThemeBold user={user} projects={projects} config={config} />}
                        {config.theme === 'professional' && <ThemeProfessional user={user} projects={projects} config={config} />}
                        {config.theme === 'classic' && <ThemeClassic user={user} projects={projects} config={config} />}
                        {config.theme === 'minimal' && <ThemeMinimal user={user} projects={projects} config={config} />}
                        {config.theme === 'grid' && <ThemeGrid user={user} projects={projects} config={config} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
