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
import { apiJson } from "@/lib/api/client";
import { Edit2, Save, X } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const ROLES = ["USER", "ADMIN", "SUPER_ADMIN"] as const;

async function fetchUsers(): Promise<User[]> {
  try {
    const data = await apiJson<{ data: User[] }>("/api/users");
    return data.data || [];
  } catch {
    return [];
  }
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [role, setRole] = useState("USER");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await fetchUsers());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const res = await apiFetch("/api/users", {
        method: "PATCH",
        body: JSON.stringify({ userId: editing._id, role, isActive }),
      });
      if (!res.ok) throw new Error("Failed to update user");
      setOpen(false);
      setEditing(null);
      toast.toast({ title: "User updated" });
      await load();
    } catch {
      toast.toast({ title: "Error", description: "Failed to update user" });
    } finally {
      setSaving(false);
    }
  };

  const roleBadge = (r: string) => {
    switch (r) {
      case "SUPER_ADMIN": return <Badge variant="destructive">{r}</Badge>;
      case "ADMIN": return <Badge variant="secondary">{r}</Badge>;
      default: return <Badge>{r}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage platform users.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <TableRow className="border-b border-white/10">
                  <TableHead className="text-left pb-3 text-muted-foreground">Name</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">Email</TableHead>
                  <TableHead className="text-left pb-3 text-muted-foreground">Role</TableHead>
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
                  : users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((u) => (
                        <TableRow key={u._id} className="border-b border-white/5 hover:bg-white/5">
                          <TableCell className="font-medium text-white">{u.name}</TableCell>
                          <TableCell className="text-muted-foreground">{u.email}</TableCell>
                          <TableCell>{roleBadge(u.role)}</TableCell>
                          <TableCell>
                            <Badge variant={u.isActive ? "default" : "secondary"}>
                              {u.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => {
                              setEditing(u);
                              setRole(u.role as "USER" | "ADMIN" | "SUPER_ADMIN");
                              setIsActive(u.isActive);
                              setOpen(true);
                            }}>
                              <Edit2 size={16} />
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
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Change role and account status.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Role</label>
              <Select value={role} onValueChange={setRole}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Status</label>
              <Select value={isActive ? "true" : "false"} onValueChange={(v) => setIsActive(v === "true")}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={saving}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={saving}>
                <Save size={18} /> {saving ? "Saving…" : "Update"}
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
