import type { BlogPost } from "./blog";

/**
 * One article per pillar of the Warrior Mind Method™.
 *
 * The framework had a single hub page. That is enough to name a concept and not
 * nearly enough to own it: answer engines cite named frameworks in preference to
 * generic advice, but only when there is substance behind the name. Five pillar
 * pages plus the hub turn a mention into a body of work, and each links back so
 * the cluster reads as one system rather than five loose posts.
 *
 * Each pillar exists because it names a DISTINCT way athletes lose, and the fix
 * for each is genuinely different — which is the whole argument of the
 * framework, and the reason these are five articles rather than one long one.
 */

const HUB = "/blog/warrior-mind-method-five-pillars/";

const METHOD_SEEDS: Omit<BlogPost, "publishedAt">[] = [
  {
    slug: "warrior-mind-focus-attention-control-athletes",
    title: "Focus: Training Attention Control — Warrior Mind Method Pillar 1",
    description:
      "Focus is a trainable skill, not a personality trait. The first pillar of the Warrior Mind Method™ — what attention control is and the drills that build it.",
    excerpt:
      "Most competitive errors are attention errors. That is good news, because attention is the most trainable thing on this list.",
    readingMinutes: 7,
    category: "Warrior Mind Method",
    keywords: [
      "Warrior Mind Method Focus",
      "attention control athletes",
      "focus training for athletes",
      "concentration drills sport",
      "Kishore Kumar Warrior Mind Method",
    ],
    image: "/images/strong-mind.webp",
    imageAlt: "Focus and attention training for athletes",
    quickAnswer:
      "Focus, the first pillar of the Warrior Mind Method™, is the trained ability to choose what you attend to and hold it there. It is built by practising three things: switching attention between wide and narrow on demand, using a single cue word to reset, and deliberately training in distracting conditions rather than only in quiet ones.",
    sections: [
      {
        heading: "The failure mode this pillar names",
        body: [
          "An athlete loses to Focus when their attention lands on the wrong thing at the wrong moment: the scoreboard, the opponent's coach, a bad call two points ago, or their own internal commentary about how it is going.",
          "Nothing is wrong with their technique or their fitness. The information reaching them is simply the wrong information, and every decision after that is made on it.",
        ],
      },
      {
        heading: "Attention has a width, and the width should change",
        body: [
          "Useful attention is not one setting called 'concentrating harder'. It has a width you should be able to change deliberately — wide to read an opponent's position and the space around you, narrow to execute the technique, then wide again.",
          "Athletes stuck wide miss their own execution. Athletes stuck narrow get caught by what they should have seen. Both are fixed by practising the switch itself, not by trying to concentrate more.",
        ],
      },
      {
        heading: "The drill I start everyone on",
        body: [
          "Pick one cue word. It must be a task instruction, not encouragement — 'target', 'tempo', 'hands', never 'come on'. Encouragement points attention inward, at how you feel; instruction points it outward, at the job.",
          "Use it at three fixed moments in every session: before the first repetition, immediately after any mistake, and before the last. Same word, every time, for weeks. It acquires the state it has been paired with, and in competition you can use it to fetch that state back.",
        ],
      },
      {
        heading: "Train it in noise",
        body: [
          "Focus that only works in a silent hall has not been trained; it has simply never been tested. Add a radio, spectators, a coach calling numbers — anything that competes for attention.",
          "The point is not to enjoy it. The point is that competition should feel comparatively easy.",
        ],
        link: { href: HUB, label: "See all five pillars" },
      },
    ],
    faqs: [
      {
        q: "How long does it take to improve focus?",
        a: "Athletes usually notice a difference within two to three weeks of consistent cue-word practice, provided it is used at fixed moments rather than randomly.",
      },
      {
        q: "Does meditation improve athletic focus?",
        a: "It helps but is not sufficient alone. Meditation trains attention in stillness; competition demands attention while moving, fatigued and pressured, so sport-specific drills matter more.",
      },
      {
        q: "What is a cue word?",
        a: "A single task instruction — 'target', 'tempo', 'hands' — used at fixed moments until it reliably triggers the right attentional state under pressure.",
      },
    ],
  },

  {
    slug: "warrior-mind-fire-motivation-confidence-athletes",
    title: "Fire: Building Durable Motivation — Warrior Mind Method Pillar 2",
    description:
      "Hype is borrowed energy that runs out. The second pillar of the Warrior Mind Method™ — building motivation and confidence that survive a bad season.",
    excerpt:
      "Fire is not being fired up. It is the reason that survives a bad week, an injury, and a coach who has stopped giving you attention.",
    readingMinutes: 7,
    category: "Warrior Mind Method",
    keywords: [
      "Warrior Mind Method Fire",
      "athlete motivation",
      "building confidence athletes",
      "intrinsic motivation sport",
      "self belief athletes",
    ],
    image: "/images/gesture.webp",
    imageAlt: "Building motivation and confidence in athletes",
    quickAnswer:
      "Fire, the second pillar of the Warrior Mind Method™, is durable internal drive and confidence. It is built from evidence rather than hype: logging specific training wins, setting goals on the process you control, and separating identity from results so a loss is information rather than a verdict on who you are.",
    sections: [
      {
        heading: "The failure mode this pillar names",
        body: [
          "An athlete loses to Fire when the engine stops. Not dramatically — they simply train a little less honestly, skip the session nobody would notice, and stop believing the work will pay.",
          "It usually follows a run of poor results, an injury, or a coach's attention moving elsewhere. Motivation built on any of those three is borrowed, and it gets recalled.",
        ],
      },
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
          "Before competition, read the last few weeks. You are not hyping yourself — you are reviewing a documented record. That is a different psychological act, and it holds up under pressure in a way that hype does not.",
        ],
      },
      {
        heading: "Separate identity from results",
        body: [
          "An athlete who is 'a winner' has a fragile identity, because a loss contradicts it directly. An athlete who is 'a person who trains properly' can lose on Saturday and still be exactly who they were on Friday.",
          "This sounds like semantics until you watch two athletes take the same defeat. One reviews it by Monday. The other is still carrying it a month later.",
        ],
        link: { href: HUB, label: "See all five pillars" },
      },
    ],
    faqs: [
      {
        q: "How do I get motivation back after a bad loss?",
        a: "Separate the result from the performance. Review what you executed well independently of the outcome, then set the next session's goals on process rather than results.",
      },
      {
        q: "Does confidence come before or after success?",
        a: "Both, but the reliable direction is evidence first. Small documented wins build the confidence that makes bigger wins likelier.",
      },
      {
        q: "Is wanting to beat a rival good motivation?",
        a: "It works short-term but is fragile, because it depends on their performance rather than yours. Use it as fuel, never as your definition of success.",
      },
    ],
  },

  {
    slug: "warrior-mind-flow-calm-execution-under-pressure",
    title: "Flow: Calm Execution Under Pressure — Warrior Mind Method Pillar 3",
    description:
      "Flow is more reliable than athletes assume. The third pillar of the Warrior Mind Method™ — the conditions that produce it and how to rehearse them.",
    excerpt:
      "Most athletes have felt flow and assume it was luck. It follows conditions you can actually set up.",
    readingMinutes: 6,
    category: "Warrior Mind Method",
    keywords: [
      "Warrior Mind Method Flow",
      "flow state athletes",
      "performing without overthinking",
      "calm under pressure sport",
      "pre-performance routine",
    ],
    image: "/images/hero-wide.webp",
    imageAlt: "Athlete performing in a flow state",
    quickAnswer:
      "Flow, the third pillar of the Warrior Mind Method™, is executing without over-thinking. It is not luck: it follows a clear external task focus, a challenge matched to your current skill, and a body that is not over-aroused. Those three conditions can be rehearsed, which is what makes flow repeatable rather than occasional.",
    sections: [
      {
        heading: "The failure mode this pillar names",
        body: [
          "An athlete loses to Flow when they start supervising themselves. Skilled movement is automatic; under pressure they begin consciously checking their grip, their footwork, their form.",
          "Conscious control is slower and clumsier than the automatic version, so performance drops precisely because they are trying harder. This is why 'just relax' fails as advice — the problem is not tension in the abstract, it is where attention has gone.",
        ],
      },
      {
        heading: "The three conditions",
        body: [],
        list: [
          "An external task focus — attend to the target, the opponent, the effect, never to your own limb.",
          "Challenge matched to skill — too easy and you drift, too hard and you tighten. This is why sparring partner selection is a psychological decision, not only a physical one.",
          "Arousal in range — high enough to be sharp, low enough that the movement stays automatic.",
        ],
      },
      {
        heading: "The pre-performance routine",
        body: [
          "A fixed sequence, identical in training and competition, is the most reliable way in. Its value is not physical — it is that the start of your performance is never novel, whatever else about the day is.",
          "Build it, then never change it on a competition day. A routine altered because today feels important is no longer a routine.",
        ],
      },
      {
        heading: "Breathing, specifically",
        body: [
          "Make the exhale longer than the inhale — four in, six out is a reliable starting point. It lowers arousal within about a minute, and unlike most advice it works fast enough to use in a holding area.",
          "Practise it in training so it is familiar. A technique first attempted under pressure is a technique you do not have.",
        ],
        link: { href: HUB, label: "See all five pillars" },
      },
    ],
    faqs: [
      {
        q: "Can you train yourself to enter flow?",
        a: "You cannot force it, but you can reliably set up the conditions — external focus, matched challenge, controlled arousal — which is what makes it repeatable rather than accidental.",
      },
      {
        q: "Why do I perform worse when I try harder?",
        a: "Trying harder often means monitoring your own movement, which turns an automatic skill back into a conscious one. Conscious control is slower and clumsier.",
      },
    ],
  },

  {
    slug: "warrior-mind-forge-discipline-habits-athletes",
    title: "Forge: Discipline and Habit — Warrior Mind Method Pillar 4",
    description:
      "The unglamorous pillar that decides seasons. The fourth pillar of the Warrior Mind Method™ — building training discipline that survives bad days.",
    excerpt:
      "Forge is what makes you train correctly on the day nobody is watching and nothing feels good.",
    readingMinutes: 6,
    category: "Warrior Mind Method",
    keywords: [
      "Warrior Mind Method Forge",
      "training discipline athletes",
      "building habits athletes",
      "consistency in training",
      "discipline over motivation",
    ],
    image: "/images/portrait.webp",
    imageAlt: "Discipline and consistent training habits",
    quickAnswer:
      "Forge, the fourth pillar of the Warrior Mind Method™, is discipline built as a system rather than summoned as willpower. It works by shrinking the unit of commitment until skipping is harder than starting, fixing time and place to remove decisions, and tracking a visible streak so consistency becomes something you are unwilling to break.",
    sections: [
      {
        heading: "The failure mode this pillar names",
        body: [
          "An athlete loses to Forge slowly, which is why it goes unnoticed. Training becomes conditional — on mood, weather, how the week went, whether a friend is going.",
          "No single skipped session matters. Twenty of them across a season is the difference between the athlete who peaks in March and the one who does not.",
        ],
      },
      {
        heading: "Design for your worst realistic day",
        body: [
          "Build the routine around the day you feel flat and busy, not the day you feel inspired. A plan that only survives high motivation is not a plan; it is a wish with a timetable.",
          "Define a minimum session — the smallest version that still counts. On hard days you do that, and the streak survives. The streak surviving is the whole objective.",
        ],
      },
      {
        heading: "Remove the decisions",
        body: [
          "Every decision between you and the session is an opportunity to opt out. Fixed time, fixed place, kit packed the night before.",
          "Discipline is far less about character than most athletes believe, and far more about how many choices you left lying in the path.",
        ],
      },
      {
        heading: "Why this pillar beats talent",
        body: [
          "Talented juniors win early without full effort, which quietly teaches them that effort is optional. When they reach a level where everyone is talented, they have no habit to fall back on.",
          "The less gifted athlete had to build the habit to keep up. That habit is the asset that survives the transition — which is why the overtaking usually happens in year three or four, not year one.",
        ],
        link: { href: HUB, label: "See all five pillars" },
      },
    ],
    faqs: [
      {
        q: "What if I genuinely have no motivation today?",
        a: "Do the minimum version. Starting reliably generates the motivation that waiting never produces — the order runs action, then momentum, then motivation.",
      },
      {
        q: "How long until training becomes a habit?",
        a: "Typically one to three months of consistent repetition at the same time and place. Varying either resets much of the progress.",
      },
      {
        q: "Can hard work really beat natural talent?",
        a: "Over a long enough period, consistently. Talent has a large early advantage that shrinks as training years accumulate.",
      },
    ],
  },

  {
    slug: "warrior-mind-fight-pressure-comeback-mindset",
    title: "Fight: Pressure and the Comeback Response — Warrior Mind Method Pillar 5",
    description:
      "What happens after it goes wrong. The fifth pillar of the Warrior Mind Method™ — training mistake recovery and competition courage.",
    excerpt:
      "The comeback response is the most trainable and least trained skill in competitive sport.",
    readingMinutes: 7,
    category: "Warrior Mind Method",
    keywords: [
      "Warrior Mind Method Fight",
      "pressure handling athletes",
      "comeback mindset",
      "mistake recovery sport",
      "competition confidence",
    ],
    image: "/images/strong-mind.webp",
    imageAlt: "Athlete handling pressure in competition",
    quickAnswer:
      "Fight, the fifth pillar of the Warrior Mind Method™, is what happens after something goes wrong. It is trained with a rehearsed mistake-recovery cue, deliberate adversity in practice, and repeatedly rehearsing the specific scenario the athlete most fears until it stops being novel. One error becoming three is a training gap, not a character flaw.",
    sections: [
      {
        heading: "The failure mode this pillar names",
        body: [
          "An athlete loses to Fight in the ninety seconds after a mistake. The error itself was survivable; what followed was not.",
          "They replay it, tighten, take fewer risks, and concede the next two points to the mistake rather than the opponent. Almost every match I have watched slip away has slipped in that window.",
        ],
      },
      {
        heading: "Rehearse the reset, not the perfection",
        body: [
          "Most athletes only ever rehearse things going well. So the first time they practise recovering from an error is in competition, with a scoreboard running — the worst possible conditions to learn anything.",
          "Build a reset: one physical action, one cue word, one breath. Adjust your guard, say 'next', exhale. Use it after every mistake in training, including the trivial ones. It has to be boring before it can be reliable.",
        ],
      },
      {
        heading: "Train with deliberate adversity",
        body: [],
        list: [
          "Start rounds from a losing position, so being behind is familiar rather than alarming.",
          "Train fatigued sometimes — competition rarely arrives when you are fresh.",
          "Add consequences: an audience, a scoreboard, something small at stake.",
          "Rehearse the specific scenario the athlete fears most. Naming it and repeating it removes most of its power.",
        ],
      },
      {
        heading: "Reframing what nerves are",
        body: [
          "The physical signature of anxiety and excitement is nearly identical — raised heart rate, quick breath, alertness. Athletes who label it readiness outperform those who label it fear, and the label is a rehearsable choice.",
          "The aim was never to feel nothing. Athletes who feel nothing before competing generally underperform.",
        ],
        link: { href: HUB, label: "See all five pillars" },
      },
    ],
    faqs: [
      {
        q: "How do I stop one mistake ruining a whole match?",
        a: "Build a rehearsed reset — one physical action, one cue word, one breath — and use it after every error in training until it is automatic.",
      },
      {
        q: "Is choking under pressure permanent?",
        a: "No. It is a trained response and it responds to training. Most athletes see meaningful change within a few weeks of practising attention control and a recovery routine.",
      },
      {
        q: "Should I try to feel calm before competing?",
        a: "Not entirely calm. Aim for a workable level of arousal with attention pointed outward — feeling nothing usually means underperforming.",
      },
    ],
  },
];

/** Published as one cluster alongside the hub page. */
export const METHOD_POSTS: BlogPost[] = METHOD_SEEDS.map((p) => ({
  ...p,
  publishedAt: "2026-09-07",
}));
