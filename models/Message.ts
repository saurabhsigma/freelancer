import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
            tirm: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        senderName: {
            type: String,
            required: true,
        },
        senderImage: {
            type: String,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Message = models?.Message || model("Message", MessageSchema);

export default Message;
