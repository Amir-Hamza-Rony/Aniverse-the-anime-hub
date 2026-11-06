"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Download, ShieldCheck, Clock } from "lucide-react";

type Placement = "watch" | "download" | "server";

interface RedirectPageProps {
  params: { type: string; id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function RedirectPage({
  params,
  searchParams,
}: RedirectPageProps) {
  const router = useRouter();
  const [ad, setAd] = useState<{
    name: string;
    smartlinkUrl: string;
    placementType: string;
    destination?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const type = params.type as Placement;
  const id = params.id;

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_APP_URL || "";
        const res = await fetch(
          `${base}/api/advertisements?placementType=${type.toUpperCase()}&animeId=${id}`,
          { cache: "no-store" },
        );
        if (res.ok) {
          const data = await res.json();
          setAd(data.advertisement || null);
        }
      } catch {
        setError("Failed to load advertisement");
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [type, id]);

  const handleContinue = () => {
    if (!ad) return;
    // Record click
    const base = process.env.NEXT_PUBLIC_APP_URL || "";
    fetch(`${base}/api/advertisements/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        advertisementId: ad._id,
        placementType: type.toUpperCase(),
        animeId: id,
      }),
    }).catch(() => {});

    // In production, open the Adsterra smartlink in a new tab, then proceed to destination
    if (ad.smartlinkUrl) {
      window.open(ad.smartlinkUrl, "_blank");
    }

    // Proceed to the actual destination based on type
    if (type === "watch") {
      router.push(`/watch/${id}`);
    } else if (type === "download") {
      router.push(`/download/${id}`);
    } else {
      router.push(`/`);
    }
  };

  const placementLabel = type === "watch" ? "Watch" : type === "download" ? "Download" : "Server Selection";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080B12]">
        <div className="flex flex-col items-center gap-3">
          <Clock size={32} className="text-violet-400 animate-spin" />
          <p className="text-muted-foreground">Preparing...</p>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    // If no ad configured, proceed directly to destination
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080B12]">
        <Card className="w-full max-w-md bg-[#0C111D] border border-white/10">
          <CardHeader>
            <CardTitle>Proceeding to {placementLabel}</CardTitle>
            <CardDescription>
              No advertisement configured for this placement. Proceeding directly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              You will be redirected to the authorized {placementLabel.toLowerCase()} destination.
            </p>
          </CardContent>
          <div className="p-4">
            <Button onClick={handleContinue} className="w-full bg-violet-600">
              Continue to {placementLabel}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080B12] p-4">
      <Card className="w-full max-w-md bg-[#0C111D] border border-violet-500/30 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={20} className="text-violet-400" />
            <h2 className="text-lg font-bold text-white">Advertisement</h2>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            Before you proceed to {placementLabel.toLowerCase()}, please visit our sponsor.
          </p>
          <div className="bg-[#080B12]/50 rounded-lg p-4 mb-6 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded bg-violet-600 flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Sponsored</div>
                <div className="text-sm font-medium text-white">{ad.name}</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {ad.smartlinkUrl}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                if (ad.smartlinkUrl) window.open(ad.smartlinkUrl, "_blank");
              }}
              variant="outline"
              className="flex-1"
            >
              Visit Sponsor
            </Button>
            <Button onClick={handleContinue} className="flex-1 bg-violet-600 hover:bg-violet-700">
              Continue to {placementLabel}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6 text-center">
            AniVerse only displays advertisements for authorized content placement.
          </p>
        </div>
      </Card>
    </div>
  );
}
