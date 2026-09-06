# Google Business Profile — setup playbook

For **Spartacus Martial Arts Academy**, Perambur, Chennai.

This is the single highest-leverage off-page task available. For "martial arts
near me" and "sports psychologist Chennai", the map pack sits above the organic
results — a verified GBP can outrank the website itself.

> **Blocked until one thing is true.** Google verifies your address physically.
> The site currently publishes `postalCode: "600000"` and `street: "Chennai"`,
> which are placeholders. GBP and the website must carry the *identical*
> address, so fix `src/lib/seo.ts` first (see step 0) — otherwise the NAP
> mismatch actively suppresses local ranking, and verification may fail.

---

## Step 0 — Fix the address first (do this before anything else)

Get these three things:

1. **Exact street address** of the academy as it appears on a utility bill —
   building number, street, area, Perambur, Chennai, and the real 6-digit PIN.
2. **Exact GPS coordinates.** Google Maps → right-click the academy's front
   door → the first row is `lat, lng`. Copy both to 6 decimal places.
3. **A phone number you answer.** Ideally the WhatsApp number (+91 98845 99939),
   because the whole funnel already routes there.

Send me those and I'll update `seo.ts`, the JSON-LD and `llms.txt` in one pass.
NAP must be byte-identical everywhere it appears.

---

## Step 1 — Claim the profile

google.com/business → **Manage now** → search "Spartacus Martial Arts".

- If a listing already exists (Google auto-creates these from user activity),
  **claim it** rather than creating a second one. Duplicates split your reviews
  and rankings, and merging them later is slow.
- If nothing exists, create it.

**Verification** is usually video for service businesses in India: you record a
continuous walkthrough showing the signage, the street, the training space and
some proof you manage it (keys, equipment, a bill). Have the signage visible
before you start recording — a re-shoot costs days.

---

## Step 2 — Categories (this decides which searches you appear in)

Category choice matters more than anything else on the profile.

**Primary:** `Martial arts school`

**Secondary** (add all that genuinely apply):
- `Wushu school` — rare category, very low competition, and you are a National
  Medalist in it. Strong differentiator.
- `Karate school`
- `Judo school`
- `Kickboxing school`
- `Boxing gym`
- `Psychologist` *or* `Sports psychologist` if offered in your area

One primary category, then secondaries in descending order of what you most
want to be found for. Do not add categories you don't actually teach — Google
suspends profiles for it, and a suspension is far more expensive than the
traffic.

---

## Step 3 — Business description (750 chars)

Lead with the credentials. They are the genuine differentiator against every
other Chennai academy, and Google indexes this text.

```
Spartacus Martial Arts Academy in Perambur, Chennai, is led by Kishore Kumar —
a Wushu National Medalist, Kung Fu Black Belt, State-level Judge and Sports
Psychologist.

We teach Wushu, Kung Fu, Karate, Judo, kick boxing and boxing to children,
teenagers and adults, from complete beginners to competitive athletes.

What makes the academy different is that mental training is built into the
coaching, not taught separately. Through the Warrior Mind Method™ — Focus,
Fire, Flow, Forge and Fight — students train focus, confidence, discipline and
pressure handling alongside technique.

Free trial class available. Message us on WhatsApp to book.
```

---

## Step 4 — Services

Add each as a separate service with its own description. Each one becomes a
surface Google can match a query against.

| Service | Note |
|---|---|
| Wushu classes | your competitive specialism |
| Kung Fu classes | |
| Karate classes | popular first discipline for children |
| Judo classes | |
| Kick boxing | strongest fitness-intent draw |
| Boxing | |
| Kids martial arts | high parent search volume |
| Sports psychology coaching | the digital funnel's entry point |
| Athlete mindset coaching | |
| School & academy workshops | B2B enquiries |

---

## Step 5 — Photos (weekly, ongoing)

Profiles with regular photos get materially more calls and direction requests.
Google timestamps uploads and favours active profiles.

Minimum to start:
- **Logo** and **cover** (the cover is what shows in the map pack)
- **Exterior** — the signage and street, shot so someone could find it
- **Interior** — the training floor, clean and lit
- **Team** — you in uniform; medals and certificates visible if you have them
- **At work** — real classes, real students *(get parental consent for minors
  before publishing any photo of a child)*

Then **one or two photos a week**, indefinitely. This is the single most
neglected ranking factor among local competitors.

---

## Step 6 — Posts (weekly)

GBP posts expire after 7 days, so this only works as a habit.

Rotate: an upcoming workshop → a student result → one mindset tip → a class
schedule reminder. Every post ends with the WhatsApp CTA.

You already have 31 blog articles. Each one is a post: two lines of the quick
answer, then link the full article. That's a month of posts from existing work.

---

## Step 7 — Q&A (seed it yourself)

You may post questions on your own profile and answer them. Do it — otherwise
the section stays empty or gets answered by strangers.

Seed these, taken from the FAQs already on the site:

- What age can my child start martial arts?
- Do I need to be fit before joining?
- Which martial art is best for a beginner?
- Do you offer a free trial class?
- What are the class timings?
- Is martial arts safe for children?
- Do you teach adults as well as kids?
- What is the Warrior Mind Method?

---

## Step 8 — Reviews (the compounding one)

Review count and recency are among the strongest local ranking factors, and
they're what a parent actually reads before calling.

**The flow:**

1. Get the short review link: GBP dashboard → **Ask for reviews** → copy link.
2. Ask in person, right after a good moment — a grading, a first competition, a
   visible improvement the parent noticed. Not by mass message.
3. Follow up on WhatsApp within the hour, while it's fresh:

```
Hi [name], really glad [student] had a good session today 🙏
If you have 30 seconds, a quick Google review genuinely helps other
Chennai parents find us: [link]
Thank you!
```

4. **Reply to every review**, positive or negative, within 48 hours. Replies are
   public and are read by people deciding whether to call.

**Never** buy reviews, offer discounts for reviews, or post them yourself.
Google detects this, and the penalty removes every review you have — including
the real ones.

**Target:** 10 genuine reviews in the first 60 days. That's roughly one ask per
week from students you already teach.

---

## Step 9 — Directories (NAP consistency)

After GBP is verified, list on these with the **byte-identical** name, address
and phone:

- Justdial · Sulekha · IndiaMART
- Chennai-specific local directories
- Facebook Page and Instagram bio (same address text)

Inconsistent NAP across directories is a common, invisible cause of weak local
ranking. Copy-paste from one source; never retype.

---

## Ongoing rhythm

| Cadence | Task |
|---|---|
| Weekly | 1–2 photos · 1 post · reply to new reviews |
| Weekly | Ask 1–2 happy students for a review |
| Monthly | Check GBP Insights — calls, direction requests, search terms |
| Quarterly | Re-verify hours, services and photos are current |

---

## What I can do once you have the details

Send me the real street address, PIN and coordinates and I'll update
`src/lib/seo.ts`, the `LocalBusiness` JSON-LD and `llms.txt` so the site matches
the profile exactly. The schema is already in place and waiting for real values.
