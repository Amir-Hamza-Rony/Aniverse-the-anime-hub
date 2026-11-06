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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch, apiJson } from "@/lib/api/client";
import { Plus, Trash2, Save, X } from "lucide-react";

interface Source {
  _id: string;
  name: string;
  url: string;
  isActive: boolean;
}

const TYPE = "download";

async function fetchSources(): Promise<Source[]> {
  try {
    const data = await apiJson<{ data: Source[] }>(`/api/storage?type=${TYPE}`);
    return data.data || [];
  } catch {
    return [];
  }
}

export default function AdminDownloadSources() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setSources(await fetchSources());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch(`/api/storage`, {
        method: "POST",
        body: JSON.stringify({ type: TYPE, name, url }),
      });
      if (!res.ok) throw new Error("Failed to create source");
      setOpen(false);
      setName("");
      setUrl("");
      toast.toast({ title: "Source created" });
      await load();
    } catch {
      toast.toast({ title: "Error", description: "Failed to create source" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this source?")) return;
    try {
      const res = await apiFetch(`/api/storage?id=${id}&type=${TYPE}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.toast({ title: "Source deleted" });
      await load();
    } catch {
      toast.toast({ title: "Error", description: "Failed to delete source" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Download Source Management</h1>
          <p className="text-muted-foreground">Manage standalone download sources (R2/S3 URLs).</p>
        </div>
        <Button onClick={() => { setName(""); setUrl(""); setOpen(true); }}>
          <Plus size={20} /> Add Source
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Download Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <TableRow className="border-b border-white/10">
                  <TableHead className="text-left pb-3 text-muted-foreground">Name</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">URL</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">Status</TableHead>
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
                  : sources.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                          No sources found
                        </TableCell>
                      </TableRow>
                    ) : (
                      sources.map((s) => (
                        <TableRow key={s._id} className="border-b border-white/5 hover:bg-white/5">
                          <TableCell className="font-medium text-white">{s.name}</TableCell>
                          <TableCell className="text-muted-foreground text-xs truncate max-w-xs">{s.url}</TableCell>
                          <TableCell>
                            <Badge variant={s.isActive ? "default" : "secondary"}>
                              {s.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleDelete(s._id)}>
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
            <DialogTitle>Add Download Source</DialogTitle>
            <DialogDescription>Add a new download source URL.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">URL</label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." required />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={saving}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={saving}>
                <Save size={18} /> {saving ? "Creating…" : "Create"}
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
