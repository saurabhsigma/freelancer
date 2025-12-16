"use client";

import { saveNote } from "@/server/actions/note";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Save } from "lucide-react";

export function NotesTab({ projectId, initialContent }: { projectId: string, initialContent: string }) {
    const [content, setContent] = useState(initialContent);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await saveNote(projectId, content);
        setTimeout(() => setIsSaving(false), 500); // Visual feedback
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Project Notes</h3>
                <Button onClick={handleSave} disabled={isSaving} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[400px] p-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 font-mono text-sm leading-relaxed"
                placeholder="Type your notes here..."
            />
        </div>
    );
}
