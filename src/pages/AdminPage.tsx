import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Download, BarChart3, QrCode, ExternalLink, Plus, Pencil, Trash2, LogOut, ImagePlus, Save, X } from "lucide-react";
import ParkHeader from "@/components/ParkHeader";
import ParkFooter from "@/components/ParkFooter";
import { useAuth } from "@/hooks/useAuth";
import { useZones, ZoneRow } from "@/hooks/useZones";
import { getVisitStats } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

interface ZoneFormData {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  highlights: string;
  facts: string;
  display_order: number;
}

const emptyForm: ZoneFormData = {
  slug: "",
  name: "",
  tagline: "",
  description: "",
  icon: "🌿",
  highlights: "",
  facts: '[{"label":"","value":""}]',
  display_order: 0,
};

function zoneToForm(zone: ZoneRow): ZoneFormData {
  return {
    slug: zone.slug,
    name: zone.name,
    tagline: zone.tagline,
    description: zone.description,
    icon: zone.icon,
    highlights: zone.highlights.join("\n"),
    facts: JSON.stringify(zone.facts, null, 2),
    display_order: zone.display_order,
  };
}

const AdminPage = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: zones = [], isLoading: zonesLoading } = useZones();
  const [tab, setTab] = useState<"zones" | "qr" | "analytics">("zones");
  const stats = getVisitStats();
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Zone form state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ZoneRow | null>(null);
  const [form, setForm] = useState<ZoneFormData>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  if (loading || zonesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg text-destructive font-semibold">Access Denied</p>
        <p className="text-muted-foreground">You don't have admin privileges.</p>
        <Button variant="outline" onClick={() => { signOut(); navigate("/login"); }}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>
    );
  }

  const openCreate = () => {
    setEditingZone(null);
    setForm({ ...emptyForm, display_order: zones.length });
    setImageFile(null);
    setDialogOpen(true);
  };

  const openEdit = (zone: ZoneRow) => {
    setEditingZone(zone);
    setForm(zoneToForm(zone));
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let image_url = editingZone?.image_url ?? null;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${form.slug || Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("zone-images")
          .upload(path, imageFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("zone-images").getPublicUrl(path);
        image_url = urlData.publicUrl;
      }

      const highlights = form.highlights.split("\n").map((h) => h.trim()).filter(Boolean);
      let facts: any[];
      try {
        facts = JSON.parse(form.facts);
      } catch {
        toast({ title: "Invalid facts JSON", variant: "destructive" });
        setSaving(false);
        return;
      }

      const payload = {
        slug: form.slug,
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        icon: form.icon,
        highlights,
        facts,
        image_url,
        display_order: form.display_order,
      };

      if (editingZone) {
        const { error } = await supabase.from("zones").update(payload).eq("id", editingZone.id);
        if (error) throw error;
        toast({ title: "Zone updated" });
      } else {
        const { error } = await supabase.from("zones").insert(payload);
        if (error) throw error;
        toast({ title: "Zone created" });
      }

      queryClient.invalidateQueries({ queryKey: ["zones"] });
      setDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (zone: ZoneRow) => {
    if (!confirm(`Delete "${zone.name}"?`)) return;
    const { error } = await supabase.from("zones").delete().eq("id", zone.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Zone deleted" });
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Nyandungu QR Codes</title>
      <style>
        body { font-family: sans-serif; padding: 40px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .card { border: 2px solid #2d6a4f; border-radius: 12px; padding: 30px; text-align: center; page-break-inside: avoid; }
        .card h2 { margin: 16px 0 4px; font-size: 22px; }
        .card p { color: #666; font-size: 14px; }
        svg { width: 200px; height: 200px; }
      </style></head><body>
      <h1 style="text-align:center;margin-bottom:30px;">Nyandungu Eco-Park — Scan & Explore</h1>
      <div class="grid">`);
    zones.forEach((zone) => {
      const svg = document.querySelector(`[data-qr="${zone.slug}"] svg`);
      w.document.write(`<div class="card">${svg?.outerHTML ?? ""}<h2>${zone.icon} ${zone.name}</h2><p>${zone.tagline}</p></div>`);
    });
    w.document.write("</div></body></html>");
    w.document.close();
    w.print();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <ParkHeader />

      <div className="container mx-auto flex-1 px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <Button variant="outline" size="sm" onClick={() => { signOut(); navigate("/login"); }}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2">
          <Button variant={tab === "zones" ? "default" : "outline"} onClick={() => setTab("zones")}>
            <Pencil className="mr-2 h-4 w-4" /> Manage Zones
          </Button>
          <Button variant={tab === "qr" ? "default" : "outline"} onClick={() => setTab("qr")}>
            <QrCode className="mr-2 h-4 w-4" /> QR Codes
          </Button>
          <Button variant={tab === "analytics" ? "default" : "outline"} onClick={() => setTab("analytics")}>
            <BarChart3 className="mr-2 h-4 w-4" /> Analytics
          </Button>
        </div>

        {/* ZONES TAB */}
        {tab === "zones" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">Add, edit, or delete park zones.</p>
              <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" /> Add Zone
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {zones.map((zone) => (
                <Card key={zone.id}>
                  <CardContent className="flex items-center gap-4 pt-6">
                    {zone.image_url ? (
                      <img src={zone.image_url} alt={zone.name} className="h-16 w-16 rounded-lg object-cover" />
                    ) : (
                      <span className="text-4xl">{zone.icon}</span>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{zone.name}</p>
                      <p className="text-sm text-muted-foreground">{zone.tagline}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEdit(zone)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="text-destructive" onClick={() => handleDelete(zone)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Zone form dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle className="font-display">{editingZone ? "Edit Zone" : "Create Zone"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Slug (URL)</Label>
                      <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="wetland-trail" />
                    </div>
                    <div>
                      <Label>Icon (emoji)</Label>
                      <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🌿" />
                    </div>
                  </div>
                  <div>
                    <Label>Name</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Wetland Trail" />
                  </div>
                  <div>
                    <Label>Tagline</Label>
                    <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
                  </div>
                  <div>
                    <Label>Highlights (one per line)</Label>
                    <Textarea value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} rows={4} placeholder="Wooden boardwalks&#10;Indigenous plants" />
                  </div>
                  <div>
                    <Label>Facts (JSON array)</Label>
                    <Textarea value={form.facts} onChange={(e) => setForm({ ...form, facts: e.target.value })} rows={4} className="font-mono text-xs" />
                  </div>
                  <div>
                    <Label>Display Order</Label>
                    <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <Label>Zone Image</Label>
                    <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                      <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* QR TAB */}
        {tab === "qr" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">Print these QR codes and place them in weatherproof frames at each zone.</p>
              <Button onClick={handlePrint}>
                <Download className="mr-2 h-4 w-4" /> Print All
              </Button>
            </div>
            <div ref={printRef} className="grid gap-6 sm:grid-cols-2">
              {zones.map((zone) => {
                const url = `${BASE_URL}/zone/${zone.slug}`;
                return (
                  <Card key={zone.id}>
                    <CardHeader className="text-center">
                      <CardTitle className="font-display text-xl">{zone.icon} {zone.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{zone.tagline}</p>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-3" data-qr={zone.slug}>
                      <QRCodeSVG value={url} size={180} bgColor="transparent" fgColor="hsl(152, 45%, 28%)" />
                      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition">
                        <ExternalLink className="h-3 w-3" /> Open Direct Link
                      </a>
                      <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground break-all">{url}</code>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* ANALYTICS TAB */}
        {tab === "analytics" && (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="font-display text-4xl font-bold text-primary">{stats.totalToday}</div>
                  <p className="text-sm text-muted-foreground">Visits Today</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="font-display text-4xl font-bold text-primary">{stats.totalAll}</div>
                  <p className="text-sm text-muted-foreground">Total Visits</p>
                </CardContent>
              </Card>
            </div>
            <h3 className="mb-3 font-display text-xl font-semibold text-foreground">By Zone</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {zones.map((zone) => {
                const zoneStats = stats.byZone.find((b) => b.zoneId === zone.slug);
                return (
                  <Card key={zone.id}>
                    <CardContent className="flex items-center gap-4 pt-6">
                      <span className="text-3xl">{zone.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">{zone.name}</p>
                        <p className="text-sm text-muted-foreground">Today: {zoneStats?.today ?? 0} · Total: {zoneStats?.total ?? 0}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {stats.dailyTotals.length > 0 && (
              <>
                <h3 className="mb-3 mt-8 font-display text-xl font-semibold text-foreground">Daily Log</h3>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-foreground">Date</th>
                        <th className="px-4 py-2 text-right font-medium text-foreground">Visits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.dailyTotals.map((d) => (
                        <tr key={d.date} className="border-t">
                          <td className="px-4 py-2 text-muted-foreground">{d.date}</td>
                          <td className="px-4 py-2 text-right font-semibold text-foreground">{d.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <ParkFooter />
    </div>
  );
};

export default AdminPage;
