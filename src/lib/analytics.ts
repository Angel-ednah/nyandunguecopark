const STORAGE_KEY = "nyandungu_visits";

interface VisitRecord {
  zoneId: string;
  date: string; // YYYY-MM-DD
  count: number;
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function loadVisits(): VisitRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveVisits(visits: VisitRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
}

export function recordVisit(zoneId: string) {
  const visits = loadVisits();
  const today = getToday();
  const existing = visits.find((v) => v.zoneId === zoneId && v.date === today);
  if (existing) {
    existing.count += 1;
  } else {
    visits.push({ zoneId, date: today, count: 1 });
  }
  saveVisits(visits);
}

export function getVisitStats(): {
  totalToday: number;
  totalAll: number;
  byZone: { zoneId: string; today: number; total: number }[];
  dailyTotals: { date: string; count: number }[];
} {
  const visits = loadVisits();
  const today = getToday();

  const zoneIds = [...new Set(visits.map((v) => v.zoneId))];

  const byZone = zoneIds.map((zoneId) => {
    const zoneVisits = visits.filter((v) => v.zoneId === zoneId);
    const todayVisit = zoneVisits.find((v) => v.date === today);
    return {
      zoneId,
      today: todayVisit?.count ?? 0,
      total: zoneVisits.reduce((sum, v) => sum + v.count, 0),
    };
  });

  const dailyMap = new Map<string, number>();
  visits.forEach((v) => {
    dailyMap.set(v.date, (dailyMap.get(v.date) ?? 0) + v.count);
  });
  const dailyTotals = [...dailyMap.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalToday: byZone.reduce((s, z) => s + z.today, 0),
    totalAll: visits.reduce((s, v) => s + v.count, 0),
    byZone,
    dailyTotals,
  };
}
