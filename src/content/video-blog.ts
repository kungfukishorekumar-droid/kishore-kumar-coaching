import type { BlogPost } from "./blog";

/**
 * One article per YouTube Short.
 *
 * Titles here are the real ones, read from YouTube's oEmbed API rather than
 * guessed, so each article genuinely matches its video — Google penalises
 * VideoObject markup that doesn't describe the embedded content.
 *
 * Each post is a written expansion of the Short, not a transcript. A Short
 * makes one point in under a minute; the article gives that point the context,
 * the mechanism and the FAQ coverage that makes it rank and makes it useful
 * after the video ends. Thin "watch the video" pages rank for nothing.
 *
 * `IMAGE_POOL` rotates the four available photographs. Replace per-post once
 * real Spartacus/Instagram imagery is available — distinct images per article
 * are better for image search and social previews.
 */
const IMAGE_POOL = [
  { src: "/images/strong-mind.jpg", alt: "Athlete mental training, Chennai" },
  { src: "/images/gesture.jpg", alt: "Kishore Kumar coaching in Chennai" },
  { src: "/images/hero-wide.jpg", alt: "Martial arts and mindset training" },
  { src: "/images/portrait.jpg", alt: "Kishore Kumar, sports psychologist, Chennai" },
];

const img = (i: number) => IMAGE_POOL[i % IMAGE_POOL.length];

type VideoSeed = Omit<BlogPost, "image" | "imageAlt" | "publishedAt" | "readingMinutes">;

