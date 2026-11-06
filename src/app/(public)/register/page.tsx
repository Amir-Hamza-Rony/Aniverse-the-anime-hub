"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const base = process.env.NEXT_PUBLIC_APP_URL || "";
      const res = await fetch(`${base}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      router.push("/");
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080B12] px-4">
      <Card className="w-full max-w-md bg-[#0C111D] border border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Join the AniVerse universe</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-[#080B12] border-white/10 text-white placeholder:text-muted-foreground focus:ring-violet-600"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-[#080B12] border-white/10 text-white placeholder:text-muted-foreground focus:ring-violet-600"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-[#080B12] border-white/10 text-white placeholder:text-muted-foreground focus:ring-violet-600"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters
              </p>
            </div>
            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-70" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <div className="card-footer border-t border-white/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
