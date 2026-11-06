"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Clock, Star, User, Building2, PlayCircle, Shell, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimeSkeleton } from "@/components/anime/anime-card";

interface Anime {
  _id: string;
  title: string;
  slug: string;
  alternativeTitles: string[];
  synopsis: string;
  genres: Array<{ _id: string; name: string } | string>;
  releaseYear: number;
  status: string;
  rating: number;
  type: string;
  studio: string;
  totalEpisodes: number;
  totalSeasons: number;
  posterUrl?: string;
  bannerUrl?: string;
  episodes?: Array<{
    _id: string;
    episodeNumber: number;
    title?: string;
    thumbnailUrl?: string;
  }>;
}

async function fetchAnime(slug: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "";
  const res = await fetch(`${base}/api/anime/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default function AnimeDetails({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnime(params.slug).then((data) => {
      setAnime(data?.anime || data || null);
      setLoading(false);
    });
  }, [params.slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="aspect-video bg-[#0C111D] rounded-xl">
              <AnimeSkeleton />
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <AnimeSkeleton className="h-48" />
            <AnimeSkeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-muted-foreground text-4xl mb-2">❌</div>
        <h3 className="text-lg font-medium">Anime not found</h3>
        <Button onClick={() => router.back()}>Go back</Button>
      </div>
    );
  }

  const genreList = Array.isArray(anime.genres)
    ? anime.genres.map((g: any) => (typeof g === "string" ? g : g.name))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
      {/* Banner */}
      <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden border border-white/10 mb-6">
        {anime.bannerUrl ? (
          <Image src={anime.bannerUrl} alt={anime.title} fill className="object-cover" sizes="100vw" />
        ) : (
          <div className="h-full bg-[#0C111D] flex items-center justify-center text-muted-foreground">
            No banner available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/40 to-transparent" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Poster + Info */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            <div className="lg:w-96 shrink-0 relative">
              <Image
                src={anime.posterUrl || "/placeholder-anime.jpg"}
                alt={anime.title}
                className="w-full rounded-xl shadow-2xl object-cover"
                sizes="(max-width: 1024px) 100vw, 360px"
                priority
              />
              <div className="absolute -bottom-4 right-0 flex gap-2">
                <Button className="w-auto">
                  <PlayCircle size={20} /> Watch Now
                </Button>
                <Button variant="outline" className="w-auto">
                  Download
                </Button>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                {genreList.map((g) => (
                  <Badge key={g} variant="outline">{g}</Badge>
                ))}
                <Badge variant={anime.status === "ONGOING" ? "default" : "secondary"}>
                  {anime.status}
                </Badge>
                <Badge variant="outline">{anime.type}</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-3xl">{anime.title}</CardTitle>
                {anime.alternativeTitles.length > 0 && (
                  <p className="text-muted-foreground text-sm mt-1 italic">
                    {anime.alternativeTitles.join(", ")}
                  </p>
                )}
              </CardHeader>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Release Year</span>
                  <span className="text-white">{anime.releaseYear}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Type</span>
                  <span className="text-white">{anime.type}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-white">{anime.status}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Episodes</span>
                  <span className="text-white">{anime.totalEpisodes}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Seasons</span>
                  <span className="text-white">{anime.totalSeasons}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Studio</span>
                  <span className="text-white">{anime.studio || "—"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="text-white">
                    <Star size={16} className="mr-1 text-yellow-400" /> {anime.rating}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Synopsis</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {anime.synopsis}
                </p>
              </div>
              <div className="mt-4 flex gap-3 text-sm">
                <a href="mailto:support@aniverse.local" className="text-violet-400 hover:underline flex items-center gap-1">
                  <Mail size={16} /> Contact Studio
                </a>
              </div>
            </div>
          </div>

          {/* Episodes */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Episodes</h3>
              <Link href={`/watch/${anime.episodes?.[0]?._id || anime._id}-1`} className="text-sm text-violet-400 underline">
                View all episodes
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {anime.episodes && anime.episodes.length > 0 ? (
                anime.episodes.slice(0, 12).map((ep) => (
                  <Link
                    key={ep._id}
                    href={`/watch/${ep._id}`}
                    className="group flex flex-col gap-2 p-3 rounded-xl border border-white/5 bg-[#0C111D]/50 hover:border-violet-500/50 hover:bg-[#0C111D]/80"
                  >
                    <div className="aspect-video bg-[#111827] rounded-lg overflow-hidden relative">
                      {ep.thumbnailUrl ? (
                        <Image src={ep.thumbnailUrl} fill className="object-cover" />
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                          EP {ep.episodeNumber}
                        </div>
                      )}
                      <div className="absolute top-1 right-1 bg-black/60 text-xs px-1.5 py-0.5 rounded">
                        EP {ep.episodeNumber}
                      </div>
                    </div>
                    <div className="text-sm font-medium line-clamp-1 text-white">{ep.title || `Episode ${ep.episodeNumber}`}</div>
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No episodes available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Related */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Anime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg border border-white/5 hover:bg-[#0C111D]/40 transition-colors group">
                    <div className="w-20 h-28 flex-shrink-0 rounded-lg bg-[#111827] overflow-hidden">
                      <Image
                        src="/placeholder-anime.jpg"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-sm font-medium line-clamp-1 text-white">
                        Related Anime {i + 1}
                      </div>
                      <div className="text-xs text-muted-foreground">TV • 2024</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
