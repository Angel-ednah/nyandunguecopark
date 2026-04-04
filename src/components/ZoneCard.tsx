import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Zone } from "@/lib/zones";

const ZoneCard = ({ zone }: { zone: Zone }) => (
  <Link
    to={`/zone/${zone.id}`}
    className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
  >
    <div className="flex h-40 items-center justify-center bg-primary/10 text-6xl">
      {zone.icon}
    </div>
    <div className="flex flex-1 flex-col p-5">
      <h3 className="font-display text-xl font-semibold text-foreground">{zone.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{zone.tagline}</p>
      <div className="mt-auto flex items-center gap-1 pt-4 text-sm font-medium text-primary transition group-hover:gap-2">
        Explore <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  </Link>
);

export default ZoneCard;
