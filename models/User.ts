import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        username: { type: String, unique: true, sparse: true },
        bio: { type: String },
        headline: { type: String },
        location: { type: String },
        resumeUrl: { type: String },
        image: { type: String },
        skills: [{ type: String }],
        socials: {
            twitter: { type: String },
            linkedin: { type: String },
            github: { type: String },
            website: { type: String },
        },
        profileConfig: {
            theme: { type: String, default: "minimal" }, // minimal, bold, professional, grid
            colorMode: { type: String, default: "system" },
            primaryColor: { type: String, default: "blue" },
            font: { type: String, default: "inter" }, // inter, playfair, roboto_mono
            animationIntensity: { type: String, default: "medium" }, // low, medium, high
            customColors: {
                background: { type: String },
                text: { type: String },
                accent: { type: String }
            },
            sections: [
                {
                    id: { type: String },
                    type: { type: String }, // hero, skills, projects, contact
                    visible: { type: Boolean, default: true },
                    order: { type: Number }
                }
            ],
            customDomain: { type: String, sparse: true }
        }
    },
    { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
