import { Link, useLocation } from "react-router-dom";
import { TreePine, Menu, X } from "lucide-react";
import { useState } from "react";
import { useZones } from "@/hooks/useZones";

const ParkHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { data: zones = [] } = useZones();

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-wide">
          <TreePine className="h-7 w-7" />
          <div className="flex flex-col leading-tight">
            <span>Discover Nyandungu</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-70">Scan • Learn • Protect</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link to="/" className={`transition hover:opacity-80 ${location.pathname === "/" ? "underline underline-offset-4" : ""}`}>
            Home
          </Link>
          {zones.map((z) => (
            <Link
              key={z.id}
              to={`/zone/${z.slug}`}
              className={`transition hover:opacity-80 ${location.pathname === `/zone/${z.slug}` ? "underline underline-offset-4" : ""}`}
            >
              {z.name}
            </Link>
          ))}
        </nav>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-2 border-t border-primary-foreground/20 px-4 pb-4 pt-2 md:hidden">
          <Link to="/" onClick={() => setMenuOpen(false)} className="py-1">Home</Link>
          {zones.map((z) => (
            <Link key={z.id} to={`/zone/${z.slug}`} onClick={() => setMenuOpen(false)} className="py-1">
              {z.icon} {z.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default ParkHeader;
