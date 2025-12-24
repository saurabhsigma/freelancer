import { NextRequest, NextResponse } from "next/server";
import { getSignedUploadUrl } from "@/server/s3";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { filename, contentType } = await req.json();

        // Create a unique key for the file
        // Organize by user or project if possible, but filename is what we have here.
        // Let's use timestamp-filename like before.
        const key = `uploads/${Date.now()}-${filename.replace(/\s+/g, "_")}`;

        const url = await getSignedUploadUrl(key, contentType);
        // Construct public URL (assuming public read access)
        const publicUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;

        return NextResponse.json({ url, key, publicUrl });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
    }
}
