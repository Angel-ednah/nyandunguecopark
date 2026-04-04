import { Link, useLocation } from "react-router-dom";
import { TreePine, Menu, X } from "lucide-react";
import { useState } from "react";
import { zones } from "@/lib/zones";

const ParkHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-wide">
          <TreePine className="h-7 w-7" />
          <span>Nyandungu Eco-Park</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link to="/" className={`transition hover:opacity-80 ${location.pathname === "/" ? "underline underline-offset-4" : ""}`}>
            Home
          </Link>
          {zones.map((z) => (
            <Link
              key={z.id}
              to={`/zone/${z.id}`}
              className={`transition hover:opacity-80 ${location.pathname === `/zone/${z.id}` ? "underline underline-offset-4" : ""}`}
            >
              {z.name}
            </Link>
          ))}
          <Link to="/admin" className={`transition hover:opacity-80 ${location.pathname === "/admin" ? "underline underline-offset-4" : ""}`}>
            Admin
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="flex flex-col gap-2 border-t border-primary-foreground/20 px-4 pb-4 pt-2 md:hidden">
          <Link to="/" onClick={() => setMenuOpen(false)} className="py-1">Home</Link>
          {zones.map((z) => (
            <Link key={z.id} to={`/zone/${z.id}`} onClick={() => setMenuOpen(false)} className="py-1">
              {z.icon} {z.name}
            </Link>
          ))}
          <Link to="/admin" onClick={() => setMenuOpen(false)} className="py-1">Admin</Link>
        </nav>
      )}
    </header>
  );
};

export default ParkHeader;
