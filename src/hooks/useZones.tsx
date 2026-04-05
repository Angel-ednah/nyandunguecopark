import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ZoneRow {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  highlights: string[];
  facts: { label: string; value: string }[];
  image_url: string | null;
  display_order: number;
}

export function useZones() {
  return useQuery({
    queryKey: ["zones"],
    queryFn: async (): Promise<ZoneRow[]> => {
      const { data, error } = await supabase
        .from("zones")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return (data ?? []).map((z: any) => ({
        ...z,
        facts: Array.isArray(z.facts) ? z.facts : JSON.parse(z.facts ?? "[]"),
      }));
    },
  });
}

export function useZoneBySlug(slug: string) {
  return useQuery({
    queryKey: ["zones", slug],
    queryFn: async (): Promise<ZoneRow | null> => {
      const { data, error } = await supabase
        .from("zones")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return {
        ...data,
        facts: Array.isArray(data.facts) ? data.facts : JSON.parse(data.facts ?? "[]"),
      } as ZoneRow;
    },
    enabled: !!slug,
  });
}