const SEEDS: VideoSeed[] = [
  {
    slug: "why-we-get-nervous-during-competitions",
    title: "Why Do We Get Nervous During Competitions? The Psychology Explained",
    description:
      "Competition nerves are a threat response, not a character flaw. Kishore Kumar explains the psychology and what actually reduces it.",
    excerpt:
      "Your body cannot tell the difference between a final and a genuine threat. That's the whole mechanism — and it's workable.",
    category: "Sports Psychology",
    keywords: [
      "why athletes get nervous",
      "competition anxiety psychology",
      "sports psychology Chennai",
      "Kishore Kumar sports psychologist",
    ],
    video: { id: "E_GZBSQwREI", title: "Why Do We Get Nervous During Competitions? | Psychology Explained" },
    quickAnswer:
      "Competition nerves come from the body's threat response. Your nervous system reads a high-stakes event the same way it reads danger, releasing adrenaline that sharpens attention but also tightens muscles and speeds breathing. The goal is not to remove that response but to keep it at a workable level and point attention outward.",
    sections: [
      {
        heading: "The mechanism",
        body: [
          "Nerves are not evidence that something is wrong with you. They are your nervous system preparing for effort. The same chemistry that makes your hands shake is what sharpens your reactions.",
          "The problem is never the arousal itself — it is arousal plus inward attention. When you start monitoring your own heartbeat and your own technique, the automatic skill you spent years building becomes conscious and clumsy.",
        ],
      },
      {
        heading: "What to do with it",
        body: ["Three things reliably help, and none of them is 'calm down':"],
        list: [
          "Lengthen the exhale. Breathe out longer than you breathe in — it lowers arousal within about a minute.",
          "Relabel the feeling. The physical signature of fear and excitement is nearly identical, and athletes who call it readiness outperform those who call it fear.",
          "Point attention at the task, not the body. Watch the opponent, the target, the tempo — anything external.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is it bad to feel nervous before competing?",
        a: "No. Athletes who feel nothing before competing usually underperform. The aim is a workable level of arousal, not zero.",
      },
      {
        q: "How do I stop shaking before a match?",
        a: "Use a longer exhale than inhale for a minute or two, and keep your attention on external cues. Shaking is adrenaline doing its job, and it fades once your focus moves outward.",
      },
    ],
  },

  {
    slug: "either-win-or-disappear-coaching-motivation",
    title: "“Either Win or Disappear”: When Coaching Motivation Turns Harmful",
    description:
      "Fear-based coaching produces short-term compliance and long-term damage. What actually builds durable athletes, from Chennai coach Kishore Kumar.",
    excerpt:
      "I have heard a coach say this to a fifteen-year-old. It works for one season and costs you the athlete.",
    category: "For Athletes",
    keywords: [
      "fear based coaching",
      "sports coaching motivation",
      "athlete burnout India",
      "Kishore Kumar coaching",
    ],
    video: { id: "FFTJrlqsQho", title: "“Either Win or Disappear” – The Coach’s Brutal Motivation That Changed Everything" },
    quickAnswer:
      "Ultimatum-style coaching such as “win or disappear” produces a short burst of compliance followed by anxiety, risk-avoidance and dropout. Athletes coached through fear learn to protect themselves from failure rather than pursue performance, which is the opposite of what competition rewards.",
    sections: [
      {
        heading: "Why it appears to work",
        body: [
          "Fear does produce effort. For a few weeks the athlete trains harder, and the coach concludes the method works.",
          "What is actually happening is that the athlete has switched from approach motivation to avoidance motivation. They are no longer training to win; they are training to not be humiliated. Those two states look identical from the outside and produce very different athletes.",
        ],
      },
      {
        heading: "What it costs",
        body: [
          "Avoidance-motivated athletes stop taking risks, and competition rewards calculated risk. They also hide injuries and mistakes, because admitting either is dangerous.",
          "The clearest cost is dropout. Talented juniors leave sport not because they stopped loving it but because the environment stopped being survivable.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does tough coaching build mental toughness?",
        a: "Demanding coaching does. Fear-based coaching does not — toughness comes from being stretched inside a relationship of trust, not from threat.",
      },
      {
        q: "How should a coach respond to a bad performance?",
        a: "Separate the performance from the person, identify one specific correctable factor, and set the next session's goal on process rather than result.",
      },
    ],
  },

  {
    slug: "harsh-words-create-fear-not-growth",
    title: "Harsh Words Create Fear, Not Growth: A Lesson on Motivating Athletes",
    description:
      "Why harsh criticism damages young athletes, and how to give hard feedback that actually improves performance.",
    excerpt:
      "You can be demanding without being cruel. Most people who confuse the two have only seen one model.",
    category: "For Parents",
    keywords: [
      "criticism young athletes",
      "how to motivate athletes",
      "sports parenting Chennai",
      "youth sport psychology India",
    ],
    video: { id: "pwilIij-Muo", title: "Harsh Words Create Fear, Not Growth | A Powerful Lesson on Motivation" },
    quickAnswer:
      "Harsh criticism raises anxiety and narrows attention, which degrades exactly the skills an athlete needs. Effective feedback is specific, targets the behaviour rather than the person, and arrives with a clear correction. Demanding standards and personal attacks are different things, and only one improves performance.",
    sections: [
      {
        heading: "What harsh feedback does to the brain",
        body: [
          "Personal criticism triggers a threat response. Under threat, attention narrows and working memory shrinks — the athlete becomes literally less able to take in the correction you just gave.",
          "This is why the same athlete who cannot absorb a point mid-scolding understands it perfectly an hour later.",
        ],
      },
      {
        heading: "How to give hard feedback well",
        body: [],
        list: [
          "Name the behaviour, not the person. “Your guard dropped in round two”, not “you were lazy”.",
          "Give one correction, not five. More than one and none of them lands.",
          "State what to do, not only what went wrong. A correction without an instruction is just a complaint.",
          "Deliver it after the emotional spike, not during. Ninety seconds of waiting doubles what gets absorbed.",
        ],
      },
    ],
    faqs: [
      {
        q: "Should parents critique their child after a match?",
        a: "Not immediately. Let the emotion settle, ask what they thought first, and keep your input to one specific point.",
      },
      {
        q: "Is praise better than criticism?",
        a: "Specific feedback beats both vague praise and vague criticism. “Good job” and “that was bad” are equally uninformative.",
      },
    ],
  },

  {
    slug: "martial-arts-began-as-war-arts",
    title: "Martial Arts Began as War Arts: The Truth About Kung Fu, Karate & Silambam",
    description:
      "Kung Fu, Karate and Tamil Nadu's Silambam all began as battlefield systems. What that origin means for how we train today.",
    excerpt:
      "These were survival systems long before they were sports. Understanding that changes how you train them.",
    category: "Martial Arts",
    keywords: [
      "history of martial arts",
      "Silambam Tamil Nadu",
      "Kung Fu origins",
      "Karate history",
      "martial arts Chennai",
    ],
    video: { id: "zFOaYm29IYs", title: "Martial Arts Started as War Arts ⚔️ | Truth About Kung Fu, Karate & Silambam" },
    quickAnswer:
      "Kung Fu, Karate and Silambam all originated as battlefield or self-defence systems rather than sports. Silambam, the staff art of Tamil Nadu, is among the oldest. Their competitive forms today preserve the technique while removing lethal intent — which is why the mental discipline they teach still transfers so directly to pressure.",
    sections: [
      {
        heading: "War first, sport later",
        body: [
          "Every major martial art began as a solution to a survival problem. Silambam developed in Tamil Nadu as a staff-fighting system. Karate developed in Okinawa partly because weapons were restricted. Kung Fu covers centuries of Chinese systems built for real conflict.",
          "Sport formats came much later. What they preserved was the technical craft; what they removed was the consequence.",
        ],
      },
      {
        heading: "Why the origin still matters",
        body: [
          "Because it explains the psychology. These systems were designed to keep someone functional under genuine threat, so they are unusually good at training composure, breath control and decision-making under stress.",
          "That is precisely why I use martial arts to deliver sports psychology rather than teaching the two separately.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is Silambam?",
        a: "A traditional Tamil martial art centred on staff fighting, native to Tamil Nadu and among the oldest documented martial systems in India.",
      },
      {
        q: "Are traditional martial arts still practical today?",
        a: "The techniques have been adapted, but the attributes — timing, composure under pressure, spatial awareness — transfer directly to both modern self-defence and competitive sport.",
      },
    ],
  },

  {
    slug: "morning-vs-evening-workout-sports-training",
    title: "Morning vs Evening Workout: Which Is Better for Sports Training?",
    description:
      "What the evidence says about training time — strength, skill and endurance all peak differently. A practical answer for athletes.",
    excerpt:
      "The honest answer is that consistency beats timing. But if you can choose, the choice isn't arbitrary.",
    category: "For Athletes",
    keywords: [
      "morning vs evening workout",
      "best time to train",
      "sports training schedule",
      "athlete training Chennai",
    ],
    video: { id: "q0W6s2brhsM", title: "Morning vs Evening Workout: Which Time Is Best for Sports Training?" },
    quickAnswer:
      "Strength and power tend to peak in the late afternoon and early evening, when core body temperature is highest. Mornings suit skill work, technical practice and consistency, because fewer things can displace them. The best training time is the one you can repeat, but if competition is in the morning, train some sessions then.",
    sections: [
      {
        heading: "What changes across the day",
        body: [
          "Body temperature, reaction time and peak force output all rise through the day and generally top out in the late afternoon. That makes evening a reasonable default for heavy strength and power work.",
          "Mornings have a different advantage: nothing has happened yet. No work, no school, no fatigue accumulated, and far fewer reasons for the session to be cancelled.",
        ],
      },
      {
        heading: "The rule that overrides all of this",
        body: [
          "Train when your event is. If you compete at 9am, some of your training must happen at 9am, because the body adapts to the time it is asked to perform.",
          "Beyond that, the timing difference is small compared with the difference between training four times a week and training twice.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is it bad to train in the morning?",
        a: "No. You may need a longer warm-up because body temperature is lower, but morning training is effective and often more consistent.",
      },
      {
        q: "Should I train at my competition time?",
        a: "Yes, at least some sessions. Performance is partly time-of-day conditioned, so rehearsing at the competition hour is a genuine advantage.",
      },
    ],
  },

  {
    slug: "dont-let-others-define-your-success",
    title: "The Power of Learning and Growth: Don't Let Others Define Your Success",
    description:
      "Why external definitions of success derail athletes, and how to build standards you actually control.",
    excerpt:
      "If someone else sets the finish line, they can move it. That's the whole problem.",
    category: "For Athletes",
    keywords: [
      "athlete mindset",
      "growth mindset sport",
      "defining success athletes",
      "Kishore Kumar mindset coach",
    ],
    video: { id: "KDUxDNpzHeQ", title: "The Power of Learning & Growth | Don't Let Others Define Your Success" },
    quickAnswer:
      "Athletes who define success by other people's standards hand over control of their own motivation. Durable success is defined by process standards you set and control — training quality, execution of your plan, willingness to learn — because those survive a bad result, an unfair decision or a stronger opponent.",
    sections: [
      {
        heading: "The cost of borrowed standards",
        body: [
          "When success means a coach's approval, a parent's expectation or a comparison with a rival, your sense of progress depends on people and events you do not control.",
          "That is not a motivational problem. It is a structural one: you have built your confidence on a foundation someone else owns.",
        ],
      },
      {
        heading: "Standards worth owning",
        body: [
          "Set standards on things that are fully yours — did you execute the plan, did you recover from mistakes, did you learn one thing you can name?",
          "Athletes who work this way can lose a match and still meet their standard, which is exactly what keeps them improving across a long season.",
        ],
      },
    ],
    faqs: [
      {
        q: "Isn't wanting to beat rivals good motivation?",
        a: "It works short-term but is fragile, because it depends on their performance rather than yours. Use it as fuel, not as your definition of success.",
      },
      {
        q: "How do I set process goals?",
        a: "Pick things entirely within your control for the next session — tempo, guard position, reset after error — and judge yourself only on those.",
      },
    ],
  },

  {
    slug: "how-athletes-perform-despite-fear",
    title: "How Athletes Perform Despite Fear: Mental Strength Explained",
    description:
      "Courage in sport isn't the absence of fear. Here's how athletes act well while still feeling afraid.",
    excerpt:
      "Every athlete I've coached who looked fearless was afraid. They had just stopped waiting for the fear to leave.",
    category: "Sports Psychology",
    keywords: [
      "performing under fear",
      "mental strength athletes",
      "courage in sport",
      "sports psychology India",
    ],
    video: { id: "XV5v9JWUs9c", title: "How Athletes Perform Despite Fear | Mental Strength Explained" },
    quickAnswer:
      "Athletes perform despite fear by acting on trained routines rather than waiting to feel ready. Fear is accepted as present, attention is directed to the immediate task, and behaviour follows a rehearsed sequence. Mental strength is the ability to act correctly while afraid, not the absence of fear.",
    sections: [
      {
        heading: "Waiting to feel ready never works",
        body: [
          "The instinct is to postpone action until confidence arrives. In competition it never arrives on schedule, so the athlete who waits simply performs late.",
          "Trained athletes reverse the order. They act first, on a rehearsed routine, and confidence follows from executing it.",
        ],
      },
      {
        heading: "What that looks like in practice",
        body: [],
        list: [
          "Accept the feeling instead of fighting it — suppression consumes the attention you need for the task.",
          "Shrink the horizon. Not the whole bout, just the next exchange.",
          "Run the routine. When thinking is unreliable, rehearsed behaviour carries you.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do professional athletes still feel fear?",
        a: "Yes, routinely. What changes with experience is the response to it, not the presence of it.",
      },
      {
        q: "How do I stop fear from freezing me?",
        a: "Have a rehearsed first action. Freezing happens when there is no decided next move, so deciding it in advance removes the gap.",
      },
    ],
  },

  {
    slug: "tamil-nadu-support-young-athletes-sdat-khelo-india",
    title: "How Tamil Nadu Supports Young Athletes: SDAT and Khelo India Explained",
    description:
      "What SDAT and Khelo India actually offer young athletes in Tamil Nadu, and how families in Chennai can access support.",
    excerpt:
      "There is more structural support available in Tamil Nadu than most parents realise. Most of it goes unclaimed.",
    category: "For Parents",
    keywords: [
      "SDAT Tamil Nadu",
      "Khelo India",
      "sports scheme Tamil Nadu",
      "young athletes Chennai support",
      "sports scholarship India",
    ],
    video: { id: "0zj7jLlREp4", title: "How Tamil Nadu Supports Young Athletes | SDAT & Khelo India" },
    quickAnswer:
      "Tamil Nadu supports young athletes primarily through the Sports Development Authority of Tamil Nadu (SDAT), which runs coaching centres, hostels and competitions across the state, and through the national Khelo India programme, which identifies talent and provides scholarships and training support. Both are open to school-age athletes in Chennai.",
    sections: [
      {
        heading: "What SDAT provides",
        body: [
          "The Sports Development Authority of Tamil Nadu operates coaching centres and facilities across the state, including in Chennai, and runs district and state-level competitions that form the pathway to national selection.",
          "For most families the practical entry point is a district-level competition or an SDAT coaching centre — that is where selection begins.",
        ],
      },
      {
        heading: "Where Khelo India fits",
        body: [
          "Khelo India is the national programme, identifying talent and supporting selected athletes with scholarships and structured training.",
          "The two work together: state competition creates visibility, and national programmes pick up from there. Missing the state pathway usually means never entering the national one.",
        ],
      },
      {
        heading: "What parents should do",
        body: [
          "Register interest through your school's physical education department or a recognised academy, and target district competitions early. Selection pathways run on calendars, and most missed opportunities are missed deadlines rather than missed talent.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is SDAT?",
        a: "The Sports Development Authority of Tamil Nadu — the state body responsible for sports infrastructure, coaching centres and competitions across Tamil Nadu.",
      },
      {
        q: "Who is eligible for Khelo India?",
        a: "School and youth-age athletes identified through recognised competitions and talent identification. Eligibility varies by sport and age category, so confirm current criteria for your discipline.",
      },
    ],
  },

  {
    slug: "discipline-beats-talent",
    title: "Discipline vs Talent: Why Discipline Wins Every Time",
    description:
      "Talent sets your starting point; discipline sets your ceiling. Why consistent athletes overtake gifted ones.",
    excerpt:
      "I have watched less talented athletes overtake gifted ones for fifteen years. It is never close, and it is never luck.",
    category: "For Athletes",
    keywords: [
      "discipline vs talent",
      "consistency athletes",
      "athlete discipline training",
      "Kishore Kumar discipline",
    ],
    video: { id: "3I35ZKkpOmc", title: "Discipline vs Talent | Why Discipline Beats Talent Every Time" },
    quickAnswer:
      "Talent determines how fast you improve at the start; discipline determines how long you keep improving. Because progress compounds, a moderately talented athlete training consistently for years overtakes a highly talented one training sporadically — usually somewhere in the third or fourth year.",
    sections: [
      {
        heading: "Why talent stalls",
        body: [
          "Talented juniors win early without full effort, which teaches them that effort is optional. When they reach a level where everyone is talented, they have no habit to fall back on.",
          "The less gifted athlete had to build the habit to keep up. That habit is the asset that survives the transition.",
        ],
      },
      {
        heading: "Building the discipline",
        body: [],
        list: [
          "Shrink the commitment until it is impossible to skip. Twenty honest minutes beats a planned two hours you avoid.",
          "Make it same time, same place. Decisions are what erode consistency.",
          "Track it visibly, so the streak becomes something you are unwilling to break.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can hard work beat natural talent?",
        a: "Over a long enough period, consistently. Talent has a large early advantage that shrinks as training years accumulate.",
      },
      {
        q: "How long before discipline shows results?",
        a: "Habit formation typically takes one to three months; the competitive overtaking usually becomes visible over years, not weeks.",
      },
    ],
  },

  {
    slug: "stop-comparing-yourself-to-others",
    title: "Stop Comparing Yourself to Others: A Practical Method for Athletes",
    description:
      "Comparison steals attention from the only performance you control. How athletes break the habit.",
    excerpt:
      "Comparison is not a motivation problem. It's an attention problem, and attention is trainable.",
    category: "For Athletes",
    keywords: [
      "stop comparing yourself",
      "athlete comparison",
      "social comparison sport",
      "athlete confidence Chennai",
    ],
    video: { id: "eLLqR3VSyMo", title: "Stop Comparing Yourself To Others | Best Motivation Video" },
    quickAnswer:
      "Comparison harms performance because it moves attention away from your own execution and onto someone else's, usually at their best moment. The fix is to compare against your own previous performance, keep a personal evidence log, and reduce exposure to feeds that manufacture comparison.",
    sections: [
      {
        heading: "You are comparing against a highlight",
        body: [
          "You see another athlete's best sets, best results, best days — never their injuries, doubts or poor sessions. You compare that against your own complete experience, including everything difficult.",
          "It is not a fair comparison and it was never going to be.",
        ],
      },
      {
        heading: "Replace the reference point",
        body: [
          "The only useful comparison is against yourself three months ago. That comparison is fair, measurable, and entirely within your control.",
          "Keep a short training log so this is evidence rather than a feeling — most athletes badly underestimate their own progress.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is comparison ever useful?",
        a: "As information about what is possible or what to learn, yes. As a measure of your worth, no.",
      },
      {
        q: "How do I stop comparing on social media?",
        a: "Reduce exposure during competition weeks, and follow accounts that show process rather than only results.",
      },
    ],
  },

  {
    slug: "consistency-beats-motivation",
    title: "Consistency Beats Motivation: Stop Scrolling and Start Living",
    description:
      "Motivation is a feeling and feelings fluctuate. How athletes build systems that work on the days motivation doesn't show up.",
    excerpt:
      "You will not feel like it most days. Any plan that requires you to feel like it has already failed.",
    category: "For Athletes",
    keywords: [
      "consistency vs motivation",
      "building habits athletes",
      "discipline over motivation",
      "athlete routine",
    ],
    video: { id: "Rp2y59syWYI", title: "Stop Scrolling & Start Living | Consistency Beats Motivation" },
    quickAnswer:
      "Motivation is an emotional state that fluctuates daily, so it cannot be the mechanism that gets you to train. Consistency comes from systems — fixed times, prepared equipment, a minimum viable session and a visible streak — which keep working on days when motivation is absent.",
    sections: [
      {
        heading: "Design for the bad day",
        body: [
          "Build your routine around your worst realistic day, not your best. A plan that only survives high motivation is not a plan.",
          "Define a minimum session — the smallest version that still counts. On hard days you do that, and the streak survives.",
        ],
      },
      {
        heading: "Remove the decisions",
        body: [
          "Every decision is a chance to opt out. Fixed time, fixed place, kit packed the night before. The fewer decisions between you and the session, the more sessions happen.",
        ],
      },
    ],
    faqs: [
      {
        q: "What if I genuinely have no motivation?",
        a: "Do the minimum version. Starting reliably generates the motivation that waiting never produces.",
      },
      {
        q: "How long until training becomes a habit?",
        a: "Typically one to three months of consistent repetition at the same time and place.",
      },
    ],
  },

  {
    slug: "get-comfortable-being-uncomfortable",
    title: "Get Comfortable Being Uncomfortable: The Real Mechanism of Growth",
    description:
      "Adaptation happens at the edge of your capacity. How athletes learn to stay in productive discomfort without burning out.",
    excerpt:
      "Growth lives in the gap between what you can do and what you can nearly do. Most people avoid that gap.",
    category: "For Athletes",
    keywords: [
      "comfort zone athletes",
      "growth mindset training",
      "discomfort training",
      "mental toughness Chennai",
    ],
    video: { id: "JuFN3AWzPVE", title: "Get Comfortable Being Uncomfortable | The Real Secret to Growth" },
    quickAnswer:
      "Adaptation only occurs when demand slightly exceeds current capacity, which by definition feels uncomfortable. Athletes who learn to tolerate that specific discomfort — effort, difficulty, temporary incompetence — improve continuously, while those who avoid it plateau at the level they can already perform easily.",
    sections: [
      {
        heading: "Two kinds of discomfort",
        body: [
          "Productive discomfort is effort, awkwardness and being temporarily bad at something new. Harmful discomfort is sharp pain, injury and chronic exhaustion.",
          "Confusing them is dangerous in both directions — some athletes push through injury, others quit at the first sign of difficulty.",
        ],
      },
      {
        heading: "Training the tolerance",
        body: [
          "Deliberately spend part of every session doing something you are not yet good at. Most athletes drift toward drilling what they already do well, because it feels better.",
          "Being visibly incompetent in front of others is the specific discomfort most athletes avoid, and the one that most limits their range.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I know if discomfort is productive or harmful?",
        a: "Effort and awkwardness are productive. Sharp pain, joint pain and lasting exhaustion are not — those are signals to stop.",
      },
      {
        q: "Should every session be hard?",
        a: "No. Adaptation needs recovery. Hard sessions produce the stimulus; easy sessions and rest are when the improvement actually happens.",
      },
    ],
  },

  {
    slug: "five-minutes-scrolling-becomes-two-hours",
    title: "How 5 Minutes of Scrolling Becomes 2 Hours — and How to Break the Loop",
    description:
      "Why short scrolling sessions expand, what it costs athletes in focus and sleep, and practical ways to break the pattern.",
    excerpt:
      "The apps are engineered to remove every natural stopping point. You are not weak — you're outmatched by design.",
    category: "For Athletes",
    keywords: [
      "phone addiction athletes",
      "focus and social media",
      "screen time discipline",
      "attention training",
    ],
    video: { id: "Wy5PsB_hTUM", title: "How 5 Minutes of Scrolling Becomes 2 Hours (Break the Loop!)" },
    quickAnswer:
      "Infinite feeds remove natural stopping cues and deliver unpredictable rewards, which is the most powerful reinforcement pattern known. For athletes the cost is fragmented attention and delayed sleep, both of which measurably reduce training quality. Breaking it requires environmental changes, not willpower.",
    sections: [
      {
        heading: "Why it expands",
        body: [
          "Books have chapters, matches have rounds. Feeds have no end, so nothing prompts you to stop.",
          "The rewards are also unpredictable — most posts are dull, occasionally one is great. Variable reward is the schedule that produces the most persistent behaviour, and it is deliberate design, not accident.",
        ],
      },
      {
        heading: "What actually works",
        body: [],
        list: [
          "Add friction: log out, remove the app from your home screen, keep the phone in another room while training or studying.",
          "Create the missing stopping cue — a timer, or scrolling only while standing.",
          "Protect the hour before sleep. For athletes this is the highest-value change, because sleep drives recovery and skill consolidation.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does phone use really affect athletic performance?",
        a: "Indirectly but significantly, mainly through reduced and delayed sleep, which impairs reaction time, recovery and learning.",
      },
      {
        q: "Do I have to quit social media entirely?",
        a: "No. Most athletes get what they need from controlling when and where they use it, rather than eliminating it.",
      },
    ],
  },

  {
    slug: "the-biggest-lie-about-motivation",
    title: "The Biggest Lie About Motivation (And What Actually Drives Action)",
    description:
      "The myth that motivation precedes action gets it backwards. Why action comes first, and what that changes.",
    excerpt:
      "You have been told to wait until you feel motivated. That advice has cost more progress than any injury.",
    category: "For Athletes",
    keywords: [
      "motivation myth",
      "how motivation works",
      "action before motivation",
      "athlete mindset coach India",
    ],
    video: { id: "j1O0-klwvgk", title: "The Biggest Lie About Motivation (That’s Ruining Your Life)" },
    quickAnswer:
      "The common belief that motivation must come before action is backwards. Motivation more often follows action — starting a session generates the drive to continue it. Waiting to feel motivated means training only on days motivation happens to appear, which is why waiting produces such inconsistent results.",
    sections: [
      {
        heading: "The order is reversed",
        body: [
          "Almost every athlete I coach expects the sequence to be motivation, then action. In practice it runs the other way: action, then momentum, then motivation.",
          "This is why the hardest part of any session is putting your shoes on, and why the session is rarely as bad as anticipated once started.",
        ],
      },
      {
        heading: "Using it deliberately",
        body: [
          "Commit to five minutes. Not the session — five minutes. Almost always you continue, because the resistance was to starting, not to training.",
          "On the rare day you stop at five minutes, the streak still survives, which matters more than any single session.",
        ],
      },
    ],
    faqs: [
      {
        q: "So motivation doesn't matter at all?",
        a: "It helps, and it is pleasant when present. It just cannot be the trigger, because it is not reliably available.",
      },
      {
        q: "What is the five-minute rule?",
        a: "Commit only to the first five minutes of a session. Starting usually generates enough momentum to finish, and starting is the part resistance attaches to.",
      },
    ],
  },

  {
    slug: "stop-following-others-start-following-yourself",
    title: "Stop Following Others, Start Following Yourself",
    description:
      "Copying another athlete's path ignores your body, sport and circumstances. How to build a plan that fits you.",
    excerpt:
      "Someone else's routine was designed for someone else's body, sport and life. Borrow the principle, not the plan.",
    category: "For Athletes",
    keywords: [
      "athlete individual training plan",
      "stop copying others",
      "personal training path",
      "athlete mindset",
    ],
    video: { id: "aDYx10i-36Y", title: "Stop Following Others Start Following Yourself | Powerful Motivation" },
    quickAnswer:
      "Copying another athlete's routine ignores the differences in body, sport, training age and life circumstances that made that routine work for them. Take the underlying principles — progressive overload, consistency, recovery — and build a plan around your own constraints and competition calendar.",
    sections: [
      {
        heading: "Why copied plans fail",
        body: [
          "An elite athlete's programme assumes their training history, recovery capacity and schedule. Applied to someone without those, it usually produces injury or burnout rather than their results.",
          "What transfers is the principle. What does not transfer is the specific volume, intensity and timing.",
        ],
      },
      {
        heading: "Building your own",
        body: [
          "Start from your competition calendar and work backwards. Then apply the general principles at a level you can actually recover from.",
          "Keep enough record to know what is working for you specifically, because that record is the only thing that can tell you.",
        ],
      },
    ],
    faqs: [
      {
        q: "Should I follow a professional athlete's training programme?",
        a: "Learn from the structure, but do not copy the volume. Their programme assumes years of accumulated training capacity.",
      },
      {
        q: "How do I know what works for me?",
        a: "Track your sessions and how you respond. Sustained personal data beats any generic template.",
      },
    ],
  },

  {
    slug: "going-blank-on-stage-why-and-how-to-fix-it",
    title: "Ever Gone Blank on Stage? Why It Happens and How to Fix It",
    description:
      "Going blank under pressure is a working-memory failure, not a memory failure. What causes it and how to train it out.",
    excerpt:
      "You didn't forget it. Under pressure your working memory got occupied by something else.",
    category: "Sports Psychology",
    keywords: [
      "going blank under pressure",
      "stage fright",
      "performance anxiety",
      "memory under pressure",
    ],
    video: { id: "nLLCQ1uZUOI", title: "“Ever Gone Blank on Stage? Here’s WHY (And How to Fix It)”" },
    quickAnswer:
      "Going blank is a working-memory failure caused by anxiety. Worry consumes the limited mental workspace you need to retrieve information, so the material is still stored but temporarily inaccessible. It is fixed by over-rehearsing to automaticity, having a fixed opening, and using breathing to reduce the load.",
    sections: [
      {
        heading: "The information was never lost",
        body: [
          "Blanking is not erasure. The knowledge is intact, which is why it returns the moment you step off stage and the pressure drops.",
          "What failed was retrieval. Anxiety occupies working memory with self-monitoring and worry, leaving too little capacity to pull up what you know.",
        ],
      },
      {
        heading: "How to train it out",
        body: [],
        list: [
          "Over-rehearse the opening until it is automatic. Automatic actions need almost no working memory, so they survive pressure.",
          "Have a fixed first line or first move. Most blanking happens at the start, and a decided opening removes that gap.",
          "Rehearse under mild pressure — in front of one person, then a few — so performing while observed is not novel.",
          "Slow the exhale before starting; lower arousal frees working memory.",
        ],
      },
    ],
    faqs: [
      {
        q: "Why do I forget everything when I'm nervous?",
        a: "Anxiety consumes working memory with worry and self-monitoring, which blocks retrieval. The information is still there.",
      },
      {
        q: "Does practising more prevent blanking?",
        a: "Practising to automaticity does, particularly for the opening. Practice that stays effortful still needs working memory and remains vulnerable.",
      },
    ],
  },

  {
    slug: "stop-overthinking-decisions",
    title: "Stop Overthinking: The Real Reason You Can't Make Decisions",
    description:
      "Overthinking is usually fear of the wrong choice, not lack of information. How athletes decide faster and better.",
    excerpt:
      "More analysis rarely produces a better decision. Past a point it just delays it.",
    category: "Sports Psychology",
    keywords: [
      "stop overthinking",
      "decision making athletes",
      "analysis paralysis",
      "overthinking sport",
    ],
    video: { id: "L3ElOh4UP4A", title: "Stop Overthinking: The Real Reason You Can’t Make Decisions" },
    quickAnswer:
      "Overthinking is usually driven by fear of making the wrong choice rather than by missing information. Past a certain point, extra analysis stops improving the decision and only delays it. Set a decision deadline, define what would make a choice good enough, and treat most decisions as reversible.",
    sections: [
      {
        heading: "It isn't an information problem",
        body: [
          "People stuck deciding usually have enough information already. What they lack is tolerance for the possibility of being wrong.",
          "That is why more research does not resolve it — the research was never the obstacle.",
        ],
      },
      {
        heading: "In competition, speed wins",
        body: [
          "Mid-performance, a decent decision made instantly beats a perfect one made late. Sport punishes hesitation more reliably than it punishes imperfect choices.",
          "This is what pre-decided rules are for: decide your responses in advance, in training, so competition requires recognition rather than deliberation.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I stop overthinking before a match?",
        a: "Pre-decide your plan and your responses in training, then in competition your only job is to execute rather than choose.",
      },
      {
        q: "Is overthinking the same as being careful?",
        a: "No. Careful thinking improves the decision. Overthinking repeats the same considerations without adding information.",
      },
    ],
  },

  {
    slug: "why-motivation-fails-discipline-builds-success",
    title: "Why Motivation Fails and Discipline Builds Success",
    description:
      "Consistency multiplied by intensity is what produces results. Why discipline outlasts motivation for athletes.",
    excerpt:
      "Motivation is weather. Discipline is climate. You plan around one and hope for the other.",
    category: "For Athletes",
    keywords: [
      "motivation vs discipline",
      "consistency intensity",
      "athlete success habits",
      "Kishore Kumar discipline",
    ],
    video: { id: "SozdcWgN4wE", title: "Why Motivation Fails (And How Discipline Builds Success) | Consistency  Intensity" },
    quickAnswer:
      "Motivation fails because it depends on mood, sleep and circumstance, none of which are reliable. Discipline is a system that runs regardless. Results come from consistency multiplied by intensity — and because it is a product, high intensity applied inconsistently still multiplies out to very little.",
    sections: [
      {
        heading: "Consistency × intensity",
        body: [
          "Think of results as a product, not a sum. Training extremely hard twice a month multiplies high intensity by near-zero consistency, and the answer stays near zero.",
          "Moderate intensity applied four times a week for a year beats it comprehensively, which is unintuitive to athletes who equate effort with progress.",
        ],
      },
      {
        heading: "Building the system",
        body: [
          "Fix the time. Prepare the environment. Define a minimum session for bad days. Track the streak.",
          "None of this is inspiring, which is precisely why it works — it does not depend on feeling inspired.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is motivation useless?",
        a: "No — it is genuinely useful when it appears. It just cannot be the mechanism you rely on, because it is not dependable.",
      },
      {
        q: "What matters more, training hard or training often?",
        a: "Often, up to a point. Consistency creates the base that makes hard training productive rather than injurious.",
      },
    ],
  },
];

/** Published as a batch; reading time scales with the written expansion. */
export const VIDEO_POSTS: BlogPost[] = SEEDS.map((s, i) => ({
  ...s,
  publishedAt: "2026-08-04",
  readingMinutes: 4,
  image: img(i).src,
  imageAlt: img(i).alt,
}));
