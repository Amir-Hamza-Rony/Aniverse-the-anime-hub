import { AdvertisementClick, Advertisement } from "@/models";
import { dbConnect } from "@/lib/database/connect";
import { PlacementType } from "@/types";

const WINDOW_MS = 60 * 1000; // 1 minute deduplication window

/**
 * Records a click only if the same IP/user hasn't clicked the same ad
 * within the deduplication window. Returns true if recorded.
 */
export const recordClickIfUnique = async ({
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
}): Promise<boolean> => {
  await dbConnect();

  const since = new Date(Date.now() - WINDOW_MS);

  const existing = await AdvertisementClick.findOne({
    advertisement: advertisementId,
    placementType,
    ...(animeId ? { animeId } : {}),
    ...(episodeId ? { episodeId } : {}),
    ...(userId ? { userId } : {}),
    ...(ipAddress ? { ipAddress } : {}),
    clickedAt: { $gte: since },
  });

  if (existing) return false;

  await AdvertisementClick.create({
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

  return true;
};

export const getClickStats = async ({
  startDate,
  endDate,
  placementType,
}: {
  startDate: Date;
  endDate: Date;
  placementType?: PlacementType;
}) => {
  await dbConnect();

  const match: Record<string, unknown> = {
    clickedAt: { $gte: startDate, $lte: endDate },
  };
  if (placementType) match.placementType = placementType;

  const [total, byDay, byPlacement] = await Promise.all([
    AdvertisementClick.countDocuments(match),
    AdvertisementClick.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$clickedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    AdvertisementClick.aggregate([
      { $match: match },
      { $group: { _id: "$placementType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  return { total, byDay, byPlacement };
};

export const getTopClickedAnime = async (startDate: Date, endDate: Date, limit = 10) => {
  await dbConnect();
  return AdvertisementClick.aggregate([
    {
      $match: {
        clickedAt: { $gte: startDate, $lte: endDate },
        animeId: { $exists: true, $ne: null },
      },
    },
    { $group: { _id: "$animeId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
    { $lookup: { from: "animes", localField: "_id", foreignField: "_id", as: "anime" } },
    { $unwind: "$anime" },
    { $project: { _id: "$anime._id", title: "$anime.title", count: 1 } },
  ]);
};
