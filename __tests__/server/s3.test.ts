
import { getSignedUploadUrl, getPublicS3Url } from "@/server/s3";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Mock S3 Client and Presigner
jest.mock("@aws-sdk/client-s3", () => {
    return {
        S3Client: jest.fn().mockImplementation(() => ({
            send: jest.fn(),
        })),
        PutObjectCommand: jest.fn(),
        DeleteObjectCommand: jest.fn(),
        GetObjectCommand: jest.fn(),
    };
});

jest.mock("@aws-sdk/s3-request-presigner", () => ({
    getSignedUrl: jest.fn(),
}));

describe("S3 Utils", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.S3_BUCKET = "test-bucket";
        process.env.S3_REGION = "us-east-1";
    });

    it("should generate a signed upload URL", async () => {
        (getSignedUrl as jest.Mock).mockResolvedValue("https://signed-url.com");

        const url = await getSignedUploadUrl("test-key", "image/png");

        expect(getSignedUrl).toHaveBeenCalledWith(
            expect.any(Object), // client
            expect.any(Object), // command
            expect.objectContaining({ expiresIn: 3600 })
        );
        expect(PutObjectCommand).toHaveBeenCalledWith({
            Bucket: "test-bucket",
            Key: "test-key",
            ContentType: "image/png",
        });
        expect(url).toBe("https://signed-url.com");
    });

    it("should generate a public S3 URL", () => {
        const url = getPublicS3Url("test-key");
        expect(url).toBe("https://test-bucket.s3.us-east-1.amazonaws.com/test-key");
    });
});
