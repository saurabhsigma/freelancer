"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { uploadFile } from "@/server/actions/file";

export function ProfileImageUpload({ initialImage, onImageChange }: { initialImage?: string, onImageChange: (url: string) => void }) {
    const [image, setImage] = useState<string | undefined>(initialImage);
    const [uploading, setUploading] = useState(false);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadFile(formData);

        if (result.success && result.file) {
            setImage(result.file.url);
            onImageChange(result.file.url);
        }

        setUploading(false);
    }

    return (
        <div className="flex flex-col gap-4">
            {image ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-slate-200">
                    <Image src={image} alt="Profile" fill className="object-cover" />
                    <button
                        onClick={() => { setImage(undefined); onImageChange(""); }}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-md hover:bg-red-600 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300">
                    <span className="text-slate-400 text-xs text-center px-2">No Image</span>
                </div>
            )}

            <div className="relative">
                <input
                    type="file"
                    id="profile-image-upload"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*"
                    disabled={uploading}
                />
                <Button type="button" variant="outline" size="sm" disabled={uploading} className="w-32">
                    {uploading ? "Uploading..." : "Upload Photo"}
                </Button>
            </div>
        </div>
    );
}
