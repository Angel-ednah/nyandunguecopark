export interface Zone {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  highlights: string[];
  facts: { label: string; value: string }[];
}

export const zones: Zone[] = [
  {
    id: "wetland-trail",
    name: "Wetland Trail",
    tagline: "Walk through Kigali's restored urban wetland",
    description:
      "Explore the heart of Nyandungu Eco-Park along the Wetland Trail. This boardwalk-style path winds through lush marshland, offering stunning views of indigenous plant species and the peaceful sounds of flowing water. The trail showcases Rwanda's commitment to wetland restoration and environmental conservation.",
    icon: "🌿",
    highlights: [
      "Wooden boardwalks over the wetland",
      "Over 62 indigenous plant species",
      "Peaceful water features",
      "Educational signage along the path",
    ],
    facts: [
      { label: "Trail Length", value: "2.5 km" },
      { label: "Duration", value: "45 min" },
      { label: "Difficulty", value: "Easy" },
    ],
  },
  {
    id: "bird-sanctuary",
    name: "Bird Sanctuary",
    tagline: "Discover the birdlife of Rwanda's capital",
    description:
      "The Bird Sanctuary at Nyandungu is a haven for birdwatchers and nature lovers. Home to numerous bird species that have returned since the wetland restoration, this zone offers observation platforms and quiet hides where visitors can spot kingfishers, herons, weavers, and many more species in their natural habitat.",
    icon: "🦅",
    highlights: [
      "Bird observation platforms",
      "Guided birdwatching tours",
      "Species identification boards",
      "Photography-friendly hides",
    ],
    facts: [
      { label: "Bird Species", value: "100+" },
      { label: "Best Time", value: "6-9 AM" },
      { label: "Binoculars", value: "Available" },
    ],
  },
  {
    id: "cycling-path",
    name: "Cycling & Adventure",
    tagline: "10 km of scenic cycling and exploration",
    description:
      "Experience the thrill of cycling through Nyandungu Eco-Park's scenic trails. The 10-kilometre cycling path winds through diverse landscapes — from open grasslands to shaded forest canopies. Bikes are available for rent at the park entrance. The adventure zone also features picnic areas and rest stops along the route.",
    icon: "🚴",
    highlights: [
      "10 km cycling trail",
      "Bike rental available",
      "Picnic areas along the route",
      "Scenic rest stops with views",
    ],
    facts: [
      { label: "Path Length", value: "10 km" },
      { label: "Bike Rental", value: "Available" },
      { label: "Difficulty", value: "Moderate" },
    ],
  },
  {
    id: "education-center",
    name: "Education & Culture",
    tagline: "Learn about wetland ecology and Rwandan heritage",
    description:
      "The Education & Culture Center is the knowledge hub of Nyandungu Eco-Park. Featuring interactive exhibits about wetland ecology, environmental conservation, and Rwanda's natural heritage, this zone serves as both a learning center and a gathering space for community events, workshops, and educational programs.",
    icon: "📚",
    highlights: [
      "Interactive ecological exhibits",
      "Community workshop space",
      "Information center",
      "Gift shop with local crafts",
    ],
    facts: [
      { label: "Exhibits", value: "12+" },
      { label: "Workshops", value: "Weekly" },
      { label: "Open", value: "Daily" },
    ],
  },
];

export function getZoneById(id: string): Zone | undefined {
  return zones.find((z) => z.id === id);
}
