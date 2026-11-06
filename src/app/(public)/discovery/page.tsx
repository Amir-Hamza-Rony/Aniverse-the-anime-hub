"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Filter, SlidersHorizontal, Clock, Film, List } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { AnimeCard, AnimeSkeleton } from "@/components/anime/anime-card";
import { Card } from "@/components/ui/card";

interface Anime {
  _id: string;
  title: string;
  slug: string;
  posterUrl?: string;
  releaseYear?: number;
  totalEpisodes?: number;
  rating?: number;
  status?: string;
  type?: string;
  synopsis?: string;
}

interface FetchParams {
  page: number;
  limit: number;
  q?: string;
  genre?: string;
  year?: string;
  status?: string;
  type?: string;
  sort?: string;
}

async function fetchAnime(params: FetchParams) {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page));
  searchParams.set("limit", String(params.limit));
  if (params.q) searchParams.set("q", params.q);
  if (params.genre) searchParams.set("genre", params.genre);
  if (params.year) searchParams.set("year", params.year);
  if (params.status) searchParams.set("status", params.status);
  if (params.type) searchParams.set("type", params.type);
  if (params.sort) searchParams.set("sort", params.sort);

  const base = process.env.NEXT_PUBLIC_APP_URL || "";
  const res = await fetch(`${base}/api/anime?${searchParams}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch anime");
  return res.json();
}

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Cancelled", value: "CANCELLED" },
];

const TYPE_OPTIONS = [
  { label: "All Types", value: "" },
  { label: "TV", value: "TV" },
  { label: "Movie", value: "MOVIE" },
  { label: "OVA", value: "OVA" },
  { label: "ONA", value: "ONA" },
  { label: "Special", value: "SPECIAL" },
];

const SORT_OPTIONS = [
  { label: "Popularity", value: "popular" },
  { label: "Latest", value: "latest" },
  { label: "Rating", value: "rating" },
  { label: "Recently Added", value: "added" },
];

export default function Discovery() {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAnime({
        page, limit, q: q || undefined, genre: genre || undefined,
        year: year || undefined, status: status || undefined,
        type: type || undefined, sort,
      });
      setAnime(data.data || data.anime || []);
      setTotal(data.total || 0);
    } catch {
      setAnime([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, q, genre, year, status, type, sort]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-start gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Filters
              </h3>
              <Button
                onClick={() => setFiltersOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-2 text-left bg-[#0C111D] border-white/10 hover:border-white/20"
              >
                <SlidersHorizontal size={16} />
                <span>Filters</span>
              </Button>
            </div>

            {filtersOpen && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">Search</label>
                  <Input
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search anime..."
                    className="bg-[#0C111D] border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">Genre</label>
                  <Select value={genre} onValueChange={(v) => { setGenre(v); setPage(1); }}>
                    <option value="">All Genres</option>
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Romance">Romance</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Thriller">Thriller</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">Release Year</label>
                  <Select value={year} onValueChange={(v) => { setYear(v); setPage(1); }}>
                    <option value="">All Years</option>
                    {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">Status</label>
                  <Select
                    value={status}
                    onValueChange={(v) => { setStatus(v); setPage(1); }}
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">Type</label>
                  <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
                    {TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">Sort By</label>
                  <Select
                    value={sort}
                    onValueChange={(v) => { setSort(v); setPage(1); }}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Browse Anime</h1>
              <p className="text-muted-foreground">
                {total} anime found
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="hidden lg:flex">
                <List size={16} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loading
              ? Array.from({ length: 15 }).map((_, i) => <AnimeSkeleton key={i} />)
              : anime.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <Search size={48} className="mx-auto mb-3 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No anime found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search.</p>
                </div>
              ) : (
                anime.map((a) => <AnimeCard key={a._id} anime={a as any} />)
              )}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-between">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
