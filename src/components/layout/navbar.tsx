"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Search, User, LogOut, Play, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Browse", href: "/discovery" },
  { name: "Genres", href: "/discovery?type=genre" },
];

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/auth/me`, {
      cache: "no-store",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        setUser(data?.user || null);
        setUserLoaded(true);
      })
      .catch(() => {
        setUserLoaded(true);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/auth/login`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      // Ignore logout errors; clear local state regardless
    }
    setUser(null);
    toast.toast({ title: "Logged out" });
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#080B12]/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-white text-lg">
            A
          </div>
          <span className="text-xl font-bold text-white tracking-tight">AniVerse</span>
        </Link>

        {/* Desktop search + links */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="relative w-[400px]">
            <div className="absolute left-3 top-2.5 text-muted-foreground">
              <Search size={16} />
            </div>
            <Input
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  router.push(`/discovery?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
              className="pl-9 bg-[#0C111D] border-white/10 focus:ring-violet-600 text-white placeholder:text-muted-foreground"
            />
          </div>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href ? "text-violet-400" : "text-muted-foreground hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button className="text-muted-foreground hover:text-white" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={20} />
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="text-sm text-white/80 hover:text-white flex items-center gap-1"
              >
                <LogOut size={16} /> <span>Logout</span>
              </button>
              <Avatar src={user.avatar} alt={user.name} className="bg-violet-600" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#080B12]/95 backdrop-blur-md">
          <div className="absolute top-0 right-0 p-4">
            <button onClick={() => setMobileMenuOpen(false)} className="text-white">
              <X size={24} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="relative mb-6">
              <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    router.push(`/discovery?q=${encodeURIComponent(searchQuery)}`);
                    setMobileMenuOpen(false);
                  }
                }}
                className="pl-9 bg-[#0C111D] border-white/10 text-white placeholder:text-muted-foreground"
              />
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-sm font-medium text-white"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-6 border-t border-white/10 space-y-3">
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm font-medium text-white">
                    <User size={18} className="mr-2" /> Profile
                  </Link>
                  <button onClick={handleLogout} className="block py-3 text-sm font-medium text-red-400 flex items-center gap-2">
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block py-3 text-sm font-medium text-white">
                    <User size={18} className="mr-2" /> Log in
                  </Link>
                  <Link href="/register" className="block py-3 text-sm font-medium text-white">
                    <Plus size={18} className="mr-2" /> Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
