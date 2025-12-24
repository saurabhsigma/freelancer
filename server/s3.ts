import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.S3_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
});

export async function getSignedUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        ContentType: contentType,
    });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export function getPublicS3Url(key: string) {
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
}

export async function deleteS3Object(key: string) {
    const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
    });
    return s3Client.send(command);
}

export async function getSignedGetUrl(key: string) {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
    });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
