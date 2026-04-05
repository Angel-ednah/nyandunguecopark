import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, Share2, Copy, Check, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import ParkHeader from "@/components/ParkHeader";
import ParkFooter from "@/components/ParkFooter";
import { useZones, useZoneBySlug } from "@/hooks/useZones";
import { recordVisit } from "@/lib/analytics";
import ZoneCard from "@/components/ZoneCard";

const ShareLink = () => {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mt-10 rounded-lg border bg-card p-5">
      <div className="mb-2 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <QrCode className="h-5 w-5 text-primary" /> QR Code & Share Link
      </div>
      <p className="mb-3 text-sm text-muted-foreground">
        Scan the QR code or share this direct link with friends and family:
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="rounded-lg border bg-white p-3">
          <QRCodeSVG value={url} size={140} bgColor="#ffffff" fgColor="hsl(152, 45%, 28%)" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <code className="overflow-x-auto rounded bg-muted px-3 py-2 text-sm text-muted-foreground break-all">
            {url}
          </code>
          <button
            onClick={handleCopy}
            className="inline-flex w-fit items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            {copied ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy Link</>}
          </button>
        </div>
      </div>
    </div>
  );
};

const ZonePage = () => {
  const { zoneId } = useParams<{ zoneId: string }>();
  const { data: zone, isLoading } = useZoneBySlug(zoneId ?? "");
  const { data: allZones = [] } = useZones();

  useEffect(() => {
    if (zoneId) recordVisit(zoneId);
  }, [zoneId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <ParkHeader />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <ParkFooter />
      </div>
    );
  }

  if (!zone) {
    return (
      <div className="flex min-h-screen flex-col">
        <ParkHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground">Zone Not Found</h1>
            <Link to="/" className="mt-4 inline-block text-primary underline">Back to Home</Link>
          </div>
        </div>
        <ParkFooter />
      </div>
    );
  }

  const otherZones = allZones.filter((z) => z.slug !== zone.slug);

  return (
    <div className="flex min-h-screen flex-col">
      <ParkHeader />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary to-nature-canopy px-4 py-16 text-primary-foreground">
        <div className="container mx-auto max-w-3xl">
          <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          {zone.image_url ? (
            <img src={zone.image_url} alt={zone.name} className="mb-4 h-48 w-full rounded-lg object-cover" />
          ) : (
            <div className="text-6xl">{zone.icon}</div>
          )}
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">{zone.name}</h1>
          <p className="mt-2 text-lg opacity-90">{zone.tagline}</p>
        </div>
      </section>

      {/* Facts */}
      <section className="bg-card">
        <div className="container mx-auto grid grid-cols-3 divide-x divide-border px-4 py-6">
          {zone.facts.map((fact) => (
            <div key={fact.label} className="text-center">
              <div className="font-display text-xl font-bold text-primary">{fact.value}</div>
              <div className="text-xs text-muted-foreground">{fact.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      <section className="py-14">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-4 font-display text-2xl font-bold text-foreground">About This Zone</h2>
          <p className="leading-relaxed text-muted-foreground">{zone.description}</p>

          <h3 className="mb-3 mt-10 font-display text-xl font-semibold text-foreground">Highlights</h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {zone.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-muted-foreground">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <ShareLink />
        </div>
      </section>

      {/* Gallery */}
      {zone.image_url && (
        <section className="bg-card py-14">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h2 className="mb-4 font-display text-2xl font-bold text-foreground">Gallery</h2>
            <img src={zone.image_url} alt={zone.name} className="mx-auto rounded-lg" />
          </div>
        </section>
      )}

      {/* Other zones */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center font-display text-2xl font-bold text-foreground">Explore Other Zones</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherZones.map((z) => (
              <ZoneCard key={z.id} zone={{ id: z.slug, name: z.name, tagline: z.tagline, icon: z.icon, description: z.description, highlights: z.highlights, facts: z.facts }} />
            ))}
          </div>
        </div>
      </section>

      <ParkFooter />
    </div>
  );
};

export default ZonePage;
