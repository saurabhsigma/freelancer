import mongoose, { Schema, model, models } from "mongoose";

const PostSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 280,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                content: { type: String, required: true },
                author: { type: Schema.Types.ObjectId, ref: "User", required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const Post = models?.Post || model("Post", PostSchema);

export default Post;
