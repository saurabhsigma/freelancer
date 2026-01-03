import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TemplateGallery } from "@/components/features/templates/template-gallery";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function TemplatesPage() {
    const session = await getSession();
    if (!session?.user?.id) redirect("/login");

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Portfolio Templates</h1>
                    <p className="text-muted-foreground mt-2">
                        Choose a professionally designed template and customize it to match your style
                    </p>
                </div>
            </div>
            
            <TemplateGallery />
        </div>
    );
}
