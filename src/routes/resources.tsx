import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, ExternalLink, FileText, Globe, Newspaper, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterChips } from "@/components/kg/FilterChips";
import {
  RESOURCES,
  RESOURCE_CRAFTS,
  RESOURCE_TYPES,
  filterResources,
  myCrafts,
  type Resource,
  type ResourceCraft,
  type ResourceType,
} from "@/data/sample";
import { useDemoProgress } from "@/lib/demo-store";

type CraftChoice = ResourceCraft | "mine";

interface ResourceSearch {
  craft?: CraftChoice | undefined;
  type?: ResourceType | undefined;
}

function pick<T extends string>(v: unknown, allowed: readonly T[]): T | undefined {
  return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : undefined;
}

export const Route = createFileRoute("/resources")({
  validateSearch: (s: Record<string, unknown>): ResourceSearch => ({
    craft: pick<CraftChoice>(s["craft"], [...RESOURCE_CRAFTS, "mine"]),
    type: pick<ResourceType>(s["type"], RESOURCE_TYPES),
  }),
  head: () => ({
    meta: [
      { title: "Mga Sanggunian sa Pag-aaral · Learning references · KamotGibo" },
      {
        name: "description",
        content: "E-books, PDF guides, articles, video tutorials and websites to practice shellcraft, abaca weaving, basketry and pottery between workshops.",
      },
      { property: "og:title", content: "Learning references · KamotGibo" },
      { property: "og:description", content: "Practice at home between in-person workshops, organized by craft." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Resources,
});

const TYPE_ICON: Record<ResourceType, typeof BookOpen> = {
  "E-book": BookOpen,
  "PDF guide": FileText,
  Article: Newspaper,
  "Video tutorial": PlayCircle,
  Website: Globe,
};

function ResourceRow({ r }: { r: Resource }) {
  const Icon = TYPE_ICON[r.type];
  const open = () =>
    toast(`${r.title}`, {
      description: `Sample reference from ${r.source}. In the full app this opens the ${r.type.toLowerCase()}.`,
    });
  return (
    <li className="flex gap-4 rounded-2xl border bg-card p-4 shadow-card">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-coral-soft text-primary">
        <Icon className="size-6" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="sea">{r.type}</Badge>
          <span className="text-xs font-bold text-muted-foreground">{r.length}</span>
        </div>
        <p className="mt-1.5 font-bold leading-snug">{r.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{r.source}</span>
          <Button variant="outline-sea" size="sm" onClick={open}>
            Open <ExternalLink />
          </Button>
        </div>
      </div>
    </li>
  );
}

function Resources() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/resources" });
  const { booked } = useDemoProgress();
  const mine = myCrafts(booked);
  const set = (patch: Partial<ResourceSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });

  const crafts: ResourceCraft[] | undefined =
    search.craft === "mine" ? mine : search.craft ? [search.craft] : undefined;
  const results = filterResources(RESOURCES, crafts, search.type);
  const groups = RESOURCE_CRAFTS.map((c) => ({ craft: c, items: results.filter((r) => r.craft === c) })).filter(
    (g) => g.items.length > 0,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-widest text-primary">Mga Sanggunian sa Pag-aaral</p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Learning references</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Practice at home between workshops. These are extras: the real learning still happens in
        person, with an artisan beside you.
      </p>

      <div className="mt-6 grid gap-5 rounded-3xl border bg-card/60 p-4 sm:p-5 md:grid-cols-2">
        <FilterChips<CraftChoice>
          label="Craft"
          options={[
            { value: "mine", label: "For my workshops" },
            ...RESOURCE_CRAFTS.map((c) => ({ value: c, label: c })),
          ]}
          value={search.craft}
          onChange={(craft) => set({ craft })}
        />
        <FilterChips
          label="Type"
          options={RESOURCE_TYPES.map((t) => ({ value: t, label: t }))}
          value={search.type}
          onChange={(type) => set({ type })}
        />
      </div>

      {search.craft === "mine" && (
        <p className="mt-4 rounded-2xl bg-sea-soft/60 px-4 py-3 text-sm">
          Showing references for crafts you attended or booked: <strong>{mine.join(", ")}</strong>.
        </p>
      )}

      <p className="mt-8 font-bold" aria-live="polite">
        {results.length} {results.length === 1 ? "reference" : "references"}
      </p>

      {groups.length > 0 ? (
        <div className="mt-4 flex flex-col gap-8">
          {groups.map((g) => (
            <section key={g.craft}>
              <h2 className="text-xl font-semibold">{g.craft}</h2>
              <ul className="mt-3 grid gap-3 lg:grid-cols-2">
                {g.items.map((r) => (
                  <ResourceRow key={r.id} r={r} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border border-dashed bg-card/60 px-6 py-12 text-center">
          <h2 className="text-xl font-semibold">No references match</h2>
          <Button asChild variant="outline-sea" className="mt-5">
            <Link to="/resources" search={{}} replace>
              Show all references
            </Link>
          </Button>
        </div>
      )}

      <p className="mt-10 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
        All references here are fictional sample content for this prototype.
      </p>
    </div>
  );
}
