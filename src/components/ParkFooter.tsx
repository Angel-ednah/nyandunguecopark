import { TreePine, MapPin, Clock } from "lucide-react";

const ParkFooter = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-3">
      <div>
        <div className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
          <TreePine className="h-5 w-5" /> Nyandungu Eco-Park
        </div>
        <p className="text-sm opacity-80">
          Kigali's first restored urban wetland — 121 hectares of lush nature, cycling trails, and biodiversity.
        </p>
      </div>
      <div>
        <h4 className="mb-3 font-display text-lg font-semibold">Visit Us</h4>
        <div className="flex items-start gap-2 text-sm opacity-80">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Nyandungu, Kigali, Rwanda</span>
        </div>
        <div className="mt-2 flex items-start gap-2 text-sm opacity-80">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Open Daily: 6:00 AM – 6:00 PM</span>
        </div>
      </div>
      <div>
        <h4 className="mb-3 font-display text-lg font-semibold">Connect</h4>
        <p className="text-sm opacity-80">www.nyandunguecopark.rw</p>
        <p className="mt-1 text-sm opacity-80">info@nyandunguecopark.rw</p>
      </div>
    </div>
    <div className="border-t border-primary-foreground/20 py-4 text-center text-xs opacity-60">
      © {new Date().getFullYear()} Nyandungu Eco-Park. All rights reserved.
    </div>
  </footer>
);

export default ParkFooter;
