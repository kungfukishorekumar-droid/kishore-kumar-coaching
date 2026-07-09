/**
 * Single source of truth for all site content + links.
 * Edit copy, programs, testimonials and FAQs here — components read from this file.
 * (This is the `lib/constants.ts` equivalent referenced in the brief.)
 */

export const SITE = {
  name: "Kishore Kumar",
  role: "Sports Psychology · Martial Arts · Athlete Mindset Coach",
  tagline: "Train Your Mind Like a Warrior. Perform Like a Champion.",
  location: "Chennai, India",
  email: "coach@kishorekumar.com",
  phone: "+91 98845 99939",
  phoneRaw: "919884599939",
  whatsapp: "https://wa.me/919884599939",
  customGpt:
    "https://chatgpt.com/g/g-6a24775509dc81918f4c9887bed35d5c-athlete-mindset-coach-by-kishore",
  // NOTE: WarriorCRM is the private lead backend (see /api/lead) — never shown publicly.
  socials: {
    instagram: "https://www.instagram.com/kishorekumar.coach/",
  },
};

/** Build a WhatsApp deep-link with a pre-filled message. */
export function whatsappLink(message?: string) {
  const base = `https://wa.me/${SITE.phoneRaw}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const IMAGES = {
  /** Vertical studio portrait — arms crossed, kung-fu shadow (face-forward, clean) */
  portrait: "/images/portrait.jpg",
  /** Wide branded shot — 心技体 + Mindset/Focus/Discipline, zen circle */
  heroWide: "/images/hero-wide.jpg",
  /** "Strong Mind. Stronger You." full banner */
  strongMind: "/images/strong-mind.jpg",
  /** Open-hand gesture wide shot with gold HUD accents */
  gesture: "/images/gesture.jpg",
};

export const NAV_LINKS = [
  { label: "Home", id: "top" },
  { label: "Method", id: "method" },
  { label: "Programs", id: "programs" },
  { label: "Reviews", id: "reviews" },
  { label: "Workshops", id: "institutions" },
  { label: "FAQ", id: "faq" },
  { label: "Contact", id: "lead" },
];

export const HERO = {
  badge: "National Wushu Medalist · Sports Psychologist · Athlete Mindset Coach",
  headlineTop: "Train Your Mind Like a Warrior.",
  headlineBottom: "Perform Like a Champion.",
  sub: "Sports Psychology + Martial Arts coaching by Kishore Kumar — helping athletes, students and martial artists build Focus, Discipline, Confidence, Emotional Control, Pressure Handling and a true Winning Mindset.",
};

/** Floating authority badges (hero) + marquee */
export const BADGES = [
  "National Wushu Medalist",
  "Sports Psychologist",
  "Martial Artist",
  "Wushu Coach & Judge",
  "Athlete Mindset Coach",
];

export const STATS = [
  { value: 500, suffix: "+", label: "Athletes & Students Coached" },
  { value: 12, suffix: "+", label: "Years in Martial Arts" },
  { value: 50, suffix: "+", label: "Workshops Delivered" },
  { value: 30, suffix: "+", label: "Medals Mentored" },
];

export const PROBLEMS = [
  { icon: "CloudRain", title: "Losing focus during performance", desc: "Your mind drifts at the worst possible moment and execution falls apart." },
  { icon: "Ghost", title: "Fear before competition", desc: "Nerves take over before you even step onto the mat or the field." },
  { icon: "Users", title: "Pressure from parents or coaches", desc: "Expectations start to feel heavier than the competition itself." },
  { icon: "TrendingDown", title: "Low confidence", desc: "Self-doubt creeps in and you hold back instead of going all in." },
  { icon: "Hourglass", title: "Lack of discipline", desc: "Motivation comes and goes; consistent effort never quite sticks." },
  { icon: "Shuffle", title: "No proper routine", desc: "Training is random, so progress feels slow and unpredictable." },
  { icon: "Flame", title: "Anger & emotional imbalance", desc: "One mistake or bad call and emotions hijack the whole performance." },
  { icon: "Brain", title: "Overthinking", desc: "Too many thoughts freeze the quick, instinctive decisions that win." },
  { icon: "HeartCrack", title: "Giving up after mistakes", desc: "A single error spirals into a lost match or a wasted session." },
  { icon: "Activity", title: "Inconsistency in training", desc: "Great one day, flat the next — performance you can't rely on." },
];

export const METHOD = [
  { tag: "Focus", icon: "Crosshair", desc: "Attention, clarity, distraction control and mental sharpness." },
  { tag: "Fire", icon: "Flame", desc: "Motivation, confidence, energy and inner drive." },
  { tag: "Flow", icon: "Waves", desc: "Calm execution, performance rhythm and present-moment awareness." },
  { tag: "Forge", icon: "Hammer", desc: "Discipline, routine, consistency and strong habits." },
  { tag: "Fight", icon: "Swords", desc: "Pressure handling, comeback mindset, courage and competition confidence." },
];

type ProgramCTA = { label: string } & (
  | { type: "wa"; message: string }
  | { type: "scroll"; target: string }
);

export type Program = {
  slug: string;
  name: string;
  badge: string;
  forWho: string;
  focus: string;
  /** 1–2 sentence SEO/AEO description for the dedicated program page */
  description: string;
  features: string[];
  featured?: boolean;
  cta: ProgramCTA;
};

/** Look up a program by its URL slug. */
export function getProgram(slug: string) {
  return PROGRAMS.find((p) => p.slug === slug);
}

export const PROGRAMS: Program[] = [
  {
    slug: "1-day-athlete-mindset-workshop",
    name: "1-Day Athlete Mindset Workshop",
    badge: "90 minutes",
    forWho: "Schools, academies & beginner athletes",
    focus: "Discipline, confidence & pressure handling",
    description:
      "A single high-impact 90-minute sports-psychology session in Chennai that gives athletes and students practical focus, confidence and pressure-handling tools — the perfect first taste of the Warrior Mind Method™.",
    features: [
      "Single high-impact 90-minute session",
      "Practical focus & confidence drills",
      "Perfect first taste of the method",
    ],
    cta: { label: "Enquire on WhatsApp", type: "wa", message: "Hi Kishore, I'd like to enquire about the 1-Day Athlete Mindset Workshop." },
  },
  {
    slug: "3-day-warrior-mind-workshop",
    name: "3-Day Warrior Mind Workshop",
    badge: "3 Days · 90 min/day",
    forWho: "Athletes ready to go deeper",
    focus: "Focus training, emotional control & competition mindset",
    description:
      "A 3-day deep dive (2 days online + 1 day offline, or fully online) where athletes train focus, emotional control and a real competition mindset — 90 minutes a day of structured mental training you keep for every event.",
    features: [
      "2 days online + 1 day offline (or fully online)",
      "90 minutes of structured training daily",
      "Tools you keep for every competition",
    ],
    featured: true,
    cta: { label: "Join Waitlist", type: "scroll", target: "lead" },
  },
  {
    slug: "7-day-athlete-mindset-challenge",
    name: "7-Day Athlete Mindset Challenge",
    badge: "7 Days",
    forWho: "Students & athletes building habits",
    focus: "Habit, routine, confidence & performance mindset",
    description:
      "A guided 7-day challenge with daily structured mental-training tasks that build routine, confidence and a performance mindset — momentum you can feel by day seven.",
    features: [
      "Daily structured mental-training tasks",
      "Build a routine that actually sticks",
      "Momentum you can feel by day 7",
    ],
    cta: { label: "Apply Now", type: "scroll", target: "lead" },
  },
  {
    slug: "21-day-warrior-mind-transformation",
    name: "21-Day Warrior Mind Transformation",
    badge: "21 Days · Advanced",
    forWho: "Committed competitive athletes",
    focus: "Identity shift, consistency, emotional control & performance tracking",
    description:
      "An advanced 21-day program combining sports psychology with martial-arts discipline — identity shift, consistency, emotional control and weekly performance tracking for committed competitive athletes.",
    features: [
      "Advanced mindset + martial-arts discipline",
      "Weekly progress tracking & reviews",
      "Deep, lasting change in how you compete",
    ],
    cta: { label: "Book Strategy Call", type: "wa", message: "Hi Kishore, I'd like to book a strategy call for the 21-Day Warrior Mind Transformation." },
  },
  {
    slug: "personal-coaching",
    name: "Personal Coaching",
    badge: "1-on-1 · Private",
    forWho: "Athletes wanting a coach in their corner",
    focus: "Your individual performance challenges",
    description:
      "Private one-to-one athlete mindset coaching with Kishore Kumar, fully personalised to your sport and goals — honest feedback, a tailored plan, and support between sessions.",
    features: [
      "Fully personalised to your sport & goals",
      "Private sessions, honest feedback",
      "Support between sessions",
    ],
    cta: { label: "Book Free Call", type: "wa", message: "Hi Kishore, I'd like to book a free call about Personal Coaching." },
  },
  {
    slug: "school-academy-workshop",
    name: "School / Academy Workshop",
    badge: "Institutions",
    forWho: "Schools, colleges, academies & gyms",
    focus: "Discipline, confidence, emotional control & athlete performance",
    description:
      "Group athlete-mindset and discipline workshops for schools, colleges, academies and gyms in Chennai — flexible 1-day to multi-day formats that bring focus, confidence and emotional control to your whole squad.",
    features: [
      "Designed for groups & teams",
      "Flexible 1-day to multi-day formats",
      "Bring the method to your whole squad",
    ],
    cta: { label: "Invite Kishore", type: "wa", message: "Hi Kishore, we'd like to invite you to run a workshop at our school/academy." },
  },
];

export const CREDENTIALS = [
  { icon: "Medal", label: "National Wushu Medalist" },
  { icon: "Brain", label: "Sports Psychologist" },
  { icon: "Swords", label: "Martial Artist" },
  { icon: "GraduationCap", label: "Wushu Coach" },
  { icon: "Scale", label: "Wushu Judge" },
  { icon: "Flame", label: "Kung Fu / Martial Arts" },
  { icon: "Target", label: "Athlete Mindset Coach" },
  { icon: "MapPin", label: "Chennai-based Coach" },
];

/** How martial arts + sports psychology combine */
export const COMBINE = [
  { icon: "Dumbbell", label: "Body discipline" },
  { icon: "Brain", label: "Mind control" },
  { icon: "Heart", label: "Emotional strength" },
  { icon: "Gauge", label: "Pressure response" },
  { icon: "Crosshair", label: "Focus improvement" },
  { icon: "Repeat", label: "Confidence through repetition" },
  { icon: "Handshake", label: "Respect & self-control" },
  { icon: "CalendarCheck", label: "Better routines" },
  { icon: "RotateCcw", label: "Comeback mindset" },
];

export const INSTITUTIONS = {
  offers: [
    { icon: "CalendarDays", title: "1-Day Workshop", desc: "A high-impact 90-minute session on discipline, confidence and pressure handling." },
    { icon: "CalendarRange", title: "3-Day Workshop", desc: "Deeper focus training, emotional control and competition mindset." },
    { icon: "Trophy", title: "7-Day Performance Challenge", desc: "A structured week that builds routine, confidence and performance habits." },
    { icon: "Sparkles", title: "Custom Athlete Mindset Session", desc: "Tailored to your students, athletes and goals." },
  ],
  benefits: [
    "Engaging, practical and age-appropriate",
    "Evidence-informed sports psychology",
    "Martial-arts discipline & respect built in",
    "Flexible online or on-campus delivery",
  ],
};

export const FAQS = [
  { q: "Who is this coaching for?", a: "Athletes, sports and martial-arts students, beginners, and parents who want their child to build discipline and confidence. Institutions like schools, colleges, academies and gyms can also book group workshops." },
  { q: "Is it only for martial arts students?", a: "Not at all. The mental skills — focus, pressure control, emotional balance, discipline — apply to any sport, and to students and performers in general. Martial arts is simply how I train the discipline behind it." },
  { q: "Can parents book for children?", a: "Yes. Many parents book sessions for young athletes. I keep methods age-appropriate and loop parents in, because confidence is built best with the whole support system aligned." },
  { q: "Do you conduct school workshops?", a: "Yes — 1-day, 3-day and custom workshops for schools, colleges, academies and gyms, designed for groups and delivered online or on-campus." },
  { q: "Do you offer online programs?", a: "Yes. Personal coaching and most workshops run online so we can work together wherever you are. In-person options are available in and around Chennai." },
  { q: "How long is each session?", a: "Workshop sessions are typically around 90 minutes. Personal coaching sessions are scheduled to fit your needs." },
  { q: "Is this therapy?", a: "No. This is performance and mindset coaching using sports-psychology principles and martial-arts discipline. It is not clinical therapy or a substitute for professional mental-health treatment." },
  { q: "How do I start?", a: "Book a free athlete mindset call on WhatsApp, or grab the free focus & confidence checklist below. We'll find the right starting point for you." },
  { q: "Can beginners join?", a: "Absolutely. Beginners are welcome — the programs meet you where you are and build from the fundamentals." },
  { q: "Is this useful for competitive athletes?", a: "Yes. Competitive athletes use this to sharpen focus, handle big-match pressure, and build a resilient, confident competition mindset." },
  { q: "Where are you located?", a: "We are based in Chennai, India. Kishore Kumar coaches athletes and students across Chennai and nearby areas, and offers online sessions for anyone elsewhere." },
  { q: "Do you provide martial arts classes in Chennai?", a: "Yes. Martial arts and Wushu coaching are available in Chennai through Spartacus Martial Arts, alongside athlete mindset and sports-psychology coaching." },
  { q: "What is athlete mindset coaching?", a: "Athlete mindset coaching is structured mental training that helps athletes build focus, confidence, emotional control, and pressure handling — training the mind with the same discipline used to train the body." },
  { q: "How does sports psychology help athletes?", a: "Sports psychology helps athletes manage nerves, stay focused under pressure, recover from mistakes, and compete with confidence by building practical mental skills and routines." },
  { q: "What is the Warrior Mind Method?", a: "The Warrior Mind Method™ is Kishore Kumar's five-part system — Focus, Fire, Flow, Forge and Fight — that builds attention, motivation, calm execution, discipline, and competition confidence." },
];

export const ACADEMY = "Spartacus Martial Arts";

/**
 * ⚠️ PLACEHOLDER REVIEW STATS — these are NOT verified numbers.
 * Replace `rating` and `reviews` with your real Google/Justdial/BookMyPlayer
 * figures before launch. Do not publish unverified numbers.
 */
export const REVIEW_STATS = {
  rating: "4.9", // ← replace with real average rating
  reviews: "100+", // ← replace with real total review count
};

/** Trust-summary cards under the reviews header (edit freely). */
export const REVIEW_SUMMARY = [
  { value: `${REVIEW_STATS.rating}★`, label: "Average rating (placeholder)" },
  { value: REVIEW_STATS.reviews, label: "Reviews across platforms (placeholder)" },
  { value: "Parents", label: "Trusted by parents & families" },
  { value: "Mind + Body", label: "Martial arts & mindset training" },
  { value: "Chennai", label: "Local Chennai-based academy" },
  { value: "Discipline", label: "Confidence & focus for students" },
];

export type Review = {
  name: string;
  role: "Parent" | "Student" | "Athlete" | "Beginner" | "Martial Arts Learner";
  rating: number;
  text: string;
  date: string;
};

export type ReviewSource = {
  platform: "Google Reviews" | "Justdial" | "BookMyPlayer";
  /** brand accent color for the badge */
  accent: string;
  rating: string;
  totalReviews: string;
  link: string;
  reviews: Review[];
};

/**
 * ⚠️ PLACEHOLDER REVIEWS — replace every entry below with REAL, manually
 * approved reviews (text, names, dates, ratings) and the real profile links
 * from each platform before launch. Do NOT publish fabricated reviews.
 */
export const REVIEW_SOURCES: ReviewSource[] = [
  {
    platform: "Google Reviews",
    accent: "#4285F4",
    rating: "", // ← add real Google rating (e.g. "4.9")
    totalReviews: "", // ← add real Google review count
    link: "#", // ← add real Google Business Profile review link
    reviews: [
      // Replace with real approved Google review text:
      { name: "Karthik R.", role: "Parent", rating: 5, text: "My son joined for discipline and confidence — the change in his focus and attitude has been wonderful. Coaching is structured and caring.", date: "" },
      { name: "Divya S.", role: "Student", rating: 5, text: "Great place to learn martial arts in Chennai. The training builds real discipline and a strong mindset, not just technique.", date: "" },
      { name: "Arun M.", role: "Athlete", rating: 5, text: "The mindset and focus training helped me stay calm under competition pressure. Highly professional coaching.", date: "" },
      { name: "Priya N.", role: "Parent", rating: 5, text: "Safe, encouraging environment for kids. My daughter looks forward to every class and has grown more confident.", date: "" },
    ],
  },
  {
    platform: "Justdial",
    accent: "#1F7AE0",
    rating: "", // ← add real Justdial rating
    totalReviews: "", // ← add real Justdial review count
    link: "#", // ← add real Justdial profile link
    reviews: [
      // Replace with real approved Justdial review text:
      { name: "Suresh K.", role: "Parent", rating: 5, text: "Well-organised martial arts classes with genuine attention to each student. Good discipline and values taught.", date: "" },
      { name: "Meena V.", role: "Beginner", rating: 5, text: "Started as a complete beginner and felt welcomed from day one. The coach explains everything patiently.", date: "" },
      { name: "Rahul T.", role: "Martial Arts Learner", rating: 5, text: "Solid Wushu and Kung Fu fundamentals. The focus on mindset alongside technique makes a real difference.", date: "" },
      { name: "Anitha R.", role: "Parent", rating: 5, text: "My kids have improved in concentration and confidence. Recommend for parents looking for serious training.", date: "" },
    ],
  },
  {
    platform: "BookMyPlayer",
    accent: "#16A34A",
    rating: "", // ← add real BookMyPlayer rating
    totalReviews: "", // ← add real BookMyPlayer review count
    link: "#", // ← add real BookMyPlayer profile link
    reviews: [
      // Replace with real approved BookMyPlayer review text:
      { name: "Vignesh P.", role: "Athlete", rating: 5, text: "Excellent coaching for athletes who want to train the mental side of performance. Disciplined and motivating.", date: "" },
      { name: "Lakshmi G.", role: "Parent", rating: 5, text: "Professional academy. My son is calmer, more focused and more confident since he started training here.", date: "" },
      { name: "Deepak S.", role: "Student", rating: 5, text: "Good balance of fitness, martial arts and mindset. The sessions are structured and easy to follow.", date: "" },
      { name: "Sneha R.", role: "Beginner", rating: 5, text: "Friendly coaches and a supportive group. A great place to start martial arts in Chennai.", date: "" },
    ],
  },
];

export const WORKSHOP = {
  title: "Warrior Mind Workshop",
  subtitle: "1-Day Athlete Mindset Intensive",
  /** ⚠️ PLACEHOLDER — update to real date before launch (ISO 8601, IST = +05:30) */
  date: "2026-07-19T10:00:00+05:30",
  durationMinutes: 90,
  price: "₹999",
  priceNote: "Early bird · Limited seats",
  totalSeats: 30,
  /** ⚠️ Update spotsLeft manually as registrations come in */
  spotsLeft: 12,
  mode: "Online + Chennai (Hybrid)",
  includes: [
    "Live 90-minute intensive session",
    "Warrior Mind Framework workbook (PDF)",
    "Free Athlete Focus & Confidence Checklist",
    "30-day access to session recording",
  ],
  agenda: [
    { time: "10:00 AM", topic: "The Warrior Mind Framework — Focus, Fire, Flow, Forge, Fight" },
    { time: "10:30 AM", topic: "Practical Focus Drills & Competition Visualization" },
    { time: "11:00 AM", topic: "Pressure Handling & Big-Match Mindset" },
    { time: "11:30 AM", topic: "Building Your Personal Warrior Routine" },
    { time: "12:00 PM", topic: "Live Q&A + Bonus: Free Mindset Checklist" },
  ],
};

/** Lead-magnet form options */
export const LEAD_FORM = {
  title: "Free Athlete Focus & Confidence Checklist",
  sub: "A simple, practical checklist to start building focus, discipline and confidence today.",
  whoOptions: ["Athlete / Student", "Parent", "Coach / Institution"],
  challengeOptions: [
    "Focus during performance",
    "Confidence",
    "Pressure & nerves",
    "Discipline & routine",
    "Emotional control",
  ],
};
