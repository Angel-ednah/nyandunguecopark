import { Link } from "react-router-dom";
import { MapPin, Leaf, Bird, Bike } from "lucide-react";
import ParkHeader from "@/components/ParkHeader";
import ParkFooter from "@/components/ParkFooter";
import ZoneCard from "@/components/ZoneCard";
import { zones } from "@/lib/zones";

const Index = () => (
  <div className="flex min-h-screen flex-col">
    <ParkHeader />

    {/* Hero */}
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center bg-gradient-to-b from-primary via-nature-canopy to-nature-deep px-4 text-center text-primary-foreground">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-60" />
      <div className="relative z-10 max-w-3xl animate-fade-in-up">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest opacity-80">Kigali, Rwanda</p>
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          Dive Into the Heart of Nature
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg opacity-90">
          Experience the serene beauty of Kigali's first restored urban wetland — 121 hectares of lush flora, vibrant birdlife, and scenic trails.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/zone/wetland-trail" className="rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground shadow transition hover:opacity-90">
            Start Exploring
          </Link>
        </div>
      </div>
    </section>

    {/* Quick stats */}
    <section className="bg-card py-10">
      <div className="container mx-auto grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
        {[
          { icon: <MapPin className="h-6 w-6" />, value: "121 ha", label: "Park Area" },
          { icon: <Leaf className="h-6 w-6" />, value: "62+", label: "Plant Species" },
          { icon: <Bird className="h-6 w-6" />, value: "100+", label: "Bird Species" },
          { icon: <Bike className="h-6 w-6" />, value: "10 km", label: "Cycling Path" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center">
            <div className="mb-2 text-primary">{stat.icon}</div>
            <span className="font-display text-2xl font-bold text-foreground">{stat.value}</span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Zones */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center font-display text-3xl font-bold text-foreground">Explore the Park</h2>
        <p className="mx-auto mb-10 max-w-lg text-center text-muted-foreground">
          Scan one of the QR codes around the park to discover each zone in detail.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {zones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>
      </div>
    </section>

    {/* About */}
    <section className="bg-card py-16">
      <div className="container mx-auto max-w-3xl px-4 text-center">
        <h2 className="mb-4 font-display text-3xl font-bold text-foreground">About the Park</h2>
        <p className="text-muted-foreground leading-relaxed">
          Nyandungu Eco-Park is Kigali's premier urban wetland, spanning 121 hectares. Once a degraded ecosystem, it has been meticulously restored into a thriving green space that showcases Rwanda's commitment to environmental conservation. The park features cycling paths, walking trails, bird sanctuaries, picnic areas, a restaurant, and an education center — all within the capital city.
        </p>
      </div>
    </section>

    <ParkFooter />
  </div>
);

export default Index;
