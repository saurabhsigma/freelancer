import mongoose, { Schema, model, models } from "mongoose";

const FileSchema = new Schema(
    {
        projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
        milestoneId: { type: Schema.Types.ObjectId, ref: "Milestone" },
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
    },
    { timestamps: true }
);

export const File = models.File || model("File", FileSchema);
