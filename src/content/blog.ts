/**
 * Blog content — the site's SEO / AEO / GEO surface.
 *
 * Why this file rather than MDX: every post carries structured fields
 * (quickAnswer, faqs, keywords) that feed JSON-LD directly. Keeping them as
 * typed data means the schema can never drift from the prose, and a missing
 * field is a build error rather than a silently absent rich result.
 *
 * The three jobs each post does:
 *
 *  SEO  conventional ranking — title, description, headings, internal links,
 *       and a keyword set built around "Kishore Kumar + <discipline/place>"
 *       rather than the bare name. The bare name belongs to the playback
 *       singer and is not winnable; the qualified variants are.
 *
 *  AEO  answer engines. Every post opens with `quickAnswer`, a self-contained
 *       40–60 word reply written so it survives being lifted out of context —
 *       which is exactly what an AI summary or featured snippet does to it.
 *       The FAQ pairs become FAQPage schema.
 *
 *  GEO  local intent. Chennai, its neighbourhoods and Tamil Nadu appear in
 *       body copy where they read naturally, and every post links back to the
 *       LocalBusiness entity so the blog reinforces one place, not many.
 */

export type BlogSection = {
  heading: string;
  body: string[];
  list?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  /** Meta description — kept under ~155 chars so it isn't truncated. */
  description: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  category: string;
  keywords: string[];
  image: string;
  imageAlt: string;
  /** AEO: the liftable direct answer. Must stand alone. */
  quickAnswer: string;
  sections: BlogSection[];
  faqs: { q: string; a: string }[];
  /** YouTube video ID, when the post has an accompanying video. */
  video?: { id: string; title: string };
};

export const BLOG_CATEGORIES = [
  "Sports Psychology",
  "Warrior Mind Method",
  "Martial Arts",
  "For Parents",
  "For Athletes",
] as const;

