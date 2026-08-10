# Connect the Spartacus site to the same CRM

Both websites feed **one** Supabase queue — the `public_leads` table the
WarriorCRM drains. This site (`kishorekumarcoach.com`) already does; this file
is the drop-in for the **Spartacus** site so its leads land in the same place,
tagged so the CRM can tell the two apart.

Nothing here is specific to this repo — it's plain `fetch`, so it works whether
Spartacus is Next.js, React, or a plain HTML page.

---

## 1. What the CRM expects

Each website inserts one row shaped like this. The **only** difference between
the two sites is the `source` value:

| Field | kishorekumarcoach.com | Spartacus |
|---|---|---|
| `source` | `"kishorekumarcoach.com"` | `"spartacusmartialarts.com"` |

That single field is how the CRM routes and reports on each site.

---

## 2. The snippet (paste into the Spartacus site)

Use the Supabase **anon / publishable** key — never the `sb_secret_` key. It's
safe in the browser *only* because the `public_leads` table has an insert-only
RLS policy (see step 4).

```js
// lead.js — submit a Spartacus lead into the shared CRM queue
const SUPABASE_URL = "https://oqwbmtdrjxfbnitlzehe.supabase.co";
const SUPABASE_ANON_KEY = "PASTE_YOUR_ANON_PUBLISHABLE_KEY_HERE";

export async function submitSpartacusLead(input) {
  const lead = {
    name: (input.name || "").trim(),
    phone: (input.phone || "").trim(),
    whatsapp: (input.phone || "").trim(),
    email: (input.email || "").trim(),
    athleteAge: (input.age || "").trim(),
    sport: (input.sport || "").trim(),
    leadType: input.leadType || "Athlete", // "Athlete" | "Parent" | "Coach"
    mainProblem: (input.mainProblem || "").trim(),
    goal: (input.goal || "").trim(),
    source: "spartacusmartialarts.com", // <-- the only line that differs
    campaign: (input.campaign || "").trim(),
    landingPage: typeof window !== "undefined" ? window.location.href : "",
    dateAdded: new Date().toISOString().slice(0, 10),
    stage: "New Lead",
    status: "Active",
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/public_leads`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ payload: lead }),
  });

  return { forwarded: res.ok };
}
```

Wire it to the form:

```js
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  await submitSpartacusLead(data); // failures fall through to the WhatsApp CTA
  showThankYou();
});
```

---

## 3. Allow the Spartacus origin in the CSP

If the Spartacus site sets a Content-Security-Policy (it should), its
`connect-src` must include the Supabase host or the browser blocks the request:

```
connect-src 'self' https://oqwbmtdrjxfbnitlzehe.supabase.co;
```

Supabase itself allows cross-origin calls from any site by default, so no
Supabase-side CORS change is needed.

---

## 4. One-time Supabase setup (shared by both sites)

Run once in the Supabase SQL editor. This is what makes the anon key safe in
the browser — it can **insert** a lead and do nothing else:

```sql
alter table public.public_leads enable row level security;

create policy "any site may insert a lead"
  on public.public_leads
  for insert to anon
  with check (true);

-- deliberately NO select/update/delete policy for anon,
-- so no visitor can ever read the queue.
```

---

## 5. Spam control (both sites)

Because the queue is open to anonymous inserts, add **Cloudflare Turnstile** or
**hCaptcha** (both free, invisible) to each form and verify the token in a
Supabase Edge Function before the row is written. Without it, anyone can script
inserts and flood the CRM. This is the one High-priority security item that
applies to both sites equally.
