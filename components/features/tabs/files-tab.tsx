"use client";

import { uploadFile, deleteFile } from "@/server/actions/file";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileIcon, Trash2, UploadCloud, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

export function FilesTab({ projectId, files }: { projectId: string, files: any[] }) {
    const [isUploading, setIsUploading] = useState(false);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                    <Card key={file._id} className="group relative overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <FileIcon className="h-6 w-6 text-slate-500" />
                                </div>
                                <div className="w-full">
                                    <p className="font-medium text-sm truncate w-full" title={file.fileName}>{file.fileName}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{formatDate(file.createdAt)}</p>
                                </div>
                                <div className="flex gap-2 w-full pt-2">
                                    <a href={file.fileUrl} download className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                    </a>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => deleteFile(file._id, projectId, file.fileUrl)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <Card className="border-dashed bg-slate-50/50 flex items-center justify-center p-6 h-full min-h-[180px]">
                    <form
                        action={async (formData) => {
                            setIsUploading(true);
                            await uploadFile(formData);
                            setIsUploading(false);
                        }}
                        className="flex flex-col items-center gap-4 text-center cursor-pointer"
                    >
                        <input type="hidden" name="projectId" value={projectId} />
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center mb-3">
                                <UploadCloud className="h-6 w-6 text-slate-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-900">Upload new file</span>
                            <span className="text-xs text-slate-500 mt-1">Click to browse</span>
                        </label>
                        <input
                            id="file-upload"
                            name="file"
                            type="file"
                            className="hidden"
                            onChange={(e) => e.target.form?.requestSubmit()}
                        />
                        {isUploading && <span className="text-xs text-blue-600 animate-pulse">Uploading...</span>}
                    </form>
                </Card>
            </div>
        </div>
    );
}
