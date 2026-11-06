"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";
import { apiFetch, apiJson } from "@/lib/api/client";
import { Save } from "lucide-react";

interface SiteSettings {
  _id?: string;
  siteName: string;
  tagline: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  storageProvider: "R2" | "S3" | "NONE";
  advertisingEnabled: boolean;
  homepageSections?: string[];
}

async function fetchSettings(): Promise<SiteSettings> {
  const data = await apiJson<{ settings: SiteSettings }>("/api/settings");
  return data.settings;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [form, setForm] = useState<SiteSettings>({
    siteName: "AniVerse",
    tagline: "Your Universe of Anime",
    description: "",
    seoTitle: "",
    seoDescription: "",
    storageProvider: "NONE",
    advertisingEnabled: false,
    homepageSections: [],
  });

  useEffect(() => {
    fetchSettings()
      .then((s) => {
        setSettings(s);
        setForm({ ...s, homepageSections: s.homepageSections || [] });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch(`/api/settings`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      toast.toast({ title: "Settings saved" });
    } catch {
      toast.toast({ title: "Error", description: "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Website Settings</h1>
          <p className="text-muted-foreground">Configure site-wide settings.</p>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center text-muted-foreground">Loading settings...</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">Site Name</label>
                  <Input
                    value={form.siteName}
                    onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                    className="bg-[#080B12]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">Tagline</label>
                  <Input
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    className="bg-[#080B12]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">Description</label>
                <Input
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="bg-[#080B12]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">Storage Provider</label>
                  <Select
                    value={form.storageProvider}
                    onValueChange={(v) => setForm({ ...form, storageProvider: v as "R2" | "S3" | "NONE" })}
                  >
                    <option value="NONE">None</option>
                    <option value="R2">Cloudflare R2</option>
                    <option value="S3">Amazon S3</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">Advertising</label>
                  <Select
                    value={String(form.advertisingEnabled)}
                    onValueChange={(v) => setForm({ ...form, advertisingEnabled: v === "true" })}
                  >
                    <option value="false">Disabled</option>
                    <option value="true">Enabled</option>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">SEO Title</label>
                <Input
                  value={form.seoTitle || ""}
                  onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                  className="bg-[#080B12]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">SEO Description</label>
                <Input
                  value={form.seoDescription || ""}
                  onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                  className="bg-[#080B12]"
                />
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Badge variant={settings?.advertisingEnabled ? "default" : "secondary"}>
                  {settings?.advertisingEnabled ? "Advertising Enabled" : "Advertising Disabled"}
                </Badge>
                <span className="text-muted-foreground">
                  Adsterra placements are managed in Advertisement Management.
                </span>
              </div>
              <Button type="submit" disabled={saving}>
                <Save size={18} /> {saving ? "Saving…" : "Save Settings"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
