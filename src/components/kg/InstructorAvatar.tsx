import type { Craft } from "@/data/sample";
import { cn } from "@/lib/utils";

const TONE: Record<Craft, string> = {
  Shellcraft: "bg-sea-soft text-sea",
  "Abaca weaving": "bg-sand text-warning",
  Basketry: "bg-coral-soft text-primary",
  Pottery: "bg-secondary text-primary",
};
const PATTERN: Record<Craft, string> = {
  Shellcraft: "bg-scallop",
  "Abaca weaving": "bg-weave",
  Basketry: "bg-weave",
  Pottery: "bg-rings",
};

export function initials(name: string) {
  return name
    .replace(/\(.*\)/, "")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
}

/** Patterned initials illustration for an instructor. No photos of people. */
export function InstructorAvatar({ name, craft, className }: { name: string; craft: Craft; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full", TONE[craft], className)}
    >
      <span className={cn("absolute inset-0 opacity-60", PATTERN[craft])} />
      <span className="relative grid size-[70%] place-items-center rounded-full bg-card/90 font-display text-[1.1em] font-semibold shadow-card">
        {initials(name)}
      </span>
    </span>
  );
}
