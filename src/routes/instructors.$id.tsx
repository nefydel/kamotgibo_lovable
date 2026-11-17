import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Award, BadgeCheck, BookOpen, MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/kg/CourseCard";
import { InstructorAvatar } from "@/components/kg/InstructorAvatar";
import { WorkshopCard } from "@/components/kg/WorkshopCard";
import { INSTRUCTORS, offeringsBy } from "@/data/sample";

export const Route = createFileRoute("/instructors/$id")({
  loader: ({ params }) => {
    const instructor = INSTRUCTORS.find((i) => i.id === params.id);
    if (!instructor) throw notFound();
    return { instructor };
  },
  head: ({ loaderData }) => {
    const i = loaderData?.instructor;
    if (!i) return { meta: [{ title: "Instructor not found · KamotGibo" }, { name: "robots", content: "noindex" }] };
    const desc = `${i.fullName}: ${i.specialization} in ${i.town}, ${i.years} years. See their current workshops and courses.`;
    return {
      meta: [
        { title: `${i.fullName} · Instructor · KamotGibo` },
        { name: "description", content: desc },
        { property: "og:title", content: `${i.fullName} · KamotGibo instructor` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold">Instructor not found</h1>
      <Button asChild variant="outline-sea" className="mt-6">
        <Link to="/upskilling" search={{}}>See all instructors</Link>
      </Button>
    </div>
  ),
  component: InstructorProfile,
});

function InstructorProfile() {
  const { instructor: i } = Route.useLoaderData();
  const { workshops, courses } = offeringsBy(i.id);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <Link
        to="/upskilling"
        search={{}}
        className="inline-flex min-h-10 items-center gap-1.5 text-sm font-bold text-sea hover:underline"
      >
        <ArrowLeft className="size-4" /> All instructors
      </Link>

      <section className="relative mt-3 overflow-hidden rounded-3xl border bg-card p-6 shadow-card sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-sea-soft">
          <div className="h-full w-full rounded-full bg-scallop opacity-50" />
        </div>
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <InstructorAvatar name={i.fullName} craft={i.craft} className="size-24 text-2xl sm:size-28" />
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Instructor</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">{i.fullName}</h1>
            <p className="text-muted-foreground">Learners call her or him {i.name.replace(" (sample)", "")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="sand">{i.craft}</Badge>
              <Badge variant="outline">
                <MapPin className="mr-1 size-3" /> {i.town}
              </Badge>
              <Badge variant="sea">{i.years} years of experience</Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_340px] md:items-start">
        <section className="rounded-3xl border bg-card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Sparkles className="size-5 text-primary" /> About
          </h2>
          <p className="mt-1 text-sm font-bold text-sea">{i.specialization}</p>
          <p className="mt-3 leading-relaxed">{i.bio}</p>
        </section>
        <section className="rounded-3xl border bg-card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Award className="size-5 text-primary" /> Credentials
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5 text-sm">
            {i.credentials.map((c) => (
              <li key={c} className="flex gap-2.5">
                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-sea" /> {c}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-2xl bg-muted px-3 py-2 text-xs text-muted-foreground">
            "Verified provider" means a KamotGibo admin reviewed this profile. It is not a formal
            qualification.
          </p>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Workshops now open</h2>
        <p className="mt-1 text-muted-foreground">One-day, hands-on sessions. Book a seat.</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {workshops.map((w) => (
            <WorkshopCard key={w.id} workshop={w} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Ongoing courses</h2>
        <p className="mt-1 text-muted-foreground">Multi-session upskilling. Enroll from the course page.</p>
        {courses.length > 0 ? (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-dashed p-6 text-center text-muted-foreground">
            No courses right now.
          </p>
        )}
      </section>

      <Button asChild variant="outline-sea" size="lg" className="mt-10 w-full sm:w-fit">
        <Link to="/resources" search={{ craft: i.craft }}>
          <BookOpen /> {i.craft} learning references
        </Link>
      </Button>
    </div>
  );
}
