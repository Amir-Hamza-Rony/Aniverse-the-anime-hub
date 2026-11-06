import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "@/config";

if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

export const uploadImage = async (
  file: Buffer | string,
  options: { folder?: string; publicId?: string } = {},
): Promise<{ url: string; publicId: string } | null> => {
  if (!CLOUDINARY_CLOUD_NAME) return null;
  try {
    const result = await cloudinary.uploader.upload(file as unknown as string, {
      folder: options.folder || "aniverse",
      public_id: options.publicId,
      resource_type: "image",
    });
    return { url: result.secure_url, publicId: result.public_id };
  } catch {
    return null;
  }
};

export const deleteImage = async (publicId: string): Promise<boolean> => {
  if (!CLOUDINARY_CLOUD_NAME) return false;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch {
    return false;
  }
};

export default cloudinary;
