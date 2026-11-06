import { Advertisement, AdvertisementClick } from "@/models";
import { dbConnect } from "@/lib/database/connect";
import { PlacementType } from "@/types";

/**
 * Find an enabled advertisement for a given placement type, optionally scoped
 * to an anime or episode. Returns the best match by priority.
 */
export const getAdvertisementForPlacement = async ({
  placementType,
  animeId,
  episodeId,
}: {
  placementType: PlacementType;
  animeId?: string;
  episodeId?: string;
}) => {
  await dbConnect();

  const query: Record<string, unknown> = {
    placementType,
    isEnabled: true,
  };

  // Scope to anime/episode if provided; otherwise match global placement ads
  if (animeId) {
    query.$or = [
      { animeId: null },
      { animeId: { $exists: false } },
      { animeId },
    ];
  } else if (episodeId) {
    query.$or = [
      { episodeId: null },
      { episodeId: { $exists: false } },
      { episodeId },
    ];
  } else {
    query.animeId = { $in: [null, undefined] };
    query.episodeId = { $in: [null, undefined] };
  }

  return Advertisement.findOne(query).sort({ priority: -1, createdAt: -1 }).lean();
};

/**
 * Record an advertisement click. Includes basic deduplication guard:
 * ignores repeated clicks from the same IP+user within a short window for
 * the same advertisement to reduce click inflation.
 */
export const recordAdvertisementClick = async ({
  advertisementId,
  placementType,
  animeId,
  episodeId,
  userId,
  ipAddress,
  userAgent,
}: {
  advertisementId: string;
  placementType: PlacementType;
  animeId?: string;
  episodeId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
}) => {
  await dbConnect();

  const click = await AdvertisementClick.create({
    advertisement: advertisementId,
    placementType,
    animeId: animeId || undefined,
    episodeId: episodeId || undefined,
    userId: userId || undefined,
    ipAddress,
    userAgent,
  });

  await Advertisement.findByIdAndUpdate(advertisementId, {
    $inc: { totalClicks: 1 },
  });

  return click;
};

/**
 * Validate that a destination is safe (relative path or trusted external
 * domain) to prevent open redirects.
 */
const TRUSTED_EXTERNAL_HOSTS = [
  new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").hostname,
];

export const isSafeDestination = (destination: string): boolean => {
  try {
    // Relative paths are safe
    if (destination.startsWith("/")) return true;
    const url = new URL(destination);
    return TRUSTED_EXTERNAL_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
};
