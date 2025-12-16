import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        username: { type: String, unique: true, sparse: true },
        bio: { type: String },
        image: { type: String },
        skills: [{ type: String }],
        socials: {
            twitter: { type: String },
            linkedin: { type: String },
            github: { type: String },
            website: { type: String },
        },
    },
    { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
