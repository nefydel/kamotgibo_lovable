import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/kg/CourseCard";
import { FilterChips } from "@/components/kg/FilterChips";
import { InstructorAvatar } from "@/components/kg/InstructorAvatar";
import {
  COURSES,
  CRAFTS,
  INSTRUCTORS,
  UPSKILL_TOPICS,
  offeringsBy,
  type Craft,
  type UpskillTopic,
} from "@/data/sample";

interface UpskillSearch {
  topic?: UpskillTopic | undefined;
  craft?: Craft | undefined;
}

function pick<T extends string>(v: unknown, allowed: readonly T[]): T | undefined {
  return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : undefined;
}

export const Route = createFileRoute("/upskilling")({
  validateSearch: (s: Record<string, unknown>): UpskillSearch => ({
    topic: pick<UpskillTopic>(s["topic"], UPSKILL_TOPICS.map((t) => t.name)),
    craft: pick<Craft>(s["craft"], CRAFTS.map((c) => c.name)),
  }),
  head: () => ({
    meta: [
      { title: "Upskilling courses · KamotGibo" },
      {
        name: "description",
        content:
          "In-person courses in Sorsogon on advanced craft techniques, pricing and selling, product design and practical skills for handicrafts.",
      },
      { property: "og:title", content: "Upskilling courses · KamotGibo" },
      { property: "og:description", content: "Go further with your craft: multi-session, in-person courses with local artisans." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Upskilling,
});

function Upskilling() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/upskilling" });
  const set = (patch: Partial<UpskillSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });
  const results = COURSES.filter(
    (c) => (!search.topic || c.topic === search.topic) && (!search.craft || c.craft === search.craft),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-widest text-primary">Upskilling</p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Take your craft further</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Short, in-person courses over a few sessions: advanced techniques, pricing and selling,
        product design and practical skills. Taught by the same local artisans.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {UPSKILL_TOPICS.map((t) => {
          const active = search.topic === t.name;
          return (
            <button
              key={t.name}
              type="button"
              aria-pressed={active}
              onClick={() => set({ topic: active ? undefined : t.name })}
              className={
                active
                  ? "rounded-2xl border-2 border-sea bg-sea p-4 text-left text-sea-foreground shadow-card"
                  : "rounded-2xl border-2 border-transparent bg-card p-4 text-left shadow-card transition-colors hover:border-sea/40"
              }
            >
              <span className="flex items-center gap-2 font-bold">
                <Sprout className="size-4" /> {t.name}
              </span>
              <span className={active ? "mt-1 block text-sm opacity-85" : "mt-1 block text-sm text-muted-foreground"}>
                {t.blurb}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-3xl border bg-card/60 p-4 sm:p-5">
        <FilterChips
          label="Craft"
          options={CRAFTS.map((c) => ({ value: c.name, label: c.name }))}
          value={search.craft}
          onChange={(craft) => set({ craft })}
        />
      </div>

      <p className="mt-8 font-bold" aria-live="polite">
        {results.length} {results.length === 1 ? "course" : "courses"}
      </p>
      {results.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((c) => (
            <CourseCard key={c.id} course={c} className="animate-rise" />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border border-dashed bg-card/60 px-6 py-12 text-center">
          <h2 className="text-xl font-semibold">No courses match yet</h2>
          <p className="mt-1 text-muted-foreground">Try another topic or craft.</p>
          <Button asChild variant="outline-sea" className="mt-5">
            <Link to="/upskilling" search={{}} replace>
              Show all courses
            </Link>
          </Button>
        </div>
      )}

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">Meet the instructors</h2>
        <p className="mt-1 text-muted-foreground">See each artisan's background and everything they teach right now.</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INSTRUCTORS.map((i) => {
            const o = offeringsBy(i.id);
            return (
              <li key={i.id}>
                <Link
                  to="/instructors/$id"
                  params={{ id: i.id }}
                  className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-card transition-colors hover:border-sea/50"
                >
                  <InstructorAvatar name={i.name} craft={i.craft} />
                  <span className="min-w-0">
                    <span className="block font-bold leading-snug">{i.name}</span>
                    <span className="block text-sm text-muted-foreground">
                      {i.craft} · {o.workshops.length + o.courses.length} offerings
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <Link
        to="/resources"
        search={{}}
        className="mt-8 flex items-center gap-4 rounded-3xl border bg-sea-soft/50 p-5 transition-colors hover:border-sea/50"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sea text-sea-foreground">
          <BookOpen className="size-6" />
        </span>
        <span className="flex-1">
          <span className="block text-xs font-extrabold uppercase tracking-widest text-sea">
            Mga Sanggunian sa Pag-aaral
          </span>
          <span className="block font-bold">Guides, e-books and tutorials to practice at home</span>
        </span>
        <ArrowRight className="size-5 text-sea" />
      </Link>
    </div>
  );
}
