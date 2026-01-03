"use client";

import { useState } from "react";
import { portfolioTemplates, templateCategories, type PortfolioTemplate } from "@/lib/portfolio-templates";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Download, Eye, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export function TemplateGallery() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [previewTemplate, setPreviewTemplate] = useState<PortfolioTemplate | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const filteredTemplates = selectedCategory === "All" 
        ? portfolioTemplates 
        : portfolioTemplates.filter(t => t.category === selectedCategory);

    const handleUseTemplate = async (template: PortfolioTemplate) => {
        try {
            const res = await fetch('/api/templates/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ templateId: template.id })
            });

            if (!res.ok) throw new Error('Failed to apply template');

            toast({
                title: "Template Applied!",
                description: `${template.name} has been applied to your profile.`
            });

            router.push('/settings/profile');
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to apply template. Please try again.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Category Filter */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    {templateCategories.map(category => (
                        <TabsTrigger key={category} value={category}>
                            {category}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                    <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center space-y-2 p-6">
                                    <div className="text-4xl font-bold opacity-20">{template.name[0]}</div>
                                    <Badge variant="secondary">{template.theme}</Badge>
                                </div>
                            </div>
                            {template.id === "premium-freelancer" && (
                                <div className="absolute top-2 right-2">
                                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        Premium
                                    </Badge>
                                </div>
                            )}
                        </div>

                        <CardHeader>
                            <CardTitle>{template.name}</CardTitle>
                            <CardDescription>{template.description}</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-1">
                                    {template.sampleSkills.slice(0, 3).map(skill => (
                                        <Badge key={skill} variant="outline" className="text-xs">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {template.sampleSkills.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{template.sampleSkills.length - 3}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {template.sampleProjects.length} sample project{template.sampleProjects.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </CardContent>

                        <CardFooter className="gap-2">
                            <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => setPreviewTemplate(template)}
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Button>
                            <Button 
                                className="flex-1"
                                onClick={() => handleUseTemplate(template)}
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Use Template
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Preview Modal */}
            {previewTemplate && (
                <div 
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setPreviewTemplate(null)}
                >
                    <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <CardHeader>
                            <CardTitle>{previewTemplate.name}</CardTitle>
                            <CardDescription>{previewTemplate.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Sample Bio</h4>
                                <p className="text-sm text-muted-foreground">{previewTemplate.sampleBio}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {previewTemplate.sampleSkills.map(skill => (
                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Sample Projects</h4>
                                <div className="space-y-3">
                                    {previewTemplate.sampleProjects.map((project, idx) => (
                                        <div key={idx} className="border rounded-lg p-3">
                                            <h5 className="font-medium">{project.title}</h5>
                                            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {project.technologies.map(tech => (
                                                    <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="gap-2">
                            <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                                Close
                            </Button>
                            <Button onClick={() => handleUseTemplate(previewTemplate)}>
                                <Check className="w-4 h-4 mr-2" />
                                Use This Template
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    );
}
