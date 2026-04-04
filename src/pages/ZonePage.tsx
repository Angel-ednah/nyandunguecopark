import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, Share2, Copy, Check } from "lucide-react";
import ParkHeader from "@/components/ParkHeader";
import ParkFooter from "@/components/ParkFooter";
import { getZoneById, zones } from "@/lib/zones";
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
        <Share2 className="h-5 w-5 text-primary" /> Share This Page
      </div>
      <p className="mb-3 text-sm text-muted-foreground">
        No QR scanner? Share this direct link with friends and family:
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 overflow-x-auto rounded bg-muted px-3 py-2 text-sm text-muted-foreground">
          {url}
        </code>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          {copied ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy</>}
        </button>
      </div>
    </div>
  );
};

const ZonePage = () => {
  const { zoneId } = useParams<{ zoneId: string }>();
  const zone = getZoneById(zoneId ?? "");

  useEffect(() => {
    if (zoneId) recordVisit(zoneId);
  }, [zoneId]);

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

  const otherZones = zones.filter((z) => z.id !== zone.id);

  return (
    <div className="flex min-h-screen flex-col">
      <ParkHeader />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary to-nature-canopy px-4 py-16 text-primary-foreground">
        <div className="container mx-auto max-w-3xl">
          <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="text-6xl">{zone.icon}</div>
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

          {/* Share link for users without QR scanner */}
          <ShareLink />
        </div>
      </section>

      {/* Placeholder for photos/videos */}
      <section className="bg-card py-14">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 font-display text-2xl font-bold text-foreground">Gallery</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex aspect-video items-center justify-center rounded-lg bg-muted text-muted-foreground">
                Photo {i}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Photos and videos coming soon</p>
        </div>
      </section>

      {/* Other zones */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center font-display text-2xl font-bold text-foreground">Explore Other Zones</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherZones.map((z) => (
              <ZoneCard key={z.id} zone={z} />
            ))}
          </div>
        </div>
      </section>

      <ParkFooter />
    </div>
  );
};

export default ZonePage;
