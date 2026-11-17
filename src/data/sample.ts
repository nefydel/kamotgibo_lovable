// All data here is fictional sample data for the look-only prototype.

export type Town = "Gubat" | "Sorsogon City" | "Bulan" | "Irosin";
export type Craft = "Shellcraft" | "Abaca weaving" | "Basketry" | "Pottery";
export type Level = "Beginner" | "Intermediate";
export type MaterialStatus = "Provided" | "Can borrow" | "Buy separately" | "Bring your own";

export interface Workshop {
  id: string;
  title: string;
  craft: Craft;
  town: Town;
  level: Level;
  fee: number; // 0 = free
  feeNote: string;
  instructor: string;
  instructorId: string;
  instructorNote: string;
  venue: string;
  venueNote: string;
  day: string;
  time: string;
  nextDate: string;
  capacity: number;
  seatsLeft: number;
  learn: string[];
  materials: { item: string; status: MaterialStatus }[];
}

export const TOWNS: Town[] = ["Gubat", "Sorsogon City", "Bulan", "Irosin"];

export const CRAFTS: { name: Craft; local: string; blurb: string }[] = [
  { name: "Shellcraft", local: "kaligay & buskay", blurb: "Shell jewelry and ornaments" },
  { name: "Abaca weaving", local: "abaca", blurb: "Coasters, mats and bags" },
  { name: "Basketry", local: "rattan", blurb: "Woven baskets and trays" },
  { name: "Pottery", local: "clay", blurb: "Hand-built clay pieces" },
];

export const WORKSHOPS: Workshop[] = [
  {
    id: "shell-jewelry-basics",
    title: "Shell Jewelry Basics: Make Your First Buskay Bracelet",
    craft: "Shellcraft",
    town: "Gubat",
    level: "Beginner",
    fee: 300,
    feeNote: "Covers materials",
    instructor: "Nanay Rosa (sample)",
    instructorId: "nanay-rosa",
    instructorNote: "Shell crafter from Gubat. Makes kaligay and buskay jewelry.",
    venue: "Community craft hub, Gubat",
    venueNote: "Near the town plaza. Look for the blue gate.",
    day: "Sat",
    time: "9:00 AM – 12:00 PM",
    nextDate: "Sat, Nov 21",
    capacity: 10,
    seatsLeft: 4,
    learn: [
      "Sort and pick shells for a bracelet",
      "Basic stringing and knotting",
      "Finish and close a bracelet you can wear home",
    ],
    materials: [
      { item: "Shells", status: "Provided" },
      { item: "Thread", status: "Provided" },
      { item: "Pliers", status: "Can borrow" },
      { item: "Apron", status: "Bring your own" },
    ],
  },
  {
    id: "abaca-weaving-101",
    title: "Abaca Weaving 101: Coasters and Mats",
    craft: "Abaca weaving",
    town: "Sorsogon City",
    level: "Beginner",
    fee: 0,
    feeNote: "Free (sponsored)",
    instructor: "Kuya Ben (sample)",
    instructorId: "kuya-ben",
    instructorNote: "Abaca weaver and cooperative member.",
    venue: "Weavers' cooperative studio, Sorsogon City",
    venueNote: "Ground floor studio, enter from the side door.",
    day: "Sun",
    time: "1:00 PM – 4:00 PM",
    nextDate: "Sun, Nov 22",
    capacity: 12,
    seatsLeft: 7,
    learn: ["Prepare abaca fiber", "Plain weave on a small frame", "Finish a coaster set"],
    materials: [
      { item: "Abaca fiber", status: "Provided" },
      { item: "Weaving frame", status: "Can borrow" },
      { item: "Small scissors", status: "Bring your own" },
    ],
  },
  {
    id: "rattan-basketry",
    title: "Basketry Techniques: Rattan Basket",
    craft: "Basketry",
    town: "Bulan",
    level: "Intermediate",
    fee: 500,
    feeNote: "Pay at the venue",
    instructor: "Tay Ramon (sample)",
    instructorId: "tay-ramon",
    instructorNote: "Basket maker working with rattan.",
    venue: "Basket makers' workshop, Bulan",
    venueNote: "Open-air work shed behind the main house.",
    day: "Fri",
    time: "2:00 PM – 5:00 PM",
    nextDate: "Fri, Nov 20",
    capacity: 8,
    seatsLeft: 2,
    learn: ["Soak and shape rattan", "Build a sturdy base", "Weave and finish the rim"],
    materials: [
      { item: "Rattan strips", status: "Provided" },
      { item: "Awl and cutter", status: "Can borrow" },
      { item: "Work gloves", status: "Buy separately" },
    ],
  },
  {
    id: "clay-pottery-starter",
    title: "Clay Pottery Starter Session",
    craft: "Pottery",
    town: "Irosin",
    level: "Beginner",
    fee: 350,
    feeNote: "Pay at the venue",
    instructor: "Ate Liza (sample)",
    instructorId: "ate-liza",
    instructorNote: "Potter running a community clay corner.",
    venue: "Community learning center, Irosin",
    venueNote: "Room 2 of the learning center, ask at the front desk.",
    day: "Sat",
    time: "8:00 AM – 11:00 AM",
    nextDate: "Sat, Nov 21",
    capacity: 10,
    seatsLeft: 0,
    learn: ["Wedge and prepare clay", "Pinch and coil methods", "Shape a small bowl"],
    materials: [
      { item: "Clay", status: "Provided" },
      { item: "Shaping tools", status: "Can borrow" },
      { item: "Old shirt or apron", status: "Bring your own" },
    ],
  },
];

