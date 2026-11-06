"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimeCard, AnimeSkeleton } from "@/components/anime/anime-card";
import { Button } from "@/components/ui/button";

interface Anime {
  _id: string;
  title: string;
  slug: string;
  posterUrl?: string;
  bannerUrl?: string;
  releaseYear?: number;
  totalEpisodes?: number;
  rating?: number;
  status?: string;
  synopsis?: string;
}

interface HomeData {
  featured: Anime[];
  trending: Anime[];
  popular: Anime[];
  recentlyUpdated: Anime[];
  latestEpisodes: Anime[];
  latestReleases: Anime[];
  recommended: Anime[];
  recentlyAdded: Anime[];
}

const emptyData: HomeData = {
  featured: [], trending: [], popular: [], recentlyUpdated: [],
  latestEpisodes: [], latestReleases: [], recommended: [], recentlyAdded: [],
};

async function fetchHomeData(): Promise<HomeData> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "";
    const res = await fetch(`${base}/api/anime/home`, {
      cache: "no-store",
    });
    if (!res.ok) return emptyData;
    return (await res.json()) as HomeData;
  } catch {
    return emptyData;
  }
}

const Section = ({
  title,
  items,
  href,
}: {
  title: string;
  items: Anime[];
  href?: string;
}) => (
  <section className="mb-12">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {href && (
        <Link href={href} className="text-sm text-violet-400 hover:text-violet-300 underline underline-offset-4">
          View all
        </Link>
      )}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.length === 0 ? (
        <p className="col-span-full text-center py-8 text-muted-foreground">
          No anime available
        </p>
      ) : (
        items.map((anime) => (
          <AnimeCard key={anime._id} anime={anime as any} />
        ))
      )}
    </div>
  </section>
);

export default function Home() {
  const [data, setData] = useState<HomeData>(emptyData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData().then((d) => { setData(d); setLoading(false); });
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0C111D] border border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={
              data.featured[0]?.bannerUrl ||
              data.featured[0]?.posterUrl ||
              "/placeholder-banner.jpg"
            }
            alt="Hero banner"
            fill
            className="object-cover opacity-60"
            sizes="100vw"
            priority
          />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-end p-8 lg:p-12">
          <div className="lg:w-1/2">
            <span className="inline-block mb-2 px-3 py-1 rounded-full bg-violet-600/20 text-violet-300 text-xs font-medium uppercase tracking-wider">
              Featured
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mt-2 mb-4">
              {data.featured[0]?.title || "Featured Anime"}
            </h1>
            <p className="text-muted-foreground mb-6 max-w-lg line-clamp-3">
              {data.featured[0]?.synopsis ||
                "Discover the best anime universe."}
            </p>
            <div className="flex gap-3">
              <Button size="lg" className="w-auto">
                Watch Now
              </Button>
              <Button variant="outline" size="lg" className="w-auto">
                Add to Watchlist
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
            <Image
              src={data.featured[0]?.posterUrl || "/placeholder-anime.jpg"}
              alt={data.featured[0]?.title || "Poster"}
              className="relative z-10 w-full max-w-[300px] object-cover shadow-2xl"
              sizes="(max-width: 768px) 200px, 300px"
            />
          </div>
        </div>
      </section>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 30 }).map((_, i) => (
            <AnimeSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <Section title="Trending Now" items={data.trending} href="/discovery?sort=trending" />
          <Section title="Most Popular" items={data.popular} href="/discovery?sort=popular" />
          <Section
            title="Recently Updated"
            items={data.recentlyUpdated}
            href="/discovery?sort=updated"
          />
          <Section title="Latest Episodes" items={data.latestEpisodes} />
          <Section
            title="Latest Releases"
            items={data.latestReleases}
            href="/discovery?sort=latest"
          />
          <Section title="Recommended for You" items={data.recommended} />
          <Section
            title="Recently Added"
            items={data.recentlyAdded}
            href="/discovery?sort=added"
          />

          {/* Genre Categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Genre Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                "Action",
                "Adventure",
                "Comedy",
                "Drama",
                "Fantasy",
                "Romance",
                "Sci-Fi",
                "Thriller",
              ].map((genre) => (
                <Link
                  key={genre}
                  href={`/discovery?genre=${encodeURIComponent(genre)}`}
                  className="group p-4 rounded-xl border border-white/5 bg-[#0C111D]/50 hover:bg-[#0C111D]/80 hover:border-violet-500/50 transition-all"
                >
                  <div className="h-12 w-12 rounded-lg bg-violet-600/20 flex items-center justify-center group-hover:bg-violet-600 transition-colors mb-3">
                    <span className="text-sm">{genre.charAt(0)}</span>
                  </div>
                  <h3 className="font-medium text-white group-hover:text-violet-400 transition-colors">
                    {genre}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
