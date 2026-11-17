import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Check, Clock, GraduationCap, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CraftArt } from "@/components/kg/CraftArt";
import { FacebookShare } from "@/components/kg/FacebookShare";
import { InstructorAvatar } from "@/components/kg/InstructorAvatar";
import { SeatDots } from "@/components/kg/SeatDots";
import { COURSES, courseSeats, enrolledLabel, formatFee, instructorById, type Course } from "@/data/sample";
import { demoActions, useDemoProgress } from "@/lib/demo-store";
import { coursePost } from "@/lib/share";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/courses/$id")({
  loader: ({ params }) => {
    const course = COURSES.find((c) => c.id === params.id);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.course;
    if (!c) return { meta: [{ title: "Course not found · KamotGibo" }, { name: "robots", content: "noindex" }] };
    const desc = `${c.topic} · ${c.craft} · ${c.level}. ${c.schedule}, ${c.dates} in ${c.town}. ${formatFee(c.fee)}.`;
    return {
      meta: [
        { title: `${c.title} · KamotGibo` },
        { name: "description", content: desc },
        { property: "og:title", content: c.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold">Course not found</h1>
      <Button asChild variant="outline-sea" className="mt-6">
        <Link to="/upskilling" search={{}}>Browse upskilling</Link>
      </Button>
    </div>
  ),
  component: CourseDetail,
});

function EnrollButton({ c, mine, seatsLeft, size, className }: { c: Course; mine: boolean; seatsLeft: number; size: "lg" | "xl"; className?: string }) {
  if (mine)
    return (
      <Button variant="sea" size={size} disabled className={cn("w-full disabled:opacity-100", className)}>
        <Check /> You're enrolled
      </Button>
    );
  if (seatsLeft === 0)
    return (
      <Button variant="secondary" size={size} disabled className={cn("w-full", className)}>
        Full · no seats left
      </Button>
    );
  return (
    <Button
      variant="hero"
      size={size}
      className={cn("w-full", className)}
      onClick={() => {
        demoActions.enroll(c.id);
        toast.success("You're enrolled", {
          description: `${c.title}. First session ${c.dates.split(" – ")[0]}. See it in My learning.`,
        });
      }}
    >
      Enroll in this course
    </Button>
  );
}

function CourseDetail() {
  const { course: c } = Route.useLoaderData();
  const mine = useDemoProgress().enrolledCourses.includes(c.id);
  const { enrolled, seatsLeft } = courseSeats(c, mine);
  const instructor = instructorById(c.instructorId)!;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-40 pt-6 sm:px-6 md:pb-16">
      <Link
        to="/upskilling"
        search={{}}
        className="inline-flex min-h-10 items-center gap-1.5 text-sm font-bold text-sea hover:underline"
      >
        <ArrowLeft className="size-4" /> All upskilling courses
      </Link>

      <div className="mt-3 overflow-hidden rounded-3xl border shadow-card">
        <CraftArt craft={c.craft} className="h-32 sm:h-44" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge variant="sand">{c.topic}</Badge>
        <Badge variant="outline">{c.craft}</Badge>
        <Badge variant="sea">{c.level}</Badge>
        {seatsLeft === 0 && !mine && <Badge variant="full">Full</Badge>}
      </div>
      <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">{c.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{c.summary}</p>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_340px] md:items-start">
        <div className="flex flex-col gap-6">
          <dl className="grid gap-3 sm:grid-cols-2">
            <Fact Icon={CalendarDays} label="Schedule" value={c.schedule} sub={c.dates} />
            <Fact Icon={Clock} label="Time" value={c.time} sub="Same time each session" />
            <Fact Icon={MapPin} label="Venue" value={c.venue} sub="In person only" />
            <div className="rounded-2xl border bg-card p-4">
              <dt className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                <Users className="size-4" /> Enrollment
              </dt>
              <dd className="mt-1.5">
                <p className="font-bold">{enrolledLabel(enrolled)}</p>
                <p className="text-sm text-muted-foreground">
                  {seatsLeft === 0 ? "No seats left" : `${seatsLeft} of ${c.capacity} seats left`}
                </p>
                <div className="mt-2">
                  <SeatDots capacity={c.capacity} seatsLeft={seatsLeft} />
                </div>
              </dd>
            </div>
          </dl>

          <section className="rounded-3xl border bg-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold">Session plan</h2>
            <ol className="mt-4 flex flex-col gap-3">
              {c.plan.map((p, i) => (
                <li key={p} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-coral-soft text-sm font-extrabold text-primary">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{p}</span>
                </li>
              ))}
            </ol>
          </section>

          <Link
            to="/instructors/$id"
            params={{ id: instructor.id }}
            className="flex items-center gap-4 rounded-3xl border bg-card p-5 transition-colors hover:border-sea/50 sm:p-6"
          >
            <InstructorAvatar name={instructor.name} craft={instructor.craft} />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Instructor</span>
              <span className="block text-lg font-semibold">{instructor.fullName}</span>
              <span className="block text-sm text-muted-foreground">
                {instructor.specialization} · {instructor.years} years
              </span>
            </span>
            <span className="hidden text-sm font-bold text-sea sm:block">View profile</span>
          </Link>

          <FacebookShare
            what="this course"
            path={`/courses/${c.id}`}
            build={(url) => coursePost(c, url)}
            className="w-full sm:w-fit"
          />
        </div>

        <aside className="sticky top-24 hidden rounded-3xl border bg-card p-6 shadow-lift md:block">
          <p className="font-display text-3xl font-semibold">{formatFee(c.fee)}</p>
          <p className="text-sm text-muted-foreground">{c.feeNote}</p>
          <div className="my-5 space-y-2 border-y py-4 text-sm">
            <p className="flex items-center gap-2">
              <CalendarDays className="size-4 text-sea" /> {c.schedule} · {c.dates}
            </p>
            <p className="flex items-center gap-2">
              <GraduationCap className="size-4 text-sea" /> {enrolledLabel(enrolled)}
            </p>
            <p className="flex items-center gap-2">
              <Users className="size-4 text-sea" /> {seatsLeft === 0 ? "Full" : `${seatsLeft} seats left`}
            </p>
          </div>
          <EnrollButton c={c} mine={mine} seatsLeft={seatsLeft} size="xl" />
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {c.fee > 0 ? "No online payment. Pay at the venue." : "Free. Sponsored session."}
          </p>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 border-t bg-card/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <div className="shrink-0">
            <p className="font-display text-xl font-semibold leading-none">{formatFee(c.fee)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{seatsLeft === 0 ? "Full" : `${seatsLeft} seats left`}</p>
          </div>
          <EnrollButton c={c} mine={mine} seatsLeft={seatsLeft} size="lg" className="flex-1" />
        </div>
      </div>
    </div>
  );
}

function Fact({ Icon, label, value, sub }: { Icon: typeof MapPin; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <dt className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
        <Icon className="size-4" /> {label}
      </dt>
      <dd className="mt-1.5">
        <p className="font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{sub}</p>
      </dd>
    </div>
  );
}