export function formatFee(fee: number) {
  return fee === 0 ? "Free" : `PHP ${fee.toLocaleString("en-PH")}`;
}

/** Learners already enrolled (taken seats), shown separately from seats left. */
export function enrolledCount(w: Pick<Workshop, "seatsLeft" | "capacity">) {
  return w.capacity - w.seatsLeft;
}

export function enrolledLabel(n: number) {
  return `${n} ${n === 1 ? "learner" : "learners"} enrolled`;
}

export function seatsLabel(w: Pick<Workshop, "seatsLeft" | "capacity">) {
  if (w.seatsLeft === 0) return "Full";
  return `${w.seatsLeft} of ${w.capacity} seats left`;
}

export type ScheduleFilter = "weekend" | "weekday";
export type CostFilter = "free" | "paid";

export interface WorkshopFilters {
  q?: string | undefined;
  town?: Town | undefined;
  craft?: Craft | undefined;
  level?: Level | undefined;
  when?: ScheduleFilter | undefined;
  cost?: CostFilter | undefined;
}

const WEEKEND = ["Sat", "Sun"];

export function filterWorkshops(list: Workshop[], f: WorkshopFilters): Workshop[] {
  const q = f.q?.trim().toLowerCase();
  return list.filter((w) => {
    if (f.town && w.town !== f.town) return false;
    if (f.craft && w.craft !== f.craft) return false;
    if (f.level && w.level !== f.level) return false;
    if (f.when === "weekend" && !WEEKEND.includes(w.day)) return false;
    if (f.when === "weekday" && WEEKEND.includes(w.day)) return false;
    if (f.cost === "free" && w.fee !== 0) return false;
    if (f.cost === "paid" && w.fee === 0) return false;
    if (q) {
      const hay = `${w.title} ${w.craft} ${w.town} ${w.instructor}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export const MATERIAL_STATUSES: MaterialStatus[] = [
  "Provided",
  "Can borrow",
  "Buy separately",
  "Bring your own",
];

// ---------- Stage 3: learner, bookings and badges (sample) ----------

export const LEARNER = { name: "Mika", age: 19 };

/** Booking reference shown on the confirmation for each bookable workshop. */
const BOOKING_REFS: Record<string, string> = {
  "shell-jewelry-basics": "BK-GUB-1121",
  "abaca-weaving-101": "BK-SOR-1122",
  "rattan-basketry": "BK-BUL-1120",
  "clay-pottery-starter": "BK-IRO-1121",
};

export function bookingRef(w: Pick<Workshop, "id">) {
  return BOOKING_REFS[w.id] ?? `BK-${w.id.slice(0, 3).toUpperCase()}`;
}

/** What to do before the session, built from the materials list and fee. */
export function prepNotes(w: Workshop): string[] {
  const notes = ["Arrive 15 minutes early so the session can start on time."];
  for (const m of w.materials) {
    if (m.status === "Bring your own") notes.push(`Bring your own ${m.item.toLowerCase()}.`);
    if (m.status === "Buy separately") notes.push(`Buy ${m.item.toLowerCase()} before the session.`);
  }
  notes.push(
    w.fee === 0
      ? "No fee to pay. This session is sponsored."
      : `Bring ${formatFee(w.fee)} in cash. Pay at the venue.`,
  );
  return notes;
}

/** Mika's past session (before the demo). */
export const PAST_SESSIONS = [
  {
    workshopId: "abaca-weaving-101",
    date: "Sun, Nov 8",
    attended: true,
    skillCheck: "Not yet" as const,
    note: "Kuya Ben suggests one more practice session on finishing the edges.",
  },
];

export const BADGE = {
  code: "KG-4F7A-21",
  title: "Shellcraft: Basic Stringing",
  craft: "Shellcraft" as Craft,
  issuedBy: "Nanay Rosa (sample)",
  workshopId: "shell-jewelry-basics",
  issuedOn: "Sat, Nov 21",
  skills: [
    "Sorts and picks shells for a bracelet",
    "Ties secure stringing knots",
    "Finishes and closes a wearable bracelet",
  ],
};

export interface LearnerProgress {
  booked: string[];
  badgeIssued: boolean;
}

export function milestones(p: LearnerProgress) {
  return [
    { label: "Attended your first workshop", hint: "Abaca Weaving 101", done: PAST_SESSIONS.length > 0 },
    { label: "Booked your next session", hint: "Reserve a seat at any workshop", done: p.booked.length > 0 },
    { label: "Passed your first skill check", hint: "Checked in person by your instructor", done: p.badgeIssued },
    { label: "Learned 2 different crafts", hint: "Abaca weaving + one more", done: p.badgeIssued },
  ];
}

// ---------- Stage 4: instructor roster and admin review (sample) ----------

export const INSTRUCTOR = { name: "Nanay Rosa (sample)", workshopId: "shell-jewelry-basics" };

/** Learners booked into Nanay Rosa's Sat, Nov 21 session (6 of 10 seats). First names only. */
export const ROSTER = [
  { id: "mika", name: "Mika", ref: "BK-GUB-1121" },
  { id: "jun", name: "Jun (sample)", ref: "BK-GUB-1104" },
  { id: "ana", name: "Ana (sample)", ref: "BK-GUB-1107" },
  { id: "carlo", name: "Carlo (sample)", ref: "BK-GUB-1110" },
  { id: "bea", name: "Bea (sample)", ref: "BK-GUB-1113" },
  { id: "lito", name: "Lito (sample)", ref: "BK-GUB-1116" },
];

export type SkillResult = "pass" | "not-yet" | null;

export interface RosterMark {
  present: boolean;
  skill: SkillResult;
  issued: boolean;
}

/** A badge can only be issued to a learner who attended and passed the skill check. */
export function canIssueBadge(m: RosterMark) {
  return m.present && m.skill === "pass" && !m.issued;
}

export type ProviderStatus = "Pending" | "Approved" | "Changes requested";

export interface Provider {
  id: string;
  name: string;
  kind: "Artisan" | "Cooperative" | "Learning center";
  craft: Craft;
  town: Town;
  venue: string;
  workshop: string;
  submitted: string;
  status: ProviderStatus;
  adminNote?: string;
}

export const PROVIDERS: Provider[] = [
  {
    id: "bulan-shell-collective",
    name: "Bulan Shellcraft Collective (sample)",
    kind: "Cooperative",
    craft: "Shellcraft",
    town: "Bulan",
    venue: "Barangay multi-purpose hall, Bulan",
    workshop: "Buskay Keychains for Beginners",
    submitted: "Nov 12",
    status: "Pending",
  },
  {
    id: "nanay-rosa",
    name: "Nanay Rosa (sample)",
    kind: "Artisan",
    craft: "Shellcraft",
    town: "Gubat",
    venue: "Community craft hub, Gubat",
    workshop: "Shell Jewelry Basics: Make Your First Buskay Bracelet",
    submitted: "Oct 28",
    status: "Approved",
  },
  {
    id: "gubat-youth-center",
    name: "Gubat Youth Learning Center (sample)",
    kind: "Learning center",
    craft: "Abaca weaving",
    town: "Gubat",
    venue: "Youth center activity room, Gubat",
    workshop: "Abaca Bag Weaving",
    submitted: "Nov 9",
    status: "Changes requested",
    adminNote: "Please add the venue address and list which materials learners must bring.",
  },
];

/** Current status after the admin's approvals in this demo. */
export function providerStatus(p: Provider, approvedIds: string[]): ProviderStatus {
  return approvedIds.includes(p.id) ? "Approved" : p.status;
}

// ---------- Prompt 6: instructors, upskilling courses, learning references (sample) ----------

export interface Instructor {
  id: string;
  name: string; // short name used on cards
  fullName: string;
  craft: Craft;
  specialization: string;
  town: Town;
  years: number;
  credentials: string[];
  bio: string;
}

export const INSTRUCTORS: Instructor[] = [
  {
    id: "nanay-rosa",
    name: "Nanay Rosa (sample)",
    fullName: "Rosa Dimaano (sample)",
    craft: "Shellcraft",
    specialization: "Kaligay and buskay shell jewelry",
    town: "Gubat",
    years: 25,
    credentials: [
      "25 years making kaligay and buskay jewelry",
      "Leads weekend sessions at the Gubat community craft hub",
      "Provider profile reviewed by a KamotGibo admin",
    ],
    bio: "Rosa learned shellcraft from her mother on the Gubat coast. She sorts every shell by hand and teaches beginners to string their first bracelet in one morning. She wants more young people to keep the craft going.",
  },
  {
    id: "kuya-ben",
    name: "Kuya Ben (sample)",
    fullName: "Benjamin Lacsamana (sample)",
    craft: "Abaca weaving",
    specialization: "Abaca coasters, mats and bags",
    town: "Sorsogon City",
    years: 12,
    credentials: [
      "12 years weaving abaca on frame looms",
      "Member of a weavers' cooperative in Sorsogon City",
      "Provider profile reviewed by a KamotGibo admin",
    ],
    bio: "Ben weaves with his cooperative and helps new members price and sell their first pieces. His sessions are patient and practical: you leave with something you made and a clear next step.",
  },
  {
    id: "tay-ramon",
    name: "Tay Ramon (sample)",
    fullName: "Ramon Gallanosa (sample)",
    craft: "Basketry",
    specialization: "Rattan baskets, trays and repairs",
    town: "Bulan",
    years: 30,
    credentials: [
      "30 years making and repairing rattan baskets",
      "Runs an open-air work shed in Bulan",
      "Provider profile reviewed by a KamotGibo admin",
    ],
    bio: "Ramon has woven rattan since he was a boy. He teaches strong bases and clean rims first, because a basket that lasts is the best advertisement for your work.",
  },
  {
    id: "ate-liza",
    name: "Ate Liza (sample)",
    fullName: "Liza Espinas (sample)",
    craft: "Pottery",
    specialization: "Hand-built clay bowls and planters",
    town: "Irosin",
    years: 8,
    credentials: [
      "8 years hand-building clay pieces",
      "Runs the clay corner at a community learning center in Irosin",
      "Provider profile reviewed by a KamotGibo admin",
    ],
    bio: "Liza started with pinch pots at home and now runs a small clay corner for her community. She loves showing first-timers that a good bowl starts with well-prepared clay.",
  },
];

export function instructorById(id: string) {
  return INSTRUCTORS.find((i) => i.id === id);
}

export type UpskillTopic = "Advanced techniques" | "Entrepreneurship" | "Product design" | "Practical skills";

export const UPSKILL_TOPICS: { name: UpskillTopic; blurb: string }[] = [
  { name: "Advanced techniques", blurb: "Go deeper in a craft you started" },
  { name: "Entrepreneurship", blurb: "Price, sell and keep simple records" },
  { name: "Product design", blurb: "Turn a technique into a product" },
  { name: "Practical skills", blurb: "Photos, packaging and care" },
];

export interface Course {
  id: string;
  title: string;
  topic: UpskillTopic;
  craft: Craft;
  level: Level;
  instructorId: string;
  town: Town;
  venue: string;
  schedule: string; // e.g. "3 Saturdays"
  dates: string;
  time: string;
  fee: number;
  feeNote: string;
  capacity: number;
  enrolled: number; // before Mika enrolls in the demo
  summary: string;
  plan: string[]; // one line per session
}

export const COURSES: Course[] = [
  {
    id: "advanced-buskay-patterns",
    title: "Advanced Buskay Patterns: Layered Necklaces",
    topic: "Advanced techniques",
    craft: "Shellcraft",
    level: "Intermediate",
    instructorId: "nanay-rosa",
    town: "Gubat",
    venue: "Community craft hub, Gubat",
    schedule: "3 Saturdays",
    dates: "Nov 28 – Dec 12",
    time: "1:00 PM – 4:00 PM",
    fee: 900,
    feeNote: "Covers materials for 3 sessions",
    capacity: 8,
    enrolled: 5,
    summary: "For learners who already strung a bracelet. Plan a pattern, layer strands and finish a necklace with a clasp.",
    plan: ["Plan a color and size pattern", "String and space two layers", "Add a clasp and finish the necklace"],
  },
  {
    id: "shell-gift-packaging",
    title: "Gift Packaging for Shell Jewelry",
    topic: "Product design",
    craft: "Shellcraft",
    level: "Beginner",
    instructorId: "nanay-rosa",
    town: "Gubat",
    venue: "Community craft hub, Gubat",
    schedule: "1 Sunday",
    dates: "Dec 6",
    time: "9:00 AM – 11:00 AM",
    fee: 150,
    feeNote: "Covers boxes and labels",
    capacity: 12,
    enrolled: 7,
    summary: "Make simple, low-cost packaging from abaca paper and local materials so your pieces look ready to give.",
    plan: ["Fold a small box and add a handmade label"],
  },
  {
    id: "pricing-selling-handicrafts",
    title: "Pricing and Selling Your Handicrafts",
    topic: "Entrepreneurship",
    craft: "Abaca weaving",
    level: "Beginner",
    instructorId: "kuya-ben",
    town: "Sorsogon City",
    venue: "Weavers' cooperative studio, Sorsogon City",
    schedule: "2 Sundays",
    dates: "Nov 29 – Dec 6",
    time: "9:00 AM – 12:00 PM",
    fee: 0,
    feeNote: "Free (sponsored)",
    capacity: 20,
    enrolled: 12,
    summary: "Work out what a piece really costs, set a fair price and keep a simple sales notebook.",
    plan: ["Count materials and hours to set a price", "Keep a simple sales and expenses notebook"],
  },
  {
    id: "abaca-coaster-to-bag",
    title: "Product Design: From Coaster to Bag",
    topic: "Product design",
    craft: "Abaca weaving",
    level: "Intermediate",
    instructorId: "kuya-ben",
    town: "Sorsogon City",
    venue: "Weavers' cooperative studio, Sorsogon City",
    schedule: "4 Sundays",
    dates: "Nov 29 – Dec 20",
    time: "1:00 PM – 4:00 PM",
    fee: 600,
    feeNote: "Covers fiber and lining",
    capacity: 10,
    enrolled: 10,
    summary: "Scale a plain weave into panels, join them and add handles to make a small tote.",
    plan: ["Weave matching panels", "Join panels cleanly", "Add lining", "Attach handles and finish"],
  },
  {
    id: "rattan-repair-finishing",
    title: "Rattan Repair and Finishing",
    topic: "Advanced techniques",
    craft: "Basketry",
    level: "Intermediate",
    instructorId: "tay-ramon",
    town: "Bulan",
    venue: "Basket makers' workshop, Bulan",
    schedule: "3 Fridays",
    dates: "Nov 27 – Dec 11",
    time: "2:00 PM – 5:00 PM",
    fee: 750,
    feeNote: "Covers rattan and finish",
    capacity: 6,
    enrolled: 3,
    summary: "Fix broken weaves, re-wrap rims and apply a natural finish so baskets last for years.",
    plan: ["Spot and remove damaged strands", "Re-weave and re-wrap a rim", "Sand and apply a natural finish"],
  },
  {
    id: "craft-photos-phone",
    title: "Photographing Your Crafts with a Phone",
    topic: "Practical skills",
    craft: "Pottery",
    level: "Beginner",
    instructorId: "ate-liza",
    town: "Irosin",
    venue: "Community learning center, Irosin",
    schedule: "1 Saturday",
    dates: "Dec 5",
    time: "1:00 PM – 3:00 PM",
    fee: 0,
    feeNote: "Free (sponsored)",
    capacity: 15,
    enrolled: 4,
    summary: "Use daylight, a plain backdrop and your phone to take clear photos of any handmade piece.",
    plan: ["Light, backdrop and angles with a phone"],
  },
  {
    id: "clay-glazing-firing",
    title: "Glazing and Firing Basics",
    topic: "Advanced techniques",
    craft: "Pottery",
    level: "Intermediate",
    instructorId: "ate-liza",
    town: "Irosin",
    venue: "Community learning center, Irosin",
    schedule: "3 Saturdays",
    dates: "Nov 28 – Dec 12",
    time: "8:00 AM – 11:00 AM",
    fee: 800,
    feeNote: "Covers clay, glaze and firing",
    capacity: 8,
    enrolled: 6,
    summary: "Dry pieces safely, apply simple glazes and see how a kiln firing works.",
    plan: ["Drying and trimming", "Mixing and applying glaze", "Loading and firing (watch and help)"],
  },
];

/** Seats after the demo learner's own enrollment (simulated, this browser only). */
export function courseSeats(c: Pick<Course, "capacity" | "enrolled">, enrolledByMe: boolean) {
  const enrolled = Math.min(c.capacity, c.enrolled + (enrolledByMe ? 1 : 0));
  return { enrolled, seatsLeft: c.capacity - enrolled };
}

/** Workshops and courses an instructor currently offers. */
export function offeringsBy(instructorId: string) {
  return {
    workshops: WORKSHOPS.filter((w) => w.instructorId === instructorId),
    courses: COURSES.filter((c) => c.instructorId === instructorId),
  };
}

export type ResourceType = "E-book" | "PDF guide" | "Article" | "Video tutorial" | "Website";
export type ResourceCraft = Craft | "Running a craft business";

export interface Resource {
  id: string;
  title: string;
  craft: ResourceCraft;
  type: ResourceType;
  source: string;
  length: string;
  description: string;
}

export const RESOURCE_TYPES: ResourceType[] = ["E-book", "PDF guide", "Article", "Video tutorial", "Website"];
export const RESOURCE_CRAFTS: ResourceCraft[] = [...CRAFTS.map((c) => c.name), "Running a craft business"];

export const RESOURCES: Resource[] = [
  { id: "shell-knots-pdf", title: "Stringing Knots for Shell Jewelry", craft: "Shellcraft", type: "PDF guide", source: "Gubat craft hub (sample)", length: "12 pages", description: "Step-by-step drawings of the overhand, square and crimp knots used in class." },
  { id: "kaligay-buskay-article", title: "Kaligay and Buskay: Know Your Shells", craft: "Shellcraft", type: "Article", source: "Sorsogon Craft Notes (sample)", length: "6 min read", description: "How to tell shell types apart and pick pieces that won't crack." },
  { id: "shell-video", title: "Closing a Bracelet Neatly", craft: "Shellcraft", type: "Video tutorial", source: "Bicol Makers Channel (sample)", length: "8 min", description: "A close-up of the finishing step to review after your workshop." },
  { id: "abaca-ebook", title: "Abaca from Fiber to Weave", craft: "Abaca weaving", type: "E-book", source: "Weavers' cooperative (sample)", length: "40 pages", description: "Preparing, dyeing and storing abaca fiber at home." },
  { id: "abaca-frame-video", title: "Setting Up a Small Weaving Frame", craft: "Abaca weaving", type: "Video tutorial", source: "Bicol Makers Channel (sample)", length: "11 min", description: "Warp a frame loom the same way you did in class." },
  { id: "abaca-patterns-web", title: "Plain and Twill Pattern Library", craft: "Abaca weaving", type: "Website", source: "Open Weave Archive (sample)", length: "Browse online", description: "Printable pattern charts for coasters and mats." },
  { id: "rattan-soak-pdf", title: "Soaking and Shaping Rattan", craft: "Basketry", type: "PDF guide", source: "Bulan basket makers (sample)", length: "8 pages", description: "How long to soak, how to bend and how to dry without splitting." },
  { id: "basket-base-video", title: "Building a Sturdy Basket Base", craft: "Basketry", type: "Video tutorial", source: "Bicol Makers Channel (sample)", length: "14 min", description: "Review the base technique from Tay Ramon's session." },
  { id: "clay-prep-article", title: "Wedging Clay: Why It Matters", craft: "Pottery", type: "Article", source: "Sorsogon Craft Notes (sample)", length: "5 min read", description: "Air bubbles, cracks and how good wedging prevents both." },
  { id: "pinch-coil-ebook", title: "Pinch and Coil Projects", craft: "Pottery", type: "E-book", source: "Irosin clay corner (sample)", length: "28 pages", description: "Ten small projects to practice at home between sessions." },
  { id: "pricing-worksheet", title: "Pricing Worksheet for Handmade Goods", craft: "Running a craft business", type: "PDF guide", source: "KamotGibo learning team (sample)", length: "4 pages", description: "Fill-in sheet for materials, hours and a fair selling price." },
  { id: "msme-basics-web", title: "Starting a Small Craft Business", craft: "Running a craft business", type: "Website", source: "Small Business Learning Hub (sample)", length: "Browse online", description: "Plain-language guides on records, permits and selling at local fairs." },
];

export function filterResources(list: Resource[], crafts: ResourceCraft[] | undefined, type?: ResourceType) {
  return list.filter((r) => (!crafts || crafts.includes(r.craft)) && (!type || r.type === type));
}

/** Crafts Mika has attended or booked, for "For my workshops". */
export function myCrafts(booked: string[]): Craft[] {
  const ids = new Set([...PAST_SESSIONS.map((s) => s.workshopId), ...booked]);
  return [...new Set(WORKSHOPS.filter((w) => ids.has(w.id)).map((w) => w.craft))];
}
