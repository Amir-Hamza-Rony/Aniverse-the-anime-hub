import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  R2_ENDPOINT,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_PUBLIC_URL,
} from "@/config";

let s3Client: S3Client | null = null;

export const getR2Client = (): S3Client | null => {
  if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
    return null;
  }
  if (!s3Client) {
    s3Client = new S3Client({
      endpoint: R2_ENDPOINT,
      region: "auto",
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
};

export interface PresignedUploadResult {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

/**
 * Generate a short-lived presigned PUT URL for direct client-to-R2 upload.
 * Returns null when R2 is not configured.
 */
export const createPresignedUpload = async (
  key: string,
  contentType: string,
  expiresIn = 300, // 5 minutes
): Promise<PresignedUploadResult | null> => {
  const client = getR2Client();
  if (!client) return null;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn });
  const publicUrl = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;

  return { uploadUrl, publicUrl, key };
};

export const deleteObject = async (key: string): Promise<void> => {
  const client = getR2Client();
  if (!client) return;
  const command = new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key });
  await client.send(command);
};

export const getObjectUrl = (key: string): string => {
  if (R2_PUBLIC_URL) return `${R2_PUBLIC_URL}/${key}`;
  return `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;
};
