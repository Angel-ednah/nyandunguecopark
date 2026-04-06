import { AlertTriangle, Info, List } from "lucide-react";
import type { ZoneSection as ZoneSectionType } from "@/hooks/useZones";

interface Props {
  section: ZoneSectionType;
}

const ZoneSectionBlock = ({ section }: Props) => {
  if (section.type === "guidelines") {
    return (
      <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-6">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h3 className="font-display text-xl font-bold text-destructive">{section.title}</h3>
        </div>
        {section.items && (
          <ul className="space-y-2">
            {section.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-foreground">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-destructive" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (section.type === "list") {
    return (
      <div>
        <h3 className="mb-3 font-display text-xl font-semibold text-foreground">{section.title}</h3>
        {section.items && (
          <ul className="space-y-2">
            {section.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                <List className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (section.type === "bilingual") {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-3 font-display text-xl font-semibold text-foreground">{section.title}</h3>
        {section.content && <p className="leading-relaxed text-foreground">{section.content}</p>}
        {section.content_kn && (
          <p className="mt-2 leading-relaxed italic text-muted-foreground">{section.content_kn}</p>
        )}
      </div>
    );
  }

  // Default: text
  return (
    <div>
      <h3 className="mb-3 font-display text-xl font-semibold text-foreground">{section.title}</h3>
      {section.content && <p className="leading-relaxed text-muted-foreground">{section.content}</p>}
    </div>
  );
};

export default ZoneSectionBlock;
