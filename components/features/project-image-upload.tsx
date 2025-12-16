"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/server/actions/file";
import { updateProjectScreenshot } from "@/server/actions/project";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ProjectImageUpload({ projectId, currentImage }: { projectId: string; currentImage?: string }) {
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.[0]) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("projectId", projectId);

        try {
            // First upload file
            const fileResult = await uploadFile(formData);
            if (fileResult?.success) {
                // Then link to project screenshot field
                await updateProjectScreenshot(projectId, fileResult.file.fileUrl);
                router.refresh();
            }
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-4 text-center bg-slate-50 dark:bg-slate-900/50 min-h-[200px] relative overflow-hidden group">
            {currentImage ? (
                <>
                    <img src={currentImage} alt="Project Cover" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                    <div className="z-10 relative opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="sm" className="relative cursor-pointer">
                            Replace Cover
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} disabled={uploading} />
                        </Button>
                    </div>
                </>
            ) : (
                <div className="z-10 relative">
                    <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload className="h-5 w-5 text-slate-500" />
                    </div>
                    <h4 className="font-medium">Upload Cover Image</h4>
                    <p className="text-sm text-slate-500 mb-2">Visible on your public profile</p>
                    <Button variant="outline" size="sm" className="relative cursor-pointer" disabled={uploading}>
                        {uploading ? "Uploading..." : "Select Image"}
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} disabled={uploading} />
                    </Button>
                </div>
            )}
        </div>
    );
}
