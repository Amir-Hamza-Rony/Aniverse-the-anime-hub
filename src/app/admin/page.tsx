"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Play,
  Download,
  MousePointer,
  Clock,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { apiJson } from "@/lib/api/client";
import { AnimeCard, AnimeSkeleton } from "@/components/anime/anime-card";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  change?: string;
  changePositive?: boolean;
  color?: string;
}

function StatCard({ title, value, icon: Icon, change, changePositive, color }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color || "bg-violet-500/20"}`}>
            <Icon size={20} className={color || "text-violet-500"} />
          </div>
        </div>
        {change && (
          <p className={`text-xs mt-2 font-medium ${changePositive ? "text-green-500" : "text-red-500"}`}>
            {changePositive ? "↑" : "↓"} {change} vs last month
          </p>
        )}
      </div>
    </Card>
  );
}

async function fetchStats() {
  try {
    return await apiJson("/api/analytics");
  } catch {
    return null;
  }
}

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats().then((d) => { setStats(d); setLoading(false); });
  }, []);

  const statCards = [
    {
      title: "Total Anime",
      value: stats?.totalAnime || 0,
      icon: Play,
      change: "12%",
      changePositive: true,
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      change: "8%",
      changePositive: true,
    },
    {
      title: "Streams",
      value: stats?.streamCount || 0,
      icon: MousePointer,
      change: "15%",
      changePositive: true,
    },
    {
      title: "Downloads",
      value: stats?.downloadCount || 0,
      icon: Download,
      change: "5%",
      changePositive: true,
    },
    {
      title: "Ad Clicks",
      value: stats?.adClicks || 0,
      icon: BarChart3,
      change: "22%",
      changePositive: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back to AniVerse admin.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">System Operational</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Activity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                {/* Placeholder for Recharts - simplified */}
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Recharts analytics charts would render here (daily clicks, monthly streams, etc.)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Clock size={16} className="text-violet-400" />
                <div>
                  <p className="text-sm text-white font-medium">New anime added</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Download size={16} className="text-blue-400" />
                <div>
                  <p className="text-sm text-white font-medium">Download started</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users size={16} className="text-green-400" />
                <div>
                  <p className="text-sm text-white font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Featured Anime</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <AnimeSkeleton key={i} />)
              : Array.from({ length: 8 }).map((_, i) => <AnimeSkeleton key={i} />)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
