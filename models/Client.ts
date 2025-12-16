import mongoose, { Schema, model, models } from "mongoose";

const ClientSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        company: { type: String },
        email: { type: String },
        phone: { type: String },
        timezone: { type: String },
        notes: { type: String },
    },
    { timestamps: true }
);

export const Client = models.Client || model("Client", ClientSchema);
