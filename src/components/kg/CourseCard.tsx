import { Link } from "@tanstack/react-router";
import { CalendarDays, GraduationCap, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CraftIcon } from "./CraftArt";
import { courseSeats, enrolledLabel, formatFee, instructorById, type Course } from "@/data/sample";
import { useDemoProgress } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

export function CourseCard({ course: c, className }: { course: Course; className?: string }) {
  const mine = useDemoProgress().enrolledCourses.includes(c.id);
  const { enrolled, seatsLeft } = courseSeats(c, mine);
  const instructor = instructorById(c.instructorId);
  return (
    <Link
      to="/courses/$id"
      params={{ id: c.id }}
      className={cn(
        "group flex flex-col gap-3 rounded-3xl border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-sea-soft text-sea">
          <CraftIcon craft={c.craft} className="size-5" />
        </span>
        <Badge variant={c.fee === 0 ? "success" : "coral"}>{formatFee(c.fee)}</Badge>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="sand">{c.topic}</Badge>
        <Badge variant="outline">{c.craft}</Badge>
      </div>
      <h3 className="text-lg font-semibold leading-snug group-hover:text-primary">{c.title}</h3>
      <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-4 shrink-0" /> {c.schedule} · {c.dates}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="size-4 shrink-0" /> {c.town} · {instructor?.name}
        </span>
        <span className="flex items-center gap-1.5">
          <GraduationCap className="size-4 shrink-0" /> {enrolledLabel(enrolled)}
        </span>
      </div>
      <div className="mt-auto flex items-center justify-between pt-1">
        <Badge variant="sea">{c.level}</Badge>
        {mine ? (
          <Badge variant="success">You're enrolled</Badge>
        ) : seatsLeft === 0 ? (
          <Badge variant="full">Full</Badge>
        ) : (
          <span className={cn("flex items-center gap-1.5 text-sm font-bold", seatsLeft <= 2 ? "text-primary" : "text-success")}>
            <Users className="size-4" /> {seatsLeft} of {c.capacity} seats left
          </span>
        )}
      </div>
    </Link>
  );
}
