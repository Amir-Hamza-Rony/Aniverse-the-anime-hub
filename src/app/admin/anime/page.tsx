"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch, apiJson } from "@/lib/api/client";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

interface Anime {
  _id: string;
  title: string;
  slug: string;
  synopsis: string;
  genres: any[];
  releaseYear: number;
  status: string;
  rating: number;
  type: string;
  studio: string;
  totalEpisodes: number;
  totalSeasons: number;
  posterUrl?: string;
  bannerUrl?: string;
  featured: boolean;
}

const STATUSES = ["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"];
const TYPES = ["TV", "MOVIE", "OVA", "ONA", "SPECIAL"];

async function fetchAnimeList(): Promise<Anime[]> {
  try {
    const data = await apiJson<{ data: Anime[] }>("/api/anime?limit=100");
    return data.data || [];
  } catch {
    return [];
  }
}

export default function AdminAnime() {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Anime | null>(null);
  const [form, setForm] = useState<Partial<Anime>>({});
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAnime(await fetchAnimeList());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setEditing(null);
    setForm({});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body: any = {
        title: form.title,
        alternativeTitles: form.alternativeTitles ? form.alternativeTitles.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        synopsis: form.synopsis,
        genres: form.genres ? form.genres.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        releaseYear: form.releaseYear ? parseInt(String(form.releaseYear), 10) : undefined,
        status: form.status,
        rating: form.rating ? parseFloat(String(form.rating)) : undefined,
        type: form.type,
        studio: form.studio,
        totalEpisodes: form.totalEpisodes ? parseInt(String(form.totalEpisodes), 10) : undefined,
        totalSeasons: form.totalSeasons ? parseInt(String(form.totalSeasons), 10) : undefined,
        posterUrl: form.posterUrl,
        bannerUrl: form.bannerUrl,
        featured: form.featured === true || form.featured === "true",
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
      };
      const res = editing
        ? await apiFetch(`/api/anime/${editing.slug}`, {
            method: "PUT",
            body: JSON.stringify(body),
          })
        : await apiFetch(`/api/anime`, {
            method: "POST",
            body: JSON.stringify(body),
          });
      if (!res.ok) throw new Error("Failed to save anime");
      resetForm();
      setOpen(false);
      toast.toast({ title: editing ? "Anime updated" : "Anime created" });
      await load();
    } catch {
      toast.toast({ title: "Error", description: "Failed to save anime" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this anime?")) return;
    try {
      const res = await apiFetch(`/api/anime/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.toast({ title: "Anime deleted" });
      await load();
    } catch {
      toast.toast({ title: "Error", description: "Failed to delete anime" });
    }
  };

  const statusBadge = (s: string) => (
    <Badge variant={s === "ONGOING" ? "default" : "secondary"}>{s}</Badge>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Anime Management</h1>
          <p className="text-muted-foreground">Manage your anime library.</p>
        </div>
        <Button onClick={resetForm}>
          <Plus size={20} /> Add Anime
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search anime..."
          className="w-80 bg-[#080B12] border-white/10 text-white"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anime List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <TableRow className="border-b border-white/10">
                  <TableHead className="text-left pb-3 text-muted-foreground">Poster</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">Title</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">Status</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">Type</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">Rating</TableHead>
                  <TableHead className="text-right pb-3 text-muted-foreground">Actions</TableHead>
                </TableRow>
              </thead>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="w-24"><div className="h-24 bg-[#111827] rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-16 w-48 bg-[#111827] rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-8 w-24 bg-[#111827] rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-8 w-20 bg-[#111827] rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-8 w-16 bg-[#111827] rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-8 w-32 bg-[#111827] rounded animate-pulse" /></TableCell>
                      </TableRow>
                    ))
                  : anime.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          No anime found
                        </TableCell>
                      </TableRow>
                    ) : (
                      anime.map((a) => (
                        <TableRow key={a._id} className="border-b border-white/5 hover:bg-white/5">
                          <TableCell className="w-24">
                            <img src={a.posterUrl || "/placeholder-anime.jpg"} alt={a.title} className="w-full h-24 object-cover rounded" />
                          </TableCell>
                          <TableCell className="font-medium text-white">{a.title}</TableCell>
                          <TableCell>{statusBadge(a.status)}</TableCell>
                          <TableCell className="text-muted-foreground">{a.type}</TableCell>
                          <TableCell className="text-muted-foreground">{a.rating || "—"}</TableCell>
                          <TableCell className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => {
                              setEditing(a);
                              setForm({
                                title: a.title,
                                alternativeTitles: Array.isArray(a.alternativeTitles) ? a.alternativeTitles.join(", ") : "",
                                synopsis: a.synopsis,
                                genres: Array.isArray(a.genres) ? a.genres.join(", ") : "",
                                releaseYear: a.releaseYear,
                                status: a.status,
                                rating: a.rating,
                                type: a.type,
                                studio: a.studio,
                                totalEpisodes: a.totalEpisodes,
                                totalSeasons: a.totalSeasons,
                                posterUrl: a.posterUrl,
                                bannerUrl: a.bannerUrl,
                                featured: a.featured,
                                seoTitle: a.seoTitle,
                                seoDescription: a.seoDescription,
                              });
                              setOpen(true);
                            }}>
                              <Edit2 size={16} />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(a.slug)}>
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
              </TableBody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-6">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Anime" : "Add Anime"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update anime details." : "Add a new anime to the library."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Title</label>
                <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Status</label>
                <Select value={form.status || "ONGOING"} onValueChange={(v) => setForm({ ...form, status: v })}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Type</label>
                <Select value={form.type || "TV"} onValueChange={(v) => setForm({ ...form, type: v })}>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Release Year</label>
                <Input type="number" value={form.releaseYear ? String(form.releaseYear) : ""} onChange={(e) => setForm({ ...form, releaseYear: e.target.value ? parseInt(e.target.value, 10) : undefined })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Rating (0-10)</label>
                <Input type="number" step="0.1" value={form.rating ? String(form.rating) : ""} onChange={(e) => setForm({ ...form, rating: e.target.value ? parseFloat(e.target.value) : undefined })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Studio</label>
                <Input value={form.studio || ""} onChange={(e) => setForm({ ...form, studio: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Total Episodes</label>
                <Input type="number" value={form.totalEpisodes ? String(form.totalEpisodes) : ""} onChange={(e) => setForm({ ...form, totalEpisodes: e.target.value ? parseInt(e.target.value, 10) : undefined })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Total Seasons</label>
                <Input type="number" value={form.totalSeasons ? String(form.totalSeasons) : ""} onChange={(e) => setForm({ ...form, totalSeasons: e.target.value ? parseInt(e.target.value, 10) : undefined })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Poster URL</label>
                <Input value={form.posterUrl || ""} onChange={(e) => setForm({ ...form, posterUrl: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Banner URL</label>
                <Input value={form.bannerUrl || ""} onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Featured</label>
                <Select value={String(form.featured === true)} onValueChange={(v) => setForm({ ...form, featured: v === "true" })}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Synopsis</label>
              <Input value={form.synopsis || ""} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} className="h-32" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Alternative Titles</label>
                <Input value={form.alternativeTitles || ""} onChange={(e) => setForm({ ...form, alternativeTitles: e.target.value })} placeholder="Title 1, Title 2" />
                <p className="text-xs text-muted-foreground">Comma-separated.</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Genre IDs</label>
                <Input value={form.genres || ""} onChange={(e) => setForm({ ...form, genres: e.target.value })} placeholder="Genre ID 1, Genre ID 2" />
                <p className="text-xs text-muted-foreground">Comma-separated Mongo IDs.</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">SEO Title</label>
              <Input value={form.seoTitle || ""} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">SEO Description</label>
              <Input value={form.seoDescription || ""} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={saving}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={saving}>
                <Save size={18} /> {saving ? "Saving…" : editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
          <DialogClose>
            <X size={24} />
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
