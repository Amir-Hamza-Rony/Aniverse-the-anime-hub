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

interface Episode {
  _id: string;
  anime: string | { _id: string; title: string };
  animeTitle?: string;
  episodeNumber: number;
  title?: string;
  description?: string;
  duration?: number;
  thumbnailUrl?: string;
  subtitles?: string[];
  isPublished: boolean;
}

interface AnimeOption {
  _id: string;
  title: string;
}

async function fetchEpisodes(): Promise<Episode[]> {
  try {
    const data = await apiJson<{ data: Episode[] }>("/api/episodes?limit=100");
    return data.data || [];
  } catch {
    return [];
  }
}

async function fetchAnimeList(): Promise<AnimeOption[]> {
  try {
    const data = await apiJson<{ data: AnimeOption[] }>("/api/anime?limit=100");
    return data.data || [];
  } catch {
    return [];
  }
}

export default function AdminEpisodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [animeOptions, setAnimeOptions] = useState<AnimeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Episode | null>(null);
  const [anime, setAnime] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [subtitles, setSubtitles] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [eps, animeList] = await Promise.all([fetchEpisodes(), fetchAnimeList()]);
      setEpisodes(eps);
      setAnimeOptions(animeList);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setEditing(null);
    setAnime("");
    setEpisodeNumber("");
    setTitle("");
    setDescription("");
    setDuration("");
    setThumbnailUrl("");
    setSubtitles("");
    setIsPublished(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body: any = {
        anime,
        episodeNumber: parseInt(episodeNumber, 10),
        title,
        description,
        duration: duration ? parseInt(duration, 10) : undefined,
        thumbnailUrl,
        subtitles: subtitles ? subtitles.split(",").map((s) => s.trim()).filter(Boolean) : [],
        isPublished,
      };
      const res = editing
        ? await apiFetch(`/api/episodes/${editing._id}`, {
            method: "PUT",
            body: JSON.stringify(body),
          })
        : await apiFetch(`/api/episodes`, {
            method: "POST",
            body: JSON.stringify(body),
          });
      if (!res.ok) throw new Error("Failed to save episode");
      resetForm();
      setOpen(false);
      toast.toast({ title: editing ? "Episode updated" : "Episode created" });
      await load();
    } catch {
      toast.toast({ title: "Error", description: "Failed to save episode" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this episode?")) return;
    try {
      const res = await apiFetch(`/api/episodes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.toast({ title: "Episode deleted" });
      await load();
    } catch {
      toast.toast({ title: "Error", description: "Failed to delete episode" });
    }
  };

  const animeTitleOf = (ep: Episode) => {
    if (ep.animeTitle) return ep.animeTitle;
    if (typeof ep.anime === "object") return ep.anime.title;
    const found = animeOptions.find((a) => a._id === ep.anime);
    return found ? found.title : ep.anime;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Episode Management</h1>
          <p className="text-muted-foreground">Manage episodes and video sources.</p>
        </div>
        <Button onClick={resetForm}>
          <Plus size={20} /> Add Episode
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Episodes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <TableRow className="border-b border-white/10">
                  <TableHead className="text-left pb-3 text-muted-foreground">Anime</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">Episode</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">Title</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">Status</TableHead>
                  <TableHead className="text-right pb-3 text-muted-foreground">Actions</TableHead>
                </TableRow>
              </thead>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={5} className="h-20 text-center text-muted-foreground">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ))
                  : episodes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          No episodes found
                        </TableCell>
                      </TableRow>
                    ) : (
                      [...episodes].sort((a, b) => a.episodeNumber - b.episodeNumber).map((ep) => (
                        <TableRow key={ep._id} className="border-b border-white/5 hover:bg-white/5">
                          <TableCell className="text-muted-foreground">{animeTitleOf(ep)}</TableCell>
                          <TableCell className="font-medium text-white">#{ep.episodeNumber}</TableCell>
                          <TableCell className="text-muted-foreground">{ep.title || "—"}</TableCell>
                          <TableCell>
                            <Badge variant={ep.isPublished ? "default" : "secondary"}>
                              {ep.isPublished ? "Published" : "Unpublished"}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => {
                              setEditing(ep);
                              setAnime(typeof ep.anime === "object" ? ep.anime._id : ep.anime);
                              setEpisodeNumber(String(ep.episodeNumber));
                              setTitle(ep.title || "");
                              setDescription(ep.description || "");
                              setDuration(ep.duration ? String(ep.duration) : "");
                              setThumbnailUrl(ep.thumbnailUrl || "");
                              setSubtitles((ep.subtitles || []).join(", "));
                              setIsPublished(ep.isPublished);
                              setOpen(true);
                            }}>
                              <Edit2 size={16} />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(ep._id)}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Episode" : "Add Episode"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update episode details." : "Create a new episode."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Anime</label>
              <Select value={anime} onValueChange={setAnime}>
                <option value="">Select anime</option>
                {animeOptions.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.title}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Episode Number</label>
              <Input type="number" value={episodeNumber} onChange={(e) => setEpisodeNumber(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Description</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Duration (min)</label>
                <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Thumbnail URL</label>
                <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Subtitles</label>
              <Input
                value={subtitles}
                onChange={(e) => setSubtitles(e.target.value)}
                placeholder="sub1.vtt, sub2.vtt"
                className="bg-[#080B12] border-white/10 text-white"
              />
              <p className="text-xs text-muted-foreground">Comma-separated subtitle URLs.</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Published</label>
              <Select value={String(isPublished)} onValueChange={(v) => setIsPublished(v === "true")}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
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
