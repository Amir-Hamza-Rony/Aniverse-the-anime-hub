"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Clock, Play, ShieldCheck, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DownloadSource {
  serverName: string;
  serverPriority: number;
  isEnabled: boolean;
  qualities: Array<{
    quality: string;
    url: string;
    fileSize?: number;
    isHls?: boolean;
  }>;
}

interface Episode {
  _id: string;
  episodeNumber: number;
  title?: string;
  anime: {
    _id: string;
    title: string;
    slug: string;
    posterUrl?: string;
  };
  downloadSources?: DownloadSource[];
}

interface Anime {
  _id: string;
  title: string;
  slug: string;
}

async function fetchDownloadData(episodeId: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "";
  const res = await fetch(`${base}/api/downloads/episode/${episodeId}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default function DownloadPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<{ episode: Episode; anime: Anime } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchDownloadData(params.id).then((d) => {
      setData(d || null);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-4">
          <Clock size={32} className="text-violet-400 animate-spin" />
          <p className="text-muted-foreground">Preparing download...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium">Episode not found</h3>
        <Button onClick={() => router.back()}>Go back</Button>
      </div>
    );
  }

  const { episode, anime } = data;
  const sources = (episode.downloadSources || []).filter((s) => s.isEnabled);
  const activeSource = sources[selectedServer] || sources[0];
  const qualities = activeSource?.qualities || [];
  const currentQuality = qualities[selectedQuality];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/anime/${anime.slug}`}
          className="text-sm text-muted-foreground hover:text-white"
        >
          Back to {anime.title}
        </Link>
        <span className="text-xs text-muted-foreground">/</span>
        <h1 className="text-xl font-bold">Download</h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Download Options */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold">
                    Episode {episode.episodeNumber}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {episode.title || "Untitled Episode"}
                  </p>
                </div>
                <Badge variant={sources.length > 0 ? "default" : "destructive"}>
                  {sources.length} Server(s) Available
                </Badge>
              </div>

              {/* Server Selection */}
              {sources.length > 1 && (
                <div className="mb-6">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
                    Select Server
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {sources.map((s, idx) => (
                      <button
                        key={s.serverName}
                        onClick={() => {
                          setSelectedServer(idx);
                          setSelectedQuality(0);
                          setDownloadUrl(null);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedServer === idx
                            ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                            : "bg-[#0C111D] border border-white/10 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        {s.serverName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quality Selection */}
              <div className="mb-6">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
                  Video Quality
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {qualities.length === 0 ? (
                    <div className="col-span-full text-center py-4 text-muted-foreground">
                      No qualities available for this server
                    </div>
                  ) : (
                    qualities.map((q, idx) => (
                      <button
                        key={`${q.quality}-${idx}`}
                        onClick={() => {
                          setSelectedQuality(idx);
                          setDownloadUrl(q.url);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                          selectedQuality === idx
                            ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20"
                            : "border-white/10 bg-[#0C111D]/40 text-white/70 hover:bg-white/10 hover:border-white/30"
                        }`}
                      >
                        {q.quality}
                        {q.fileSize && (
                          <span className="text-xs ml-1 opacity-70">
                            ({(q.fileSize / (1024 * 1024)).toFixed(1)} MB)
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Download Action */}
              <div className="pt-6 border-t border-white/10">
                {currentQuality ? (
                  <Button
                    onClick={() => {
                      if (downloadUrl) {
                        // User-initiated download
                        const a = document.createElement("a");
                        a.href = downloadUrl;
                        a.download = `${anime.title}_Ep${episode.episodeNumber}_${currentQuality.quality}.mp4`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }
                    }}
                    className="w-full bg-violet-600 hover:bg-violet-700 flex items-center justify-center gap-2 text-lg py-3"
                  >
                    <Download size={20} /> Download {currentQuality.quality}
                  </Button>
                ) : (
                  <Button disabled className="w-full bg-gray-600 flex items-center justify-center gap-2 text-lg py-3">
                    Select a quality first
                  </Button>
                )}
                <p className="text-xs text-muted-foreground mt-3">
                  Clicking download will start the file download directly from an authorized source.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="font-semibold mb-3">Download Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Server</span>
                  <span className="text-white">
                    {activeSource?.serverName || "None available"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Quality</span>
                  <span className="text-white">
                    {currentQuality?.quality || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">File Size</span>
                  <span className="text-white">
                    {currentQuality?.fileSize
                      ? (currentQuality.fileSize / (1024 * 1024)).toFixed(2) + " MB"
                      : "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Format</span>
                  <span className="text-white">MP4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Source</span>
                  <span className="text-violet-400 text-xs flex items-center gap-1">
                    <ShieldCheck size={14} /> Authorized
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Anime Info */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <div className="p-4">
              <Image
                src={anime.posterUrl || "/placeholder-anime.jpg"}
                alt={anime.title}
                className="w-full h-64 object-cover rounded-xl mb-4"
                sizes="200px"
              />
              <h3 className="text-lg font-bold">{anime.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Episode {episode.episodeNumber}
              </p>
              <Link href={`/watch/${episode._id}`}>
                <Button variant="outline" className="w-full">
                  <Play size={18} /> Watch Instead
                </Button>
              </Link>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <h3 className="font-semibold mb-3">Download History</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Sign in to track your downloads.
              </p>
              <Button variant="outline" className="w-full text-sm" onClick={() => router.push("/login")}>
                Sign in
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
