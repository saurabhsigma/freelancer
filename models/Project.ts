import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
        title: { type: String, required: true },
        scope: { type: String },
        status: {
            type: String,
            enum: ["active", "paused", "completed"],
            default: "active",
        },
        startDate: { type: Date },
        dueDate: { type: Date },
        paymentType: { type: String, enum: ["fixed", "hourly"], default: "fixed" },
        isFeatured: { type: Boolean, default: false },
        screenshots: [{ type: String }], // Array of URLs

        // Extended Portfolio Fields
        technologies: [{ type: String }],
        repoUrl: { type: String },
        liveUrl: { type: String },
        longDescription: { type: String }, // Markdown supported
        challenges: { type: String }, // Markdown supported
    },
    { timestamps: true }
);

export const Project = models.Project || model("Project", ProjectSchema);
