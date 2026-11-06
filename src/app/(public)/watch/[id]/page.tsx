"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VideoPlayer } from "@/components/player/video-player";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Episode {
  _id: string;
  episodeNumber: number;
  title?: string;
  thumbnailUrl?: string;
  videoSources?: Array<{
    serverName: string;
    serverPriority: number;
    isEnabled: boolean;
    qualities: Array<{ quality: string; url: string; isHls?: boolean; fileSize?: number }>;
  }>;
  downloadSources?: Array<{
    serverName: string;
    serverPriority: number;
    isEnabled: boolean;
    qualities: Array<{ quality: string; url: string; isHls?: boolean; fileSize?: number }>;
  }>;
  subtitles?: string[];
}

interface Anime {
  _id: string;
  title: string;
  slug: string;
  posterUrl?: string;
  bannerUrl?: string;
  synopsis: string;
  status: string;
  type: string;
  totalEpisodes: number;
  genres: Array<{ name: string } | string>;
  episodes?: Episode[];
}

async function fetchWatchData(episodeId: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "";
  const res = await fetch(`${base}/api/streaming/episode/${episodeId}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default function WatchPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<{ anime: Anime; episode: Episode } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeServer, setActiveServer] = useState(0);
  const [seasonSelectorOpen, setSeasonSelectorOpen] = useState(false);

  useEffect(() => {
    fetchWatchData(params.id).then((d) => {
      setData(d || null);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw size={32} className="text-violet-400 animate-spin" />
          <p className="text-muted-foreground">Loading episode...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h3 className="text-lg font-medium">Episode not found</h3>
        <Button onClick={() => router.back()}>Go back</Button>
      </div>
    );
  }

  const { anime, episode } = data;
  const servers = (episode.videoSources || []).filter((s) => s.isEnabled);
  const activeServerObj = servers[activeServer] || servers[0];
  const qualities = activeServerObj?.qualities || [];
  const currentQuality = qualities[0];

  const genreList = Array.isArray(anime.genres)
    ? anime.genres.map((g: any) => (typeof g === "string" ? g : g.name))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-8 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={anime.status === "ONGOING" ? "default" : "secondary"}>
              {anime.status}
            </Badge>
            <Badge variant="outline">{anime.type}</Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">{anime.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{anime.releaseYear}</span>
            <span className="mx-1">•</span>
            <span>{anime.totalEpisodes} Episodes</span>
            <span className="mx-1">•</span>
            <span>{anime.type}</span>
          </div>
          <p className="mt-3 text-muted-foreground leading-relaxed">{anime.synopsis}</p>
          <div className="mt-4 flex gap-3">
            <Button className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700">
              <Play size={18} /> Watch Now
            </Button>
            <Link href={`/download/${episode._id}`}>
              <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                <Clock size={18} /> Download
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-64 shrink-0">
          <Image
            src={anime.posterUrl || "/placeholder-anime.jpg"}
            alt={anime.title}
            className="w-full rounded-xl shadow-2xl object-cover"
            sizes="200px"
          />
        </div>
      </div>

      {/* Player + Episode list */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10 mb-4">
            {currentQuality ? (
              <VideoPlayer
                videoUrl={currentQuality.url}
                isHls={currentQuality.isHls || false}
                poster={episode.thumbnailUrl || anime.posterUrl}
                subtitleTracks={episode.subtitles?.map((url) => ({ label: "English", url })) || []}
                qualityOptions={qualities.map((q) => ({
                  label: q.quality,
                  url: q.url,
                  isHls: q.isHls || false,
                }))}
                onQualityChange={(label) => {}}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <RefreshCw size={32} className="mb-2 text-violet-400 animate-spin" />
                <p>No streaming sources available</p>
              </div>
            )}
          </div>

          {/* Server Selection */}
          {servers.length > 1 && (
            <div className="flex gap-2 mb-4">
              <span className="text-xs text-muted-foreground mt-1">Server:</span>
              {servers.map((s, idx) => (
                <button
                  key={s.serverName}
                  onClick={() => setActiveServer(idx)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeServer === idx
                      ? "bg-violet-600 text-white"
                      : "bg-[#0C111D] border border-white/10 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {s.serverName}
                </button>
              ))}
            </div>
          )}

          {/* Episode Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button variant="outline" disabled={true}>
                Season 1
              </Button>
              <button
                onClick={() => setSeasonSelectorOpen(true)}
                className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300"
              >
                <Clock size={16} /> Select Season
              </button>
            </div>
            <div className="flex gap-2">
              <Link href={`/anime/${anime.slug}`} className="text-sm text-muted-foreground hover:text-white">
                Back to Anime
              </Link>
            </div>
          </div>

          {/* Episode List */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {(anime.episodes || []).map((ep) => (
              <Link
                key={ep._id}
                href={`/watch/${ep._id}`}
                className={`group flex flex-col gap-1.5 p-2 rounded-lg border transition-colors ${
                  ep._id === episode._id ? "border-violet-500 bg-violet-500/10" : "border-white/5 bg-[#0C111D]/50 hover:border-white/20"
                }`}
              >
                <div className="aspect-video bg-[#111827] rounded overflow-hidden relative mb-1">
                  {ep.thumbnailUrl ? (
                    <Image src={ep.thumbnailUrl} fill className="object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                      EP{ep.episodeNumber}
                    </div>
                  )}
                  <div className="absolute top-1 right-1 bg-black/60 text-[10px] px-1.5 py-0.5 rounded">
                    {ep.episodeNumber}
                  </div>
                </div>
                <div className="text-xs font-medium line-clamp-1 text-white">{ep.title || `Episode ${ep.episodeNumber}`}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card>
            <div className="p-4">
              <h3 className="font-semibold mb-3">Episode Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Episode</span>
                  <span className="text-white">#{episode.episodeNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title</span>
                  <span className="text-white line-clamp-1">{episode.title || "Untitled"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-white">{episode.thumbnailUrl ? "Unknown" : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available Qualities</span>
                  <span className="text-white">
                    {qualities.map((q) => q.quality).join(", ") || "—"}
                  </span>
                </div>
                {episode.subtitles && episode.subtitles.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtitles</span>
                    <span className="text-violet-400 text-xs">Available</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <h3 className="font-semibold mb-3">Related Episodes</h3>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3 p-2 rounded-lg border border-white/5 hover:bg-[#0C111D]/40 transition-colors">
                    <div className="w-16 h-12 flex-shrink-0 rounded bg-[#111827] flex items-center justify-center text-xs text-muted-foreground">
                      EP{i + 1}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-sm font-medium line-clamp-1 text-white">Related Episode {i + 1}</div>
                      <div className="text-xs text-muted-foreground">{qualities.join(", ")}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
