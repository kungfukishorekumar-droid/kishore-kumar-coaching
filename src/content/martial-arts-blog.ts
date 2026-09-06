import type { BlogPost } from "./blog";

/**
 * Discipline-level articles.
 *
 * Every discipline here is also a service on the Google Business Profile, so
 * these do double duty: they answer the query organically and give the map-pack
 * listing a page to send people to. "Wushu classes Chennai" and "judo for kids"
 * are far higher commercial intent than general mindset content — the person
 * searching them is choosing where to enrol this month.
 *
 * Written from the coach's own position rather than as neutral explainers. On
 * Wushu especially that is not a stylistic choice: a National Medalist in the
 * discipline is a genuinely rare source for it in Chennai, and the writing
 * should read like one.
 */

const METHOD_HUB = "/blog/warrior-mind-method-five-pillars/";

const MA_SEEDS: Omit<BlogPost, "publishedAt">[] = [
  {
    slug: "wushu-taolu-vs-sanda-explained",
    title: "Wushu Explained: Taolu vs Sanda, and Which One Suits You",
    description:
      "Wushu has two competitive branches — Taolu (forms) and Sanda (full contact). What each trains, who each suits, and how to choose.",
    excerpt:
      "People hear 'Wushu' and picture film choreography. Competitive Wushu is two very different sports sharing a name.",
    readingMinutes: 7,
    category: "Martial Arts",
    keywords: [
      "Wushu Taolu Sanda difference",
      "what is Wushu",
      "Wushu classes Chennai",
      "Sanda training India",
      "Wushu competition India",
    ],
    image: "/images/gesture.webp",
    imageAlt: "Wushu training — Taolu forms and Sanda sparring",
    quickAnswer:
      "Wushu has two competitive branches. Taolu is judged routines, scored on precision, power, balance and difficulty. Sanda is full-contact fighting combining strikes with throws. Beginners train shared fundamentals — stances, basic strikes, conditioning — before choosing, and most discover their preference within about three months.",
    sections: [
      {
        heading: "Taolu — the judged side",
        body: [
          "Taolu is choreographed sequences performed for judges, scored on precision, power, balance and difficulty. It looks like the Wushu people know from film, but the scoring is unforgiving in a way film is not: a stance six inches off is a deduction, every time.",
          "It rewards patience and body control. If you enjoy refining the same movement a thousand times until it is exactly right, Taolu will suit you.",
        ],
      },
      {
        heading: "Sanda — the fighting side",
        body: [
          "Sanda is full-contact: kicks, punches, and throws, fought on a raised platform. Getting taken off that platform scores against you, which makes it tactically distinct from most striking sports.",
          "It rewards timing, composure and the ability to think while tired. If you want to know how you respond when someone is genuinely trying to beat you, this is the branch.",
        ],
      },
      {
        heading: "You do not choose on day one",
        body: [
          "Beginners train shared fundamentals for the first months — stances, basic strikes and kicks, conditioning, and how to fall safely. Both branches are built on the same base.",
          "Most people discover their own preference somewhere around the three-month mark, and it is usually not the one they predicted.",
        ],
      },
      {
        heading: "Why I coach the mental side alongside it",
        body: [
          "Wushu is unusually good at exposing the mind. Taolu punishes a wandering attention instantly — you feel the deduction as you make it. Sanda punishes a poor comeback response, because there is another exchange three seconds later whether you have recovered or not.",
          "That is why the Warrior Mind Method is trained on the mat rather than in a seminar. The pressure that makes psychological skills real is already there.",
        ],
        link: { href: METHOD_HUB, label: "How the five pillars train it" },
      },
    ],
    faqs: [
      {
        q: "What is the difference between Taolu and Sanda?",
        a: "Taolu is judged routines scored on precision, power, balance and difficulty. Sanda is full-contact fighting combining strikes and throws. Both are competitive branches of Wushu and share the same fundamentals.",
      },
      {
        q: "Is Wushu the same as Kung Fu?",
        a: "Wushu is the modern standardised and competitive form of Chinese martial arts. 'Kung Fu' is the broader traditional term covering many older systems.",
      },
      {
        q: "Is Wushu practical for self-defence?",
        a: "Sanda in particular develops practical striking, clinch and throwing skills, plus the composure to use them under stress. Taolu builds the attributes more than direct application.",
      },
    ],
  },

  {
    slug: "judo-learning-to-fall-first-skill",
    title: "Judo: Why Learning to Fall Is the First Thing You're Taught",
    description:
      "Breakfalling is taught before any throw, and it's the skill that transfers furthest outside the dojo. What Judo training actually involves.",
    excerpt:
      "The first thing Judo teaches is how to hit the ground safely. It is also the most useful thing most students ever learn.",
    readingMinutes: 6,
    category: "Martial Arts",
    keywords: [
      "Judo for beginners",
      "judo breakfall ukemi",
      "judo classes Chennai",
      "judo for kids confidence",
      "is judo safe",
    ],
    image: "/images/hero-wide.webp",
    imageAlt: "Judo breakfall training",
    quickAnswer:
      "Judo teaches breakfalling (ukemi) before any throw, because a student who cannot land safely cannot be thrown safely. It is the first skill taught, the one practised in every session for years, and the one that transfers furthest outside the dojo — most students who use Judo in real life use it by falling well.",
    sections: [
      {
        heading: "Falling is a technique, not an accident",
        body: [
          "Untrained people fall badly in predictable ways: they reach out a straight arm, tense, and land on a joint. Judo teaches the opposite — spread the impact, slap the mat, keep the chin tucked, breathe out.",
          "It takes weeks to stop flinching and months to make it automatic, which is why it is trained from the first session and never stops being trained.",
        ],
      },
      {
        heading: "What it does for confidence",
        body: [
          "There is a specific moment in a beginner's Judo training when they stop fearing the ground. It usually arrives around the second or third month, and parents notice it before the student names it.",
          "That is not a metaphor about resilience — it is literal. A child who knows they can land safely moves differently, in Judo and everywhere else.",
        ],
      },
      {
        heading: "What a beginner session looks like",
        body: [],
        list: [
          "Warm-up and mobility, taken seriously — Judo asks a lot of the neck, shoulders and knees.",
          "Ukemi — breakfalls, in every direction, every session.",
          "Grip work and off-balancing (kuzushi), which is where throws actually come from.",
          "One or two throws drilled slowly, with a compliant partner, long before any resistance.",
          "Groundwork — holds and escapes, which many students end up enjoying most.",
        ],
      },
      {
        heading: "Is it safe?",
        body: [
          "Properly coached Judo has an injury rate comparable to other contact sports, and the reason is precisely this ordering: falling first, throws second, resistance last.",
          "The warning sign at any academy is the reverse — students being thrown before they can land. Ask directly how a club sequences it; a good coach has an immediate answer.",
        ],
      },
    ],
    faqs: [
      {
        q: "What age can a child start Judo?",
        a: "Around six for structured classes. Younger children can do movement and coordination sessions, but breakfalling and throws need the body control that arrives a little later.",
      },
      {
        q: "Is Judo good for building confidence?",
        a: "Unusually so. Learning to fall safely removes a specific fear, and students visibly move with more assurance once it becomes automatic.",
      },
      {
        q: "Do I need to be strong to start Judo?",
        a: "No. Judo is built on off-balancing and timing rather than strength — which is the entire point of its founding principle, maximum efficiency with minimum effort.",
      },
    ],
  },

  {
    slug: "kick-boxing-vs-boxing-which-to-choose",
    title: "Kick Boxing vs Boxing: Which Should You Start With?",
    description:
      "Both build conditioning and timing fast. What each actually trains, which suits your goal, and what the first month looks like.",
    excerpt:
      "These two get lumped together and they train quite different things. The choice is simpler than it looks.",
    readingMinutes: 6,
    category: "Martial Arts",
    keywords: [
      "kick boxing vs boxing",
      "kickboxing classes Chennai",
      "boxing for fitness",
      "martial arts for fitness",
      "which martial art for beginners",
    ],
    image: "/images/strong-mind.webp",
    imageAlt: "Kick boxing and boxing training",
    quickAnswer:
      "Boxing trains hands, head movement and footwork to a high level of refinement within a narrow range. Kick boxing adds kicks and knees, so it covers more range but refines each tool more slowly. For pure conditioning and the fastest visible fitness gains, either works; for self-defence range, kick boxing; for depth of skill soonest, boxing.",
    sections: [
      {
        heading: "Boxing: narrow range, deep skill",
        body: [
          "Boxing removes everything below the waist, and what remains gets refined further than in almost any other striking art. Head movement, distance control and footwork reach a level of subtlety that surprises people who assumed it was simple.",
          "Because the toolset is small, competence arrives comparatively fast. Three months of honest boxing training makes a visible difference to how someone moves.",
        ],
      },
      {
        heading: "Kick boxing: more range, slower refinement",
        body: [
          "Adding kicks and knees changes the geometry entirely — more distance to manage, more ways to be hit, more to defend. It is a broader skill set covering more realistic range.",
          "The trade-off is honest: more tools means each is drilled less often, so refinement takes longer. That is not a flaw, just arithmetic.",
        ],
      },
      {
        heading: "Choosing by goal",
        body: [],
        list: [
          "Fitness and conditioning — either. Both are among the hardest conditioning work in any martial art.",
          "Self-defence range — kick boxing, for the extra distance options.",
          "Fastest visible skill — boxing, because the toolset is narrower.",
          "Enjoying variety — kick boxing, straightforwardly.",
          "Existing knee or hip issues — boxing, and tell the coach before the first session.",
        ],
      },
      {
        heading: "The first month, honestly",
        body: [
          "Expect far more footwork and conditioning than hitting things. Beginners want to hit the pads; coaches want your stance to stop collapsing first, because everything else is built on it.",
          "Expect to be badly out of breath. Both sports expose conditioning immediately, and that is the fastest-improving part.",
        ],
      },
    ],
    faqs: [
      {
        q: "Which is better for weight loss, boxing or kick boxing?",
        a: "Both are excellent and the difference is marginal. The one you attend consistently is the one that works.",
      },
      {
        q: "Do I need to spar?",
        a: "Not to benefit. Many students train purely for fitness and skill and never spar. Where sparring is offered it should be controlled, optional and introduced only after fundamentals hold.",
      },
      {
        q: "Can beginners with no fitness base start?",
        a: "Yes. Conditioning is part of the training, not a prerequisite for it. Starting unfit is the normal case.",
      },
    ],
  },

  {
    slug: "what-martial-arts-belts-actually-mean",
    title: "What Martial Arts Belts Actually Mean (And When They Don't)",
    description:
      "Belts are a teaching tool, not a ranking system — and standards vary hugely between academies. How to read a grading honestly.",
    excerpt:
      "A belt means what the academy awarding it decided it means. Which is exactly why some of them mean nothing.",
    readingMinutes: 6,
    category: "Martial Arts",
    keywords: [
      "what do martial arts belts mean",
      "martial arts grading",
      "black belt how long",
      "belt mill martial arts",
      "karate belt order",
    ],
    image: "/images/portrait.webp",
    imageAlt: "Martial arts belt grading",
    quickAnswer:
      "A belt records that a student met one academy's standard on one day — nothing more. There is no universal scale, so the same belt means different things at different schools. Judge a grading by what the student can demonstrate, not by the colour, and treat rapid automatic promotion as a warning sign.",
    sections: [
      {
        heading: "What a belt is actually for",
        body: [
          "Belts exist to break a very long journey into visible steps. That is a genuinely good teaching device, particularly for children, who need to see progress on a shorter cycle than mastery provides.",
          "What a belt is not is a portable rank. There is no governing body harmonising standards across styles or even across clubs in the same style.",
        ],
      },
      {
        heading: "Why the same belt means different things",
        body: [
          "One academy may take four years to award a black belt with a demanding examination. Another may award one in eighteen months. Both are 'black belts' and the words carry no shared meaning.",
          "This is why asking 'what belt are you' tells you less than asking 'what can you do, and who tested you'.",
        ],
      },
      {
        heading: "The warning sign",
        body: [
          "Belts arriving every few weeks, on a schedule, regardless of standard — usually with a fee attached to each. The trade is real money for a coloured strip that means nothing outside that building.",
          "Children work this out faster than adults expect. A grading that was never in doubt does not feel like an achievement, and the motivational value the belt was supposed to provide evaporates.",
        ],
      },
      {
        heading: "How to judge a grading properly",
        body: [],
        list: [
          "Ask to see the syllabus between grades. A real one is specific and written down.",
          "Ask whether anyone ever fails. If nobody does, it is not an examination.",
          "Ask who grades — the same coach every time, or an external examiner for senior grades?",
          "Watch a grading if you can. You will learn more in twenty minutes than from any brochure.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long does a black belt take?",
        a: "In a rigorous school, typically four to six years of consistent training. Anywhere offering one substantially faster is worth questioning closely.",
      },
      {
        q: "Are belts the same across martial arts?",
        a: "No. Colours, order and standards differ by style and by school. There is no universal scale.",
      },
      {
        q: "Should I worry if my child grades slowly?",
        a: "Usually the opposite. Slow, earned progression means the standard is real — and the belt will mean something when it arrives.",
      },
    ],
  },

  {
    slug: "martial-arts-self-defence-realistic-expectations",
    title: "Martial Arts and Self-Defence: What It Actually Prepares You For",
    description:
      "An honest account of what martial arts training does and doesn't give you for real-world self-defence, and what matters most.",
    excerpt:
      "The honest version is less dramatic than the marketing, and considerably more useful.",
    readingMinutes: 7,
    category: "Martial Arts",
    keywords: [
      "martial arts for self defence",
      "self defence classes Chennai",
      "is martial arts effective self defence",
      "self defence for women Chennai",
      "realistic self defence training",
    ],
    image: "/images/gesture.webp",
    imageAlt: "Self-defence and martial arts training",
    quickAnswer:
      "Martial arts training helps with self-defence mainly through attributes rather than techniques: awareness, composure under adrenaline, distance management and the confidence to act decisively. The single most useful outcome is avoiding or leaving a situation early — the techniques matter far less often than training marketing suggests.",
    sections: [
      {
        heading: "What actually transfers",
        body: [
          "Not the specific techniques, most of the time. What transfers is your response under adrenaline — whether you freeze, whether you can breathe, whether you can make a decision while your hands shake.",
          "Martial arts trains that repeatedly, under controlled pressure, which is a rehearsal almost nobody else gets. That rehearsal is the real product.",
        ],
      },
      {
        heading: "The skills that matter most, in order",
        body: [],
        list: [
          "Awareness — noticing early enough that you still have options. Nothing else on this list beats it.",
          "De-escalation and leaving — the successful outcome is almost always the one where nothing happens.",
          "Composure — functioning while adrenalised, which is the specific thing sparring trains.",
          "Distance management — knowing when someone is close enough to be a problem.",
          "Technique — genuinely useful, and genuinely last on this list.",
        ],
      },
      {
        heading: "What training does not give you",
        body: [
          "It does not make you safe. A trained person can still be badly hurt, ambushed, outnumbered, or faced with a weapon — and any school implying otherwise is selling confidence rather than competence.",
          "It also does not transfer instantly. Techniques drilled compliantly for six months do not appear under real stress. Only what you have practised against genuine resistance is available to you when it matters.",
        ],
      },
      {
        heading: "Which art, for this specifically",
        body: [
          "Anything with live resistance beats anything without it. Sanda, Judo, boxing and kick boxing all spar, so their attributes are pressure-tested rather than theoretical.",
          "For most people the honest answer is that consistency matters more than style. Two years of any pressure-tested art beats six months of the theoretically optimal one.",
        ],
      },
    ],
    faqs: [
      {
        q: "Which martial art is best for self-defence?",
        a: "Any art that spars with live resistance — Sanda, Judo, boxing, kick boxing. Pressure-testing matters more than the style, and consistency matters more than either.",
      },
      {
        q: "How long before martial arts helps me defend myself?",
        a: "Awareness and composure improve within months. Reliable technique under real stress takes considerably longer, because only pressure-tested skills are available when adrenaline hits.",
      },
      {
        q: "Is martial arts good self-defence for women?",
        a: "Yes, particularly arts that train against resisting partners. Awareness, distance management and the confidence to act early are the highest-value outcomes.",
      },
    ],
  },
];

/** Published as one discipline cluster. */
export const MARTIAL_ARTS_POSTS: BlogPost[] = MA_SEEDS.map((p) => ({
  ...p,
  publishedAt: "2026-09-07",
}));
