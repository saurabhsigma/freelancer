import mongoose, { Schema, model, models } from "mongoose";

const NoteSchema = new Schema(
    {
        projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

export const Note = models.Note || model("Note", NoteSchema);