export const POSTS: BlogPost[] = [
  {
    slug: "who-is-kishore-kumar-sports-psychologist-chennai",
    title:
      "Who Is Kishore Kumar? Chennai's Sports Psychologist & National Wushu Medalist",
    description:
      "Kishore Kumar is a National Wushu Medalist, sports psychologist and martial arts coach in Chennai, and the creator of the Warrior Mind Method™.",
    excerpt:
      "The short version of who I am, what I actually do, and who I work with — for athletes, parents and academies trying to work out whether I'm the right coach.",
    publishedAt: "2026-08-04",
    readingMinutes: 5,
    category: "Sports Psychology",
    keywords: [
      "Kishore Kumar sports psychologist",
      "Kishore Kumar Chennai",
      "Kishore Kumar Wushu coach",
      "Kishore Kumar martial arts",
      "sports psychologist Chennai",
      "Spartacus Martial Arts Chennai",
    ],
    image: "/images/portrait.jpg",
    imageAlt:
      "Kishore Kumar, sports psychologist and martial arts coach, Chennai",
    quickAnswer:
      "Kishore Kumar is a sports psychologist, National Wushu Medalist and martial arts coach based in Chennai, Tamil Nadu. He founded Spartacus Martial Arts Chennai and created the Warrior Mind Method™, a five-part system that trains focus, confidence, emotional control and pressure handling for competitive athletes.",
    sections: [
      {
        heading: "The two halves of the work",
        body: [
          "Most coaches come from one side or the other. Either they have competed and can teach the physical craft, or they have studied psychology and can talk about the mind. I work from both, and that combination is the whole point.",
          "I competed as a Wushu athlete and medalled at national level. I have also studied sports psychology formally and now serve as a state-level judge. That means when an athlete tells me their legs went heavy in the holding area before a final, I am not reasoning about it from a textbook. I know that feeling, and I know which drills move it.",
        ],
      },
      {
        heading: "Who I actually work with",
        body: [
          "The people who get the most from this work usually fall into one of four groups:",
        ],
        list: [
          "Competitive athletes who train hard, perform well in practice, and then underperform on the day it counts.",
          "Students balancing sport with academic pressure, where focus is the scarce resource rather than fitness.",
          "Parents who can see their child has talent but is being held back by nerves, self-doubt or inconsistency.",
          "Schools and academies in Chennai that want structured mental-skills training built into their coaching, not bolted on after a bad season.",
        ],
      },
      {
        heading: "Why the martial arts base matters",
        body: [
          "Sports psychology delivered as a lecture rarely survives contact with competition. An athlete under pressure does not recall a slide; they fall back on what they have rehearsed.",
          "Martial arts training is built around rehearsing composure under escalating stress. That gives me a delivery system for psychological skills — you practise the breathing, the reset routine and the refocus cue while someone is actively pressuring you, which is the only condition under which they become reliable.",
        ],
      },
      {
        heading: "Where I'm based",
        body: [
          "I coach in Chennai, Tamil Nadu, working with athletes and academies across the city and surrounding districts, and online for athletes elsewhere in India. Spartacus Martial Arts Chennai is the home base for in-person training.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Kishore Kumar a qualified sports psychologist?",
        a: "Yes. Kishore Kumar has studied sports psychology and applies it professionally with competitive athletes, alongside his background as a National Wushu Medalist, coach and state-level judge.",
      },
      {
        q: "Where does Kishore Kumar coach?",
        a: "Chennai, Tamil Nadu — in person through Spartacus Martial Arts Chennai, and online for athletes based elsewhere in India.",
      },
      {
        q: "What is the Warrior Mind Method™?",
        a: "It is Kishore Kumar's five-pillar coaching framework — Focus, Fire, Flow, Forge and Fight — combining sports psychology with martial-arts discipline to build competition-ready mental skills.",
      },
    ],
  },

  {
    slug: "sports-psychology-chennai-athletes-guide",
    title: "Sports Psychology in Chennai: A Practical Guide for Athletes",
    description:
      "What sports psychology actually does for athletes, how a session works, and how to find sports psychology coaching in Chennai that isn't just motivational talk.",
    excerpt:
      "Sports psychology has a reputation problem in India — it gets confused with motivational speaking. Here's what the real work looks like.",
    publishedAt: "2026-08-04",
    readingMinutes: 7,
    category: "Sports Psychology",
    keywords: [
      "sports psychology Chennai",
      "sports psychologist Chennai",
      "mental training for athletes Chennai",
      "sports psychology India",
      "Kishore Kumar sports psychology",
    ],
    image: "/images/strong-mind.jpg",
    imageAlt: "Athlete mental training session in Chennai",
    quickAnswer:
      "Sports psychology gives athletes trainable mental skills — attention control, arousal regulation, pre-performance routines and recovery from mistakes. It is not motivational speaking. In Chennai, Kishore Kumar delivers it through the Warrior Mind Method™, combining psychological technique with martial-arts practice so the skills hold under real competitive pressure.",
    sections: [
      {
        heading: "What it is not",
        body: [
          "The most common misunderstanding is that sports psychology means someone shouting encouragement before a match. That is motivation, it lasts about ninety seconds, and it is not what this is.",
          "Sports psychology is skills training. The skills happen to be mental rather than physical, but they are learned the same way anything else is — through specific drills, repeated under increasing pressure, until they hold without conscious effort.",
        ],
      },
      {
        heading: "The four skills that matter most",
        body: [
          "Across the athletes I work with in Chennai, the same four capacities account for most of the gap between training form and competition form:",
        ],
        list: [
          "Attention control — deciding what to notice and, more importantly, what to ignore. Most competitive errors are attention errors.",
          "Arousal regulation — being able to move your own activation up or down deliberately, rather than hoping you happen to feel right on the day.",
          "Pre-performance routine — a fixed, rehearsed sequence that makes the start of your performance identical whether it is a practice bout or a final.",
          "Mistake recovery — a trained reset that stops one error becoming three. This single skill changes more results than any other.",
        ],
      },
      {
        heading: "What a session actually looks like",
        body: [
          "We start by finding where performance is leaking. That is usually not where the athlete thinks it is — someone who says they lack confidence often has an attention problem, and their confidence recovers once they stop tracking the wrong things mid-performance.",
          "Then we drill. You practise the skill in a calm setting until it is smooth, then under physical fatigue, then under social pressure, then in competition simulation. A skill that only works calm is not yet a skill.",
        ],
      },
      {
        heading: "Finding the right coach in Chennai",
        body: [
          "Ask two questions of anyone offering this in Chennai. First: what will I be practising, and how will we know it is working? If the answer has no drills and no measure, it is a talk, not training.",
          "Second: have you competed? Not because competing is required to understand the science, but because an athlete will trust technique from someone who has stood in the same holding area, and trust is what makes them actually try it under pressure.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does sports psychology coaching cost in Chennai?",
        a: "It varies by format. Group workshops are the most accessible entry point, while one-to-one coaching costs more and moves faster. Kishore Kumar runs both — workshops, a 7-day challenge, a 21-day transformation and personal coaching.",
      },
      {
        q: "How long before sports psychology shows results?",
        a: "Simple tools like a reset routine or a pre-performance sequence often show up within two to three weeks. Deeper changes — competition confidence, consistency across a season — typically take a few months of deliberate practice.",
      },
      {
        q: "Is sports psychology only for elite athletes?",
        a: "No. School and college athletes often benefit most, because they are learning these habits before bad ones set in.",
      },
    ],
  },

  {
    slug: "warrior-mind-method-five-pillars",
    title: "The Warrior Mind Method™: Kishore Kumar's Five-Pillar Framework",
    description:
      "Focus, Fire, Flow, Forge and Fight — the five pillars of the Warrior Mind Method™, the athlete mindset system created by Kishore Kumar in Chennai.",
    excerpt:
      "Every pillar exists because I kept seeing the same five failure modes in competitive athletes. Here's what each one trains.",
    publishedAt: "2026-08-04",
    readingMinutes: 8,
    category: "Warrior Mind Method",
    keywords: [
      "Warrior Mind Method",
      "Kishore Kumar Warrior Mind Method",
      "athlete mindset framework",
      "mental training system for athletes",
    ],
    image: "/images/gesture.jpg",
    imageAlt: "Kishore Kumar coaching the Warrior Mind Method in Chennai",
    quickAnswer:
      "The Warrior Mind Method™ is a five-pillar athlete mindset system created by Kishore Kumar: Focus (attention and distraction control), Fire (motivation and confidence), Flow (calm execution under pressure), Forge (discipline and consistent habits) and Fight (pressure handling and comeback mindset).",
    sections: [
      {
        heading: "Why five pillars",
        body: [
          "The framework is not an arbitrary acronym. Each pillar exists because it names a distinct way athletes lose, and the fix for each is genuinely different. Treating them as one thing called 'mindset' is why generic advice fails.",
        ],
      },
      {
        heading: "Focus — attention and distraction control",
        body: [
          "The ability to choose what you attend to and hold it there. Athletes lose here by tracking the scoreboard, the opponent's coach, or their own internal commentary instead of the task.",
          "Trained with narrowing and widening drills, cue words, and deliberately practising in distracting conditions rather than only in quiet ones.",
        ],
      },
      {
        heading: "Fire — motivation, drive and confidence",
        body: [
          "The engine. Not hype — hype is borrowed energy that runs out. Fire is the internal reason that survives a bad week, an injury, or a coach who has stopped giving you attention.",
          "Trained through process goals, evidence logging, and separating identity from results so a loss does not become a verdict on who you are.",
        ],
      },
      {
        heading: "Flow — calm execution",
        body: [
          "Performing without over-thinking. Most athletes have felt it and assume it is luck. It is more reliable than that: flow follows from a clear task focus, a matched challenge level, and a body that is not over-aroused.",
          "Trained through breathing control, tempo work and pre-performance routines that reliably drop you into the same state.",
        ],
      },
      {
        heading: "Forge — discipline and habit",
        body: [
          "The unglamorous pillar and the one that decides seasons. Forge is what makes you train correctly on the day nobody is watching and nothing feels good.",
          "Trained by shrinking the unit of commitment, designing the environment so the right action is the easy one, and tracking streaks that make consistency visible.",
        ],
      },
      {
        heading: "Fight — pressure and comeback",
        body: [
          "What happens after it goes wrong. The comeback response is the single most trainable, least trained skill in competitive sport.",
          "Trained with mistake-recovery routines, deliberate adversity in practice, and rehearsing the specific scenario the athlete fears most until it stops being novel.",
        ],
      },
    ],
    faqs: [
      {
        q: "Who created the Warrior Mind Method?",
        a: "Kishore Kumar, a sports psychologist, National Wushu Medalist and martial arts coach based in Chennai, Tamil Nadu.",
      },
      {
        q: "Do I need a martial arts background to use it?",
        a: "No. The pillars apply to any competitive sport. Martial arts is the delivery vehicle, not a prerequisite.",
      },
      {
        q: "Which pillar should I start with?",
        a: "Most athletes start with Focus, because attention errors are the most common and the fastest to improve. If the problem is consistency rather than performance, start with Forge.",
      },
    ],
  },

  {
    slug: "why-talented-athletes-underperform-competition",
    title: "Why Talented Athletes Underperform in Competition",
    description:
      "Training form and competition form are different skills. Here is why talented athletes underperform on the day, and what actually fixes it.",
    excerpt:
      "The athlete who looks best in practice is often not the one who wins. That gap is a trainable problem, not a character flaw.",
    publishedAt: "2026-08-04",
    readingMinutes: 6,
    category: "For Athletes",
    keywords: [
      "why athletes underperform",
      "competition anxiety",
      "choking under pressure sport",
      "athlete mindset coach Chennai",
    ],
    image: "/images/hero-wide.jpg",
    imageAlt: "Athlete preparing for competition",
    quickAnswer:
      "Talented athletes underperform in competition mainly because pressure shifts attention inward, turning automatic skills back into conscious ones. The fix is not more physical training — it is rehearsing attention control, pre-performance routines and mistake recovery under deliberately raised pressure, so competition stops being an unfamiliar state.",
    sections: [
      {
        heading: "The mechanism",
        body: [
          "Skilled movement is automatic. Under pressure, athletes start monitoring the movement consciously — checking their grip, their footwork, their form. Conscious control is slower and clumsier than the automatic version, so performance drops precisely because they are trying harder.",
          "This is why 'just relax' fails as advice. The problem is not tension in the abstract; it is where attention has gone.",
        ],
      },
      {
        heading: "Four things that reliably help",
        body: [],
        list: [
          "An external focus cue. Attend to the target or the effect, not to your own limb. This alone recovers a surprising amount of lost performance.",
          "A fixed pre-performance routine, identical in practice and competition, so the start of your performance is never novel.",
          "Pressure inoculation — training with consequences, an audience, fatigue or a scoreboard, so competition is not the first pressured rep you have taken.",
          "A rehearsed mistake-recovery cue, so one error does not cascade.",
        ],
      },
      {
        heading: "What does not help",
        body: [
          "Telling an athlete they need to want it more. In almost every case I have seen in Chennai, the underperforming athlete wants it more than the one beating them — that surplus wanting is part of the pressure.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is choking under pressure permanent?",
        a: "No. It is a trained response and it responds to training. Most athletes see meaningful change within a few weeks of practising attention control and a pre-performance routine.",
      },
      {
        q: "Should I train harder physically to fix this?",
        a: "Rarely. If your practice form is good and your competition form is not, the gap is not fitness or technique — adding volume usually increases the pressure rather than reducing it.",
      },
    ],
  },

  {
    slug: "build-focus-for-competition",
    title: "How to Build Focus for Competition: A Trainable Skill",
    description:
      "Focus is not willpower — it is a skill with drills. Practical attention-control training for athletes, from Chennai sports psychologist Kishore Kumar.",
    excerpt:
      "Most athletes treat focus as something you either have on the day or you don't. It is far more trainable than that.",
    publishedAt: "2026-08-04",
    readingMinutes: 6,
    category: "For Athletes",
    keywords: [
      "how to build focus for athletes",
      "focus training athletes",
      "concentration training sport",
      "focus coaching Chennai",
    ],
    image: "/images/strong-mind.jpg",
    imageAlt: "Focus training drill for athletes",
    quickAnswer:
      "Focus is trained, not summoned. The core skills are narrowing and widening attention on demand, using a single cue word to reset, and deliberately practising in distracting conditions. Athletes who only ever train in quiet conditions have not trained focus at all — they have trained in the absence of a need for it.",
    sections: [
      {
        heading: "Attention has a width",
        body: [
          "Useful attention is not just 'concentrating harder'. It has a width you should be able to change on purpose — wide to scan an opponent's position, narrow to execute a technique, then wide again.",
          "Athletes who get stuck wide miss their execution. Athletes stuck narrow get caught by things they should have seen. Both are fixable by practising the switch itself.",
        ],
      },
      {
        heading: "A drill you can start this week",
        body: [
          "Pick one cue word. It should be a task instruction, not encouragement — 'target', 'tempo', 'hands', not 'come on'.",
          "In every training session, use it at three fixed moments: before the first rep, after any mistake, and before the last rep. Same word, every time. Within a few weeks it acquires the state it has been paired with, and you can use it in competition to fetch that state back.",
        ],
      },
      {
        heading: "Train in noise",
        body: [
          "If your focus only works in a silent hall, it is not ready. Add a radio, spectators, a coach calling numbers — anything that competes for attention. The goal is not to enjoy it; it is to make competition feel comparatively easy.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long does it take to improve focus?",
        a: "Athletes usually notice a difference within two to three weeks of consistent cue-word practice, provided it is used at fixed moments rather than randomly.",
      },
      {
        q: "Does meditation help athletic focus?",
        a: "It helps, but it is not sufficient on its own. Meditation trains attention in stillness; competition requires attention while moving, fatigued and pressured, so sport-specific drills matter more.",
      },
    ],
  },

  {
    slug: "competition-anxiety-athletes-chennai",
    title: "Competition Anxiety: What To Do the Week, Night and Hour Before",
    description:
      "A practical timeline for managing competition nerves — what to do in the final week, the night before, and the hour before you compete.",
    excerpt:
      "Nerves are not the enemy; unmanaged nerves are. Here's what to actually do, mapped to when.",
    publishedAt: "2026-08-04",
    readingMinutes: 7,
    category: "For Athletes",
    keywords: [
      "competition anxiety",
      "pre-competition nerves",
      "sports anxiety help Chennai",
      "pressure handling athletes",
    ],
    image: "/images/hero-wide.jpg",
    imageAlt: "Athlete managing pre-competition nerves",
    quickAnswer:
      "Competition nerves are managed with a timeline, not willpower. In the final week, reduce novelty and rehearse your routine. The night before, prepare equipment and run a short visualisation. In the final hour, control breathing, keep attention external, and follow a fixed warm-up sequence you have used many times before.",
    sections: [
      {
        heading: "The final week — remove novelty",
        body: [
          "Anxiety feeds on the unfamiliar. Everything you can make routine in advance is one less thing demanding attention on the day.",
          "Rehearse your warm-up exactly as you will do it. Eat what you will eat. If you can visit the venue, do. Novelty is the tax you pay on competition day, and it is prepayable.",
        ],
      },
      {
        heading: "The night before",
        body: [],
        list: [
          "Pack fully, so the morning has no decisions in it.",
          "Run a short visualisation — five minutes, first-person, including one thing going wrong and you recovering from it. Rehearsing only success leaves you unprepared for the most likely scenario.",
          "Do not review technique. Late technical thinking increases conscious control, which is the mechanism that causes underperformance.",
        ],
      },
      {
        heading: "The final hour",
        body: [
          "Lengthen your exhale. A longer out-breath than in-breath reliably lowers arousal, and unlike most advice it works within a minute.",
          "Keep attention external and task-focused. Scanning your own body for signs of nerves is how you find them.",
          "Follow your fixed warm-up. Its value is not physical — it is that the sequence is familiar when nothing else is.",
        ],
      },
      {
        heading: "Reframing the feeling",
        body: [
          "The physical signature of anxiety and excitement is nearly identical: raised heart rate, quickened breath, alertness. Athletes who label it as readiness perform better than those who label it as fear, and the label is a choice you can rehearse.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I stop feeling nervous before a competition?",
        a: "You do not, and you should not want to. The goal is to keep arousal at a workable level and direct attention outward. Athletes who feel nothing before competing usually underperform.",
      },
      {
        q: "What breathing pattern works best before competing?",
        a: "Any pattern where the exhale is longer than the inhale — four in, six out is a reliable starting point. Practise it in training so it is familiar under pressure.",
      },
    ],
  },

  {
    slug: "wushu-training-chennai-beginners-guide",
    title: "Wushu Training in Chennai: A Beginner's Guide",
    description:
      "What Wushu is, how training is structured, what to expect in your first month, and how to start Wushu in Chennai with a National Medalist coach.",
    excerpt:
      "Wushu gets confused with everything from kung fu movies to gymnastics. Here's what training actually involves.",
    publishedAt: "2026-08-04",
    readingMinutes: 6,
    category: "Martial Arts",
    keywords: [
      "Wushu training Chennai",
      "Wushu classes Chennai",
      "martial arts classes Chennai",
      "Kishore Kumar Wushu coach",
      "Spartacus Martial Arts Chennai",
    ],
    image: "/images/gesture.jpg",
    imageAlt: "Wushu training session at Spartacus Martial Arts Chennai",
    quickAnswer:
      "Wushu is a Chinese martial art with two competitive branches: Taolu, judged routines of form and technique, and Sanda, full-contact fighting. Beginner training in Chennai starts with stances, basic strikes and conditioning before either branch. At Spartacus Martial Arts Chennai, coaching is led by National Wushu Medalist Kishore Kumar.",
    sections: [
      {
        heading: "The two branches",
        body: [
          "Taolu is the routine side — choreographed sequences judged on precision, power, balance and difficulty. It rewards patience and body control.",
          "Sanda is the combat side — a full-contact format combining striking with throws. It rewards timing, composure and the ability to think while tired.",
          "Beginners train shared fundamentals before choosing. Most people discover their preference somewhere in the first three months.",
        ],
      },
      {
        heading: "Your first month",
        body: ["Expect much more basics than technique. Specifically:"],
        list: [
          "Stances — the unglamorous foundation everything else is built on.",
          "Basic strikes and kicks, drilled slowly for shape before any speed.",
          "Conditioning and flexibility, which will be the limiting factor for most adults.",
          "Falling and recovery, taught early, because confidence comes from knowing you can land safely.",
        ],
      },
      {
        heading: "What it gives you beyond fighting",
        body: [
          "The reason I teach martial arts alongside sports psychology is that Wushu training is unusually good at building the mental capacities other sports assume you already have — tolerance for repetition, composure while being pressured, and the habit of returning to form after failure.",
        ],
      },
    ],
    faqs: [
      {
        q: "What age can children start Wushu?",
        a: "Most children can start structured Wushu from around six, with training focused on coordination, discipline and safe movement rather than competition.",
      },
      {
        q: "Do I need to be fit to start Wushu?",
        a: "No. Conditioning is part of the training. Starting unfit is normal; starting is the only prerequisite.",
      },
      {
        q: "Is Wushu useful for self-defence?",
        a: "Sanda in particular develops practical striking, clinch and throwing skills, along with the composure to use them under stress.",
      },
    ],
  },

  {
    slug: "martial-arts-discipline-children-chennai-parents",
    title: "Martial Arts for Discipline: A Chennai Parent's Guide",
    description:
      "How martial arts builds discipline, focus and confidence in children — what to look for in a Chennai academy, and what to be sceptical of.",
    excerpt:
      "Most parents come to me saying the same sentence: he's bright, but he won't sit still. Here's what martial arts does and doesn't fix.",
    publishedAt: "2026-08-04",
    readingMinutes: 7,
    category: "For Parents",
    keywords: [
      "martial arts for kids Chennai",
      "discipline for children martial arts",
      "kids martial arts classes Chennai",
      "confidence building children Chennai",
    ],
    image: "/images/portrait.jpg",
    imageAlt: "Children's martial arts class in Chennai",
    quickAnswer:
      "Martial arts builds discipline in children by making standards visible and immediate — a stance is either correct or not, and improvement is earned in small, repeatable steps. In Chennai, parents should look for an academy with structured progression, a low student-to-coach ratio, and coaches who correct technique rather than only manage behaviour.",
    sections: [
      {
        heading: "Why it works when lectures don't",
        body: [
          "Discipline taught verbally is abstract. Discipline taught through a stance is immediate — the child can see the correction, feel the difference, and repeat it. The feedback loop is short enough that effort and result stay connected.",
          "Over months, that connection generalises. The child who learns that ten more repetitions visibly improves a kick starts applying the same logic to schoolwork, without anyone having made the analogy explicit.",
        ],
      },
      {
        heading: "What to look for in a Chennai academy",
        body: [],
        list: [
          "Structured progression, so the child always knows what they are working toward.",
          "A ratio low enough that every child is actually corrected in a session, not just supervised.",
          "Coaches who teach the why, not only the what — children comply with rules but commit to reasons.",
          "A safety culture: warm-ups taken seriously, falling taught early, and no sparring before the fundamentals are in place.",
        ],
      },
      {
        heading: "What to be sceptical of",
        body: [
          "Rapid belt progression sold as achievement. If a belt arrives every few weeks regardless of standard, the belt has stopped meaning anything, and children work out the difference faster than adults expect.",
          "Also be wary of any programme promising to fix behaviour. Martial arts builds capacity — attention, frustration tolerance, self-regulation. It is not a disciplinary service, and framing it that way makes the child resent the mat.",
        ],
      },
      {
        heading: "A realistic timeline",
        body: [
          "Expect improved attention in class within a few months, and visible confidence changes around the six-month mark, particularly if the child has had a first grading or first competition by then.",
        ],
      },
    ],
    faqs: [
      {
        q: "What age should a child start martial arts?",
        a: "Around six for structured classes. Younger children can benefit from movement-based sessions focused on coordination rather than technique.",
      },
      {
        q: "Is martial arts safe for children?",
        a: "Yes, with proper coaching. Look for taught falling technique, mandatory warm-ups, and no contact sparring until fundamentals and control are established.",
      },
      {
        q: "Will martial arts make my child aggressive?",
        a: "The evidence points the other way. Structured martial arts training is associated with better self-regulation, because control is the thing being explicitly trained.",
      },
    ],
  },

  {
    slug: "mental-training-school-college-athletes-chennai",
    title: "Mental Training for School and College Athletes in Chennai",
    description:
      "How student athletes in Chennai can balance academic pressure and competition, and why mental skills training belongs in school sport programmes.",
    excerpt:
      "Student athletes carry two pressure systems at once. Almost nobody trains them for that.",
    publishedAt: "2026-08-04",
    readingMinutes: 6,
    category: "Sports Psychology",
    keywords: [
      "student athlete mental training Chennai",
      "school sports psychology Chennai",
      "college athletes mindset India",
      "sports psychology workshop schools Chennai",
    ],
    image: "/images/strong-mind.jpg",
    imageAlt: "School athletes in a mental skills workshop in Chennai",
    quickAnswer:
      "Student athletes face academic and competitive pressure simultaneously, which multiplies rather than adds. Effective mental training for school and college athletes in Chennai focuses on attention switching between contexts, realistic scheduling, sleep protection, and separating self-worth from both exam results and match results.",
    sections: [
      {
        heading: "Two pressure systems, one nervous system",
        body: [
          "A student athlete in Chennai during exam season is often carrying board-exam pressure and selection pressure in the same week. These do not queue politely; they compound.",
          "The practical consequence is that advice designed for full-time athletes — more training, more recovery, more focus on sport — is frequently the wrong prescription here.",
        ],
      },
      {
        heading: "What actually helps",
        body: [],
        list: [
          "Context switching drills — a deliberate ritual that closes one domain before opening the other, so study time is not spent replaying a match.",
          "Protecting sleep above training volume. Sleep is the first thing students cut and the thing that most degrades both performance and learning.",
          "Scheduling backwards from fixed commitments, so the plan survives contact with an exam timetable.",
          "Separating identity from both scoreboards. A student who is 'a person who trains' rather than 'a winner' survives a bad term without a crisis.",
        ],
      },
      {
        heading: "For schools and academies",
        body: [
          "Mental skills training works best built into the season rather than delivered as a one-off talk after a poor result. A short, recurring slot integrated into normal practice outperforms an annual seminar by a wide margin.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do schools in Chennai offer sports psychology?",
        a: "A growing number do, usually via visiting specialists. Kishore Kumar runs structured workshops for schools, colleges and academies across Chennai.",
      },
      {
        q: "Can mental training help academic performance too?",
        a: "Often yes. Attention control, routine design and stress regulation are domain-general skills, so students frequently report improvements in study as well as sport.",
      },
    ],
  },

  {
    slug: "confidence-training-for-athletes",
    title: "Confidence Training for Athletes: Building It on Evidence, Not Hype",
    description:
      "Real athletic confidence is built from evidence, not positive thinking. A practical method for building durable confidence before competition.",
    excerpt:
      "Confidence built on hype collapses the first time you lose. Confidence built on evidence doesn't.",
    publishedAt: "2026-08-04",
    readingMinutes: 6,
    category: "For Athletes",
    keywords: [
      "confidence training athletes",
      "sports confidence coaching Chennai",
      "self belief athletes",
      "athlete mindset coach India",
    ],
    image: "/images/gesture.jpg",
    imageAlt: "Athlete building competition confidence",
    quickAnswer:
      "Durable athletic confidence comes from accumulated evidence, not positive self-talk. The method is to log specific training wins, review them before competition, set process goals you fully control, and rehearse recovering from setbacks so confidence does not depend on things going well.",
    sections: [
      {
        heading: "Why affirmations underperform",
        body: [
          "Telling yourself you are the best works only while nothing contradicts it. The first bad round supplies the contradiction, and confidence built that way falls faster than it was built.",
          "Evidence-based confidence behaves differently. It is harder to shake because it is not a claim about outcomes — it is a record of things you have actually done.",
        ],
      },
      {
        heading: "The training log that does the work",
        body: [
          "After each session, write three specific things that went well. Specific is the operative word: 'good session' is worthless, 'held my guard through the third round when tired' is evidence.",
          "Before competition, read the last few weeks of entries. You are not hyping yourself; you are reminding yourself of a documented record. That is a different psychological act and it holds up under pressure.",
        ],
      },
      {
        heading: "Process goals over outcome goals",
        body: [
          "You do not control whether you win. You control your first-round tempo, your guard position, your reset after a mistake. Setting goals on the controllables means competition can go badly and you can still meet your goals — which is precisely what keeps confidence intact across a season.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I get confidence back after a bad loss?",
        a: "Separate the result from the performance. Review what you executed well independently of the outcome, and set the next session's goals on process rather than results.",
      },
      {
        q: "Does confidence come before or after success?",
        a: "Both, but the reliable direction is evidence first. Small documented wins build the confidence that makes bigger wins likelier.",
      },
    ],
  },
];

/** Newest first — the order the blog index and sitemap use. */
export const SORTED_POSTS = [...POSTS].sort(
  (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
);

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}
