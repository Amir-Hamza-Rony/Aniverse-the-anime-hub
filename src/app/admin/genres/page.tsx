"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { apiFetch, apiJson } from "@/lib/api/client";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

interface Genre {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

async function fetchGenres(): Promise<Genre[]> {
  try {
    const data = await apiJson<{ data: Genre[] }>("/api/genres");
    return data.data || [];
  } catch {
    return [];
  }
}

export default function AdminGenres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Genre | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setGenres(await fetchGenres());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = editing
        ? await apiFetch(`/api/genres/${editing._id}`, {
            method: "PUT",
            body: JSON.stringify({ name, slug, description }),
          })
        : await apiFetch(`/api/genres`, {
            method: "POST",
            body: JSON.stringify({ name, slug, description }),
          });
      if (!res.ok) throw new Error("Failed to save genre");
      setOpen(false);
      setEditing(null);
      setName("");
      setSlug("");
      setDescription("");
      toast.toast({ title: editing ? "Genre updated" : "Genre created" });
      await load();
    } catch {
      toast.toast({ title: "Error", description: "Failed to save genre" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this genre?")) return;
    try {
      const res = await apiFetch(`/api/genres/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.toast({ title: "Genre deleted" });
      await load();
    } catch {
      toast.toast({ title: "Error", description: "Failed to delete genre" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Genre Management</h1>
          <p className="text-muted-foreground">Manage anime genres.</p>
        </div>
        <Button onClick={() => { setEditing(null); setName(""); setSlug(""); setDescription(""); setOpen(true); }}>
          <Plus size={20} /> Add Genre
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Genres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <TableRow className="border-b border-white/10">
                  <TableHead className="text-left pb-3 text-muted-foreground">Name</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">Slug</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">Description</TableHead>
                  <TableHead className="text-right pb-3 text-muted-foreground">Actions</TableHead>
                </TableRow>
              </thead>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ))
                  : genres.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                          No genres found
                        </TableCell>
                      </TableRow>
                    ) : (
                      genres.map((g) => (
                        <TableRow key={g._id} className="border-b border-white/5 hover:bg-white/5">
                          <TableCell className="font-medium text-white">{g.name}</TableCell>
                          <TableCell className="text-muted-foreground">{g.slug}</TableCell>
                          <TableCell className="text-muted-foreground">{g.description || "—"}</TableCell>
                          <TableCell className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => {
                              setEditing(g);
                              setName(g.name);
                              setSlug(g.slug);
                              setDescription(g.description || "");
                              setOpen(true);
                            }}>
                              <Edit2 size={16} />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(g._id)}>
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
            <DialogTitle>{editing ? "Edit Genre" : "Add Genre"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update genre details." : "Create a new genre."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Slug</label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="action" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Description</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
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
