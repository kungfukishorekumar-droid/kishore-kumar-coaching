import type { BlogPost } from "./blog";

/**
 * Local-intent articles — the organic half of the local-search strategy.
 *
 * These target the same queries the Google Business Profile competes for
 * ("martial arts classes near me", "sports psychologist Chennai", "kids karate
 * Perambur"). The two reinforce each other: the map pack wins the click, and a
 * page that actually answers the question wins the enquiry. See
 * docs/google-business-profile-setup.md for the profile side.
 *
 * Deliberately no invented specifics. Prices, timings and batch sizes change,
 * and publishing a number that turns out to be wrong costs more trust than
 * saying "message us". Where a figure would help, these give the market range
 * and how to judge it, not a quote.
 */

const LOCAL_SEEDS: Omit<BlogPost, "publishedAt">[] = [
  {
    slug: "martial-arts-classes-perambur-chennai",
    title: "Martial Arts Classes in Perambur, Chennai: A Local Guide",
    description:
      "Wushu, Kung Fu, Karate, Judo, kick boxing and boxing in Perambur, Chennai — what's taught, who it suits, and how to pick a class near you.",
    excerpt:
      "If you're searching for a martial arts class in Perambur or north Chennai, here's how to judge one — and what we actually teach.",
    readingMinutes: 6,
    category: "Martial Arts",
    keywords: [
      "martial arts classes Perambur",
      "martial arts classes north Chennai",
      "Wushu classes Perambur",
      "karate classes Perambur Chennai",
      "martial arts near me Chennai",
      "Spartacus Martial Arts Academy",
    ],
    image: "/images/gesture.webp",
    imageAlt: "Martial arts training in Perambur, Chennai",
    quickAnswer:
      "Spartacus Martial Arts Academy in Perambur, Chennai teaches Wushu, Kung Fu, Karate, Judo, kick boxing and boxing to children, teenagers and adults. It is led by Kishore Kumar, a Wushu National Medalist, Kung Fu Black Belt and Sports Psychologist, and mental-skills training is built into the coaching rather than taught separately.",
    sections: [
      {
        heading: "Why the area matters more than you'd think",
        body: [
          "The best academy in Chennai is worthless to you if it is forty minutes away in traffic. Consistency is what produces results in martial arts, and consistency dies the moment training becomes a logistical argument twice a week.",
          "If you are in Perambur, Otteri, Ayanavaram, Korukkupet or Kolathur, train near home. A slightly less famous academy you actually attend beats a famous one you skip.",
        ],
      },
      {
        heading: "What we teach, and who each suits",
        body: ["Six disciplines, matched to what you actually want:"],
        list: [
          "Wushu — the competitive route, and the one I came through to national level. Strong on body control, form and, in Sanda, full-contact composure.",
          "Kung Fu — traditional depth and structure, for people who want the philosophy alongside the craft.",
          "Karate — clean linear technique with visible progression. A good first discipline for children.",
          "Judo — throws, grappling and safe falling. Excellent for confidence, because you stop fearing the ground.",
          "Kick boxing and boxing — conditioning, timing and pressure tolerance, with the fastest visible fitness gains.",
        ],
      },
      {
        heading: "What to check before you enrol anywhere",
        body: [
          "Visit during an actual class, not a scheduled tour. Watch whether every child gets corrected or merely supervised — that ratio is the difference between coaching and childcare.",
          "Ask what the coach has competed in and who certifies their grade. In Chennai this varies enormously, and it is a fair question that a real coach will answer happily.",
        ],
      },
      {
        heading: "The part most academies leave out",
        body: [
          "Technique is only half of performance. Most students who plateau are not lacking a better kick — they are losing focus under pressure, or their confidence collapses after one mistake.",
          "Because I also work as a sports psychologist, that half is trained on the mat, in the moment it shows up, rather than in a separate seminar after a bad season.",
        ],
        link: {
          href: "/blog/warrior-mind-method-five-pillars/",
          label: "How the Warrior Mind Method™ trains it",
        },
      },
    ],
    faqs: [
      {
        q: "Where in Chennai is the academy?",
        a: "Perambur, in north Chennai. It also serves nearby areas including Otteri, Ayanavaram, Korukkupet and Kolathur.",
      },
      {
        q: "Do you offer a trial class?",
        a: "Yes — message on WhatsApp to arrange one. Coming to watch or try a session is the only reliable way to judge whether an academy suits you.",
      },
      {
        q: "Which martial art should I start with?",
        a: "Choose by goal, not by style. Competition suits Wushu, confidence and safe falling suit Judo, structured progression for children suits Karate, and fitness with pressure tolerance suits kick boxing.",
      },
    ],
  },

  {
    slug: "how-to-choose-martial-arts-academy-chennai",
    title: "How to Choose a Martial Arts Academy in Chennai",
    description:
      "Seven things to check before enrolling at a Chennai martial arts academy — and the three warning signs most parents miss.",
    excerpt:
      "Every academy says it builds discipline and confidence. Here is how to tell which ones actually do.",
    readingMinutes: 7,
    category: "For Parents",
    keywords: [
      "how to choose martial arts academy",
      "best martial arts academy Chennai",
      "martial arts school Chennai",
      "choosing karate class for child",
    ],
    image: "/images/strong-mind.webp",
    imageAlt: "Parent choosing a martial arts academy in Chennai",
    quickAnswer:
      "Judge a Chennai martial arts academy on five things: the coach's verifiable credentials, whether every student is actually corrected in a session, a structured grading path, a visible safety culture, and honest pricing. Visit an ordinary class unannounced — a scheduled tour shows you the academy at its best, not its normal.",
    sections: [
      {
        heading: "Watch a normal class, not a demo",
        body: [
          "Ask to observe a regular session on an ordinary day. Demonstrations are choreographed; ordinary Tuesdays are what your child will actually get.",
          "Count how many students receive an individual correction. If a coach is managing thirty children and correcting three, you are paying for supervision.",
        ],
      },
      {
        heading: "Ask about the coach, specifically",
        body: [
          "Not \"are you qualified\" but \"what have you competed in, at what level, and who awarded your grade\". Standards vary widely across Chennai academies, and a genuine coach answers this without defensiveness.",
          "Competitive experience is not everything, but a coach who has stood in a holding area before a final understands something about nerves that cannot be read in a book.",
        ],
      },
      {
        heading: "Five things worth checking",
        body: [],
        list: [
          "Progression — can they show you the syllabus between grades, or do belts simply arrive?",
          "Ratio — enough coaches that every student is seen, not just counted.",
          "Safety — warm-ups taken seriously, falling taught early, no contact sparring before control is established.",
          "Trial class — any confident academy offers one. Reluctance is information.",
          "Transparent fees — the full cost including uniform, grading and competition entry, stated up front.",
        ],
      },
      {
        heading: "Three warning signs",
        body: [],
        list: [
          "Belts every few weeks regardless of standard. Children work out faster than adults that the belt means nothing.",
          "Long contracts with no trial. Confidence in the product removes the need to lock people in.",
          "Promises to fix behaviour. Martial arts builds capacity — attention, frustration tolerance, self-regulation. An academy sold as a disciplinary service makes the child resent the mat.",
        ],
      },
      {
        heading: "What a realistic timeline looks like",
        body: [
          "Expect better attention in class within a few months, and a visible confidence change around six months — particularly after a first grading or first competition.",
          "Anyone promising a transformed child in four weeks is selling you something other than training.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much do martial arts classes cost in Chennai?",
        a: "Fees vary widely by academy, discipline and frequency. Ask for the total cost including uniform, grading and competition fees rather than the monthly figure alone, since the extras are where budgets are usually missed.",
      },
      {
        q: "How do I know if a coach is genuinely qualified?",
        a: "Ask what they have competed in, at what level, and which body awarded their grade or coaching certification. Verifiable answers — a federation, a national event — are the standard to expect.",
      },
      {
        q: "Should my child try more than one martial art?",
        a: "Trying two or three before committing is sensible. Most people discover their preference within the first three months.",
      },
    ],
  },

  {
    slug: "sports-psychologist-chennai-what-to-expect",
    title: "Working With a Sports Psychologist in Chennai: What to Expect",
    description:
      "What actually happens in sports psychology sessions, how long results take, what it costs, and how to tell real coaching from motivational talk.",
    excerpt:
      "Most people picture a motivational speech. The real work looks far more like training than talking.",
    readingMinutes: 7,
    category: "Sports Psychology",
    keywords: [
      "sports psychologist Chennai",
      "sports psychology sessions Chennai",
      "sports psychology cost India",
      "mental coach for athletes Chennai",
      "Kishore Kumar sports psychologist",
    ],
    image: "/images/portrait.webp",
    imageAlt: "Sports psychology session in Chennai",
    quickAnswer:
      "A sports psychology session is skills training, not a pep talk. The first session finds where performance is leaking — usually attention, arousal or mistake recovery. After that you practise specific drills under increasing pressure until they hold in competition. Simple tools show up within two to three weeks; season-long consistency takes a few months.",
    sections: [
      {
        heading: "The first session",
        body: [
          "We find where performance is actually leaking, which is rarely where the athlete thinks it is. Someone who says they lack confidence often has an attention problem — their confidence recovers once they stop tracking the wrong things mid-performance.",
          "You should leave the first session with one specific thing to practise, not a general feeling of encouragement.",
        ],
      },
      {
        heading: "What the work looks like after that",
        body: [
          "You drill. The skills are mental, but they are learned the same way a kick is: rehearsed calm first, then under fatigue, then under social pressure, then in competition simulation.",
          "A skill that only works when calm is not a skill yet. That progression is the whole method, and it is why martial arts is the delivery vehicle — it supplies the pressure.",
        ],
      },
      {
        heading: "Honest timelines",
        body: [],
        list: [
          "Two to three weeks — a reset routine or pre-performance sequence starts working, if practised at fixed moments rather than randomly.",
          "Two to three months — attention control and competition confidence become reliable rather than occasional.",
          "A season — consistency across events, and a comeback response that holds when it matters.",
        ],
      },
      {
        heading: "What it costs, and how to judge value",
        body: [
          "Formats differ: group workshops are the accessible entry point, one-to-one coaching costs more and moves faster. Rather than compare monthly figures, ask two questions of anyone offering this in Chennai.",
          "First: what will I be practising, and how will we know it is working? An answer with no drills and no measure describes a talk, not training. Second: have you competed? Not because it is required to understand the science, but because an athlete tries a technique under pressure only if they trust the person who gave it to them.",
        ],
        link: {
          href: "/programs/",
          label: "See the programs and formats",
        },
      },
      {
        heading: "Who it is not for",
        body: [
          "Sports psychology is performance coaching, not clinical treatment. If an athlete is dealing with depression, an eating disorder or an anxiety disorder, that needs a clinical psychologist or psychiatrist — and saying so is part of doing this job responsibly.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does a sports psychology session cost in Chennai?",
        a: "It depends on format. Group workshops are the most accessible entry point; one-to-one coaching costs more and progresses faster. Message on WhatsApp for current formats and pricing.",
      },
      {
        q: "How many sessions will I need?",
        a: "Most athletes notice specific tools working within two to three weeks. Durable change — consistency across a season — usually takes a few months of deliberate practice.",
      },
      {
        q: "Is this only for elite athletes?",
        a: "No. School and college athletes often benefit most, because they are building these habits before bad ones set in.",
      },
      {
        q: "Do you offer online sessions?",
        a: "Yes. In-person coaching runs in Chennai; online sessions are available across India and for athletes abroad.",
      },
    ],
  },

  {
    slug: "kids-martial-arts-chennai-age-guide",
    title: "Kids' Martial Arts in Chennai: Age Guide for Parents",
    description:
      "What age children can start martial arts, what each age group actually trains, and what to expect in the first six months.",
    excerpt:
      "The honest answer to \"is my child old enough\" is that it depends far more on the class than the birthday.",
    readingMinutes: 6,
    category: "For Parents",
    keywords: [
      "kids martial arts Chennai",
      "what age can child start martial arts",
      "children karate classes Chennai",
      "martial arts for 5 year old",
      "kids self defence Chennai",
    ],
    image: "/images/hero-wide.webp",
    imageAlt: "Children's martial arts class in Chennai",
    quickAnswer:
      "Most children can begin structured martial arts around age six, when they can follow sequenced instructions and train safely in a group. Younger children benefit from movement and coordination sessions rather than technique. The deciding factor is whether the class is age-appropriate, not the child's birthday.",
    sections: [
      {
        heading: "What each age group actually trains",
        body: [],
        list: [
          "Ages 4–6 — coordination, balance, following instructions, and basic body control. Play-led, with very little formal technique.",
          "Ages 6–9 — stances, basic strikes and kicks, safe falling, and the beginnings of a grading path. Discipline arrives through structure, not lectures.",
          "Ages 9–13 — real technical progression, light controlled sparring once fundamentals hold, and the first competitions for those who want them.",
          "Teenagers — full technical training, competition if they choose it, and the mental side becomes as important as the physical.",
        ],
      },
      {
        heading: "The first six months, realistically",
        body: [
          "Expect far more basics than technique, and expect that to be the point. Stances are the unglamorous foundation everything else is built on, and children who skip them plateau early.",
          "Attention in class usually improves within a few months. Visible confidence changes tend to show around six months, particularly after a first grading — the moment a child experiences earning something through repeated effort.",
        ],
      },
      {
        heading: "What it gives beyond self-defence",
        body: [
          "Discipline taught verbally is abstract. Discipline taught through a stance is immediate: the child sees the correction, feels the difference, repeats it. The feedback loop is short enough that effort and result stay visibly connected.",
          "Over months that connection generalises. A child who learns that ten more repetitions visibly improves a kick starts applying the same logic to schoolwork, usually without anyone drawing the parallel for them.",
        ],
      },
      {
        heading: "Safety, honestly",
        body: [
          "Injury risk in properly coached children's martial arts is low — comparable to or below most team sports. What makes it low is specific: taught falling technique, mandatory warm-ups, and no contact sparring until control is established.",
          "Ask any Chennai academy directly how they handle those three. A good coach has a clear answer ready.",
        ],
      },
    ],
    faqs: [
      {
        q: "What age can my child start martial arts?",
        a: "Around six for structured classes. Younger children can benefit from movement-based sessions focused on coordination and following instructions rather than technique.",
      },
      {
        q: "Is martial arts safe for young children?",
        a: "Yes, with proper coaching. Look for taught falling technique, mandatory warm-ups, and no contact sparring until fundamentals and control are established.",
      },
      {
        q: "Will martial arts make my child aggressive?",
        a: "The evidence points the other way. Structured martial arts training is associated with better self-regulation, because control is the thing being explicitly trained.",
      },
      {
        q: "My child is shy — is this suitable?",
        a: "Often especially suitable. Progress is individual rather than team-dependent, so a shy child succeeds without having to compete socially for a place.",
      },
    ],
  },
];

/** Published together; dated the day the local cluster went live. */
export const LOCAL_POSTS: BlogPost[] = LOCAL_SEEDS.map((p) => ({
  ...p,
  publishedAt: "2026-09-07",
}));
