import mongoose, { Schema, model, models } from "mongoose";

const InvoiceSchema = new Schema(
    {
        projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
        amount: { type: Number, required: true },
        dueDate: { type: Date },
        status: {
            type: String,
            enum: ["sent", "paid", "overdue"],
            default: "sent",
        },
        notes: { type: String },
    },
    { timestamps: true }
);

export const Invoice = models.Invoice || model("Invoice", InvoiceSchema);
