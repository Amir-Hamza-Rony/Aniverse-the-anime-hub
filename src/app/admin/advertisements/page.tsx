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

interface Ad {
  _id: string;
  name: string;
  smartlinkUrl: string;
  placementType: string;
  campaignName?: string;
  priority: number;
  isEnabled: boolean;
  animeId?: string;
  episodeId?: string;
  totalClicks?: number;
}

const PLACEMENT_TYPES = ["WATCH", "DOWNLOAD", "SERVER_SELECTION", "HOMEPAGE", "DETAILS"];

async function fetchAds(): Promise<Ad[]> {
  try {
    const data = await apiJson<{ data: Ad[] }>("/api/advertisements");
    return data.data || [];
  } catch {
    return [];
  }
}

export default function AdminAdvertisements() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Ad | null>(null);
  const [form, setForm] = useState<Partial<Ad>>({});
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAds(await fetchAds());
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
        name: form.name,
        smartlinkUrl: form.smartlinkUrl,
        placementType: form.placementType,
        campaignName: form.campaignName,
        priority: form.priority ? parseInt(String(form.priority), 10) : 0,
        isEnabled: form.isEnabled === true || form.isEnabled === "true",
        animeId: form.animeId || undefined,
        episodeId: form.episodeId || undefined,
      };
      const res = editing
        ? await apiFetch(`/api/advertisements/${editing._id}`, {
            method: "PUT",
            body: JSON.stringify(body),
          })
        : await apiFetch(`/api/advertisements`, {
            method: "POST",
            body: JSON.stringify(body),
          });
      if (!res.ok) throw new Error("Failed to save advertisement");
      resetForm();
      setOpen(false);
      toast.toast({ title: editing ? "Advertisement updated" : "Advertisement created" });
      await load();
    } catch {
      toast.toast({ title: "Error", description: "Failed to save advertisement" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this advertisement?")) return;
    try {
      const res = await apiFetch(`/api/advertisements/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.toast({ title: "Advertisement deleted" });
      await load();
    } catch {
      toast.toast({ title: "Error", description: "Failed to delete advertisement" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Advertisement Management</h1>
          <p className="text-muted-foreground">Manage Adsterra smartlinks and placements.</p>
        </div>
        <Button onClick={resetForm}>
          <Plus size={20} /> Add Advertisement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advertisements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <TableRow className="border-b border-white/10">
                  <TableHead className="text-left pb-3 text-muted-foreground">Name</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">Placement</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">Priority</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">Status</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">Clicks</TableHead>
                  <TableHead className="text-right pb-3 text-muted-foreground">Actions</TableHead>
                </TableRow>
              </thead>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ))
                  : ads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          No advertisements found
                        </TableCell>
                      </TableRow>
                    ) : (
                      ads.map((a) => (
                        <TableRow key={a._id} className="border-b border-white/5 hover:bg-white/5">
                          <TableCell className="font-medium text-white">{a.name}</TableCell>
                          <TableCell className="text-muted-foreground">{a.placementType}</TableCell>
                          <TableCell className="text-muted-foreground">{a.priority}</TableCell>
                          <TableCell>
                            <Badge variant={a.isEnabled ? "default" : "secondary"}>
                              {a.isEnabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{a.totalClicks || 0}</TableCell>
                          <TableCell className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => {
                              setEditing(a);
                              setForm({
                                name: a.name,
                                smartlinkUrl: a.smartlinkUrl,
                                placementType: a.placementType,
                                campaignName: a.campaignName,
                                priority: a.priority,
                                isEnabled: a.isEnabled,
                                animeId: a.animeId,
                                episodeId: a.episodeId,
                              });
                              setOpen(true);
                            }}>
                              <Edit2 size={16} />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(a._id)}>
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
        <DialogContent className="max-w-lg p-6">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Advertisement" : "Add Advertisement"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update Adsterra smartlink placement." : "Register a new Adsterra smartlink placement."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Name</label>
              <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Smartlink URL</label>
              <Input value={form.smartlinkUrl || ""} onChange={(e) => setForm({ ...form, smartlinkUrl: e.target.value })} placeholder="https://..." required />
              <p className="text-xs text-muted-foreground">Adsterra publisher smartlink/direct link.</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Placement Type</label>
              <Select value={form.placementType || "WATCH"} onValueChange={(v) => setForm({ ...form, placementType: v })}>
                {PLACEMENT_TYPES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Campaign Name</label>
                <Input value={form.campaignName || ""} onChange={(e) => setForm({ ...form, campaignName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Priority</label>
                <Input type="number" value={form.priority ? String(form.priority) : ""} onChange={(e) => setForm({ ...form, priority: e.target.value ? parseInt(e.target.value, 10) : 0 })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Anime ID</label>
                <Input value={form.animeId || ""} onChange={(e) => setForm({ ...form, animeId: e.target.value })} placeholder="Mongo ObjectId" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Episode ID</label>
                <Input value={form.episodeId || ""} onChange={(e) => setForm({ ...form, episodeId: e.target.value })} placeholder="Mongo ObjectId" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Enabled</label>
              <Select value={String(form.isEnabled !== false)} onValueChange={(v) => setForm({ ...form, isEnabled: v === "true" })}>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
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
