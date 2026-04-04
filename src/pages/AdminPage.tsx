import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, BarChart3, QrCode, ExternalLink } from "lucide-react";
import ParkHeader from "@/components/ParkHeader";
import ParkFooter from "@/components/ParkFooter";
import { zones } from "@/lib/zones";
import { getVisitStats } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

const AdminPage = () => {
  const [tab, setTab] = useState<"qr" | "analytics">("qr");
  const stats = getVisitStats();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const w = window.open("", "_blank");
      if (!w) return;
      w.document.write(`
        <html><head><title>Nyandungu QR Codes</title>
        <style>
          body { font-family: sans-serif; padding: 40px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
          .card { border: 2px solid #2d6a4f; border-radius: 12px; padding: 30px; text-align: center; page-break-inside: avoid; }
          .card h2 { margin: 16px 0 4px; font-size: 22px; }
          .card p { color: #666; font-size: 14px; }
          svg { width: 200px; height: 200px; }
          @media print { .grid { grid-template-columns: 1fr 1fr; } }
        </style></head><body>
        <h1 style="text-align:center;margin-bottom:30px;">Nyandungu Eco-Park — Scan & Explore</h1>
        <div class="grid">
      `);
      zones.forEach((zone) => {
        const url = `${BASE_URL}/zone/${zone.id}`;
        const svg = document.querySelector(`[data-qr="${zone.id}"] svg`);
        w.document.write(`
          <div class="card">
            ${svg?.outerHTML ?? ""}
            <h2>${zone.icon} ${zone.name}</h2>
            <p>${zone.tagline}</p>
          </div>
        `);
      });
      w.document.write("</div></body></html>");
      w.document.close();
      w.print();
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <ParkHeader />

      <div className="container mx-auto flex-1 px-4 py-10">
        <h1 className="mb-6 font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="mb-8 flex gap-2">
          <Button variant={tab === "qr" ? "default" : "outline"} onClick={() => setTab("qr")}>
            <QrCode className="mr-2 h-4 w-4" /> QR Codes
          </Button>
          <Button variant={tab === "analytics" ? "default" : "outline"} onClick={() => setTab("analytics")}>
            <BarChart3 className="mr-2 h-4 w-4" /> Analytics
          </Button>
        </div>

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
                const url = `${BASE_URL}/zone/${zone.id}`;
                return (
                  <Card key={zone.id}>
                    <CardHeader className="text-center">
                      <CardTitle className="font-display text-xl">
                        {zone.icon} {zone.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{zone.tagline}</p>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-3" data-qr={zone.id}>
                      <QRCodeSVG value={url} size={180} bgColor="transparent" fgColor="hsl(152, 45%, 28%)" />
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition"
                      >
                        <ExternalLink className="h-3 w-3" /> Open Direct Link
                      </a>
                      <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground break-all">
                        {url}
                      </code>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {tab === "analytics" && (
          <>
            {/* Summary */}
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

            {/* Per zone */}
            <h3 className="mb-3 font-display text-xl font-semibold text-foreground">By Zone</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {zones.map((zone) => {
                const zoneStats = stats.byZone.find((b) => b.zoneId === zone.id);
                return (
                  <Card key={zone.id}>
                    <CardContent className="flex items-center gap-4 pt-6">
                      <span className="text-3xl">{zone.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">{zone.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Today: {zoneStats?.today ?? 0} · Total: {zoneStats?.total ?? 0}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Daily log */}
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
