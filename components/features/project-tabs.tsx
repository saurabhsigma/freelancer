"use client";

import { useState } from "react";
import { OverviewTab } from "./tabs/overview-tab";
import { MilestonesTab } from "./tabs/milestones-tab";
import { FilesTab } from "./tabs/files-tab";
import { NotesTab } from "./tabs/notes-tab";
import { InvoicesTab } from "./tabs/invoices-tab";
import { cn } from "@/lib/utils";

const tabs = [
    { id: "overview", label: "Overview" },
    { id: "milestones", label: "Milestones" },
    { id: "files", label: "Files" },
    { id: "notes", label: "Notes" },
    { id: "invoices", label: "Invoices" },
];

export function ProjectTabs({ data }: { data: any }) {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="space-y-6">
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                                activeTab === tab.id
                                    ? "border-slate-900 text-slate-900"
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="min-h-[400px]">
                {activeTab === "overview" && <OverviewTab project={data.project} stats={data.stats} />}
                {activeTab === "milestones" && <MilestonesTab projectId={data.project._id} milestones={data.milestones} />}
                {activeTab === "files" && <FilesTab projectId={data.project._id} files={data.files} />}
                {activeTab === "notes" && <NotesTab projectId={data.project._id} initialContent={data.note} />}
                {activeTab === "invoices" && <InvoicesTab projectId={data.project._id} invoices={data.invoices} />}
            </div>
        </div>
    );
}
