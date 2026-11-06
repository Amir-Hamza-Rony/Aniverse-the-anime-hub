"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Play,
  Download,
  Users,
  BarChart,
  Settings,
  Shield,
  MousePointer,
  LogOut,
  ChevronLeft,
  Menu,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";

const ADMIN_NAV = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Anime", href: "/admin/anime", icon: Film },
  { name: "Episodes", href: "/admin/episodes", icon: Play },
  { name: "Genres", href: "/admin/genres", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Advertisements", href: "/admin/advertisements", icon: Shield },
  { name: "Video Sources", href: "/admin/video-sources", icon: MousePointer },
  { name: "Download Sources", href: "/admin/download-sources", icon: Download },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const user = { name: "Admin User", email: "admin@aniverse.local", role: "SUPER_ADMIN", avatar: undefined };

  return (
    <div className="flex h-screen bg-[#080B12] overflow-hidden">
      {/* Mobile overlay */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileSidebar(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-[#0C111D] border-r border-white/10 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-white">
              A
            </div>
            <span className="font-bold text-white">AniVerse</span>
          </Link>
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation
          </div>
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-violet-600/20 text-violet-400 border border-violet-500/30"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}

          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-6">
            Account
          </div>
          <button
            onClick={() => router.push("/logout")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <Avatar src={user.avatar} alt={user.name} className="bg-violet-600" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative left-0 transition-left duration-300">
        {/* Top nav */}
        <header className="h-16 border-b border-white/10 bg-[#0C111D]/80 backdrop-blur flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setMobileSidebar(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold text-white hidden sm:block">
              {ADMIN_NAV.find((n) => n.href === pathname)?.name || "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 bg-[#080B12] border-white/10 text-white text-sm placeholder:text-muted-foreground focus:ring-violet-600"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-muted-foreground hover:text-white">
                <BellIcon size={20} />
              </button>
              <Avatar src={user.avatar} alt={user.name} className="bg-violet-600 cursor-pointer" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function BellIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
  );
}
