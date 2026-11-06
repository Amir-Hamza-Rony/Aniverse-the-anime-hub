"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Heart, Star } from "lucide-react";
import { AnimeDocument } from "@/types";

export interface AnimeCardProps {
  anime: AnimeDocument;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export function AnimeCard({ anime, isFavorite, onFavoriteToggle }: AnimeCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-violet-500/10 transition-shadow">
      <div className="relative aspect-video overflow-hidden bg-[#0C111D]">
        <Image
          src={anime.posterUrl || "/placeholder-anime.jpg"}
          alt={anime.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end px-4 pb-4">
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white hover:bg-violet-700 transition-colors">
              <Play size={16} />
            </button>
            {onFavoriteToggle && (
              <button
                onClick={onFavoriteToggle}
                className={`w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors ${isFavorite ? "text-red-400" : ""}`}
              >
                <Heart size={16} />
              </button>
            )}
          </div>
        </div>
        <Badge
          variant={anime.status === "ONGOING" ? "default" : "outline"}
          className="absolute top-2 left-2 z-10 text-[10px] uppercase tracking-wider"
        >
          {anime.status}
        </Badge>
      </div>
      <CardHeader className="p-3">
        <CardTitle className="line-clamp-1 text-white">{anime.title}</CardTitle>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          {anime.releaseYear && <span>{anime.releaseYear}</span>}
          <span className="mx-1">•</span>
          {anime.totalEpisodes !== undefined && anime.totalEpisodes > 0 && (
            <>
              <span>{anime.totalEpisodes} eps</span>
              <span className="mx-1">•</span>
            </>
          )}
          {anime.rating && (
            <>
              <Star size={12} className="text-yellow-400" /> {anime.rating}
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="text-sm text-muted-foreground line-clamp-2">
          {anime.synopsis}
        </div>
      </CardContent>
      <CardFooter className="p-3">
        <Link
          href={`/anime/${anime.slug}`}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-violet-600 hover:bg-violet-700 rounded-md text-sm font-medium text-white transition-colors"
        >
          Watch <Play size={14} />
        </Link>
      </CardFooter>
    </Card>
  );
}

export interface AnimeSkeletonProps {}

export function AnimeSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-[#0C111D]">
        <div className="h-full bg-gradient-to-b from-[#0f172a]/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-24 rounded bg-[#111827] animate-pulse" />
        </div>
      </div>
      <CardHeader className="p-3">
        <div className="h-4 w-3/4 rounded bg-[#111827] animate-pulse mb-2" />
        <div className="h-3 w-1/2 rounded bg-[#111827] animate-pulse" />
      </CardHeader>
      <CardContent className="p-3">
        <div className="h-4 w-full rounded bg-[#111827] animate-pulse mb-2" />
        <div className="h-3 w-2/3 rounded bg-[#111827] animate-pulse" />
      </CardContent>
    </Card>
  );
}
