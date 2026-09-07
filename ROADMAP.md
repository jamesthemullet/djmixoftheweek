# Product Roadmap — DJ Mix of the Week

The site already does the browsing part well: DJs, genres, nationalities, a League of Mixes
ranking, RSS. What's missing is a reason to come back once you've found a mix you like, and
better surfacing of the content that's already indexed. Everything below is scored against four
jobs:

- **Acquisition** — brings new visitors in
- **Engagement** — deepens a single visit
- **Retention** — earns a repeat visit
- **Fun** — no metric, just delight

Every feature is broken into a **PR sequence** — each step small enough for a human to review in
about 15 minutes. Genuinely atomic changes are left as one PR.

## Now (ship in weeks — reuses existing infra)

### 1. Related mixes — *Engagement, Retention*
"More from this DJ" / "more in this genre" links at the bottom of every mix page, so a visit
doesn't dead-end after one mix.

1. Query: given a mix, find related mixes by shared DJ/genre/nationality — pure function + tests,
   reusing data already fetched for the `dj/`, `genre/`, `nationality/` pages.
2. Component rendering the related-mixes list on the mix page (`[...slug].astro`).

### 2. Your DJs digest — *Retention*
`your-djs.astro` already lets a user track DJs they follow. Surface a simple "new mixes from
your DJs" banner on the homepage rather than requiring a visit to that page to find out.

1. Query: mixes published since a user's last visit, filtered to their followed DJs — pure
   function + tests.
2. Banner component on the homepage rendering the result.

### 3. League of Mixes filters — *Engagement*
`league-of-mixes.astro` ranks mixes but has no way to narrow by genre or nationality — improving
an existing page rather than building a new one.

1. Extend the league query to accept a genre/nationality filter param — pure function + tests.
2. Filter controls added to the existing league UI.

### 4. Mix structured data — *Acquisition*
MusicPlaylist/CreativeWork structured data on every mix page so search engines understand mix
content (DJ, genre, date) directly.

1. **One PR.** A single JSON-LD block added to the mix template from fields that already exist.

## Next (this quarter — moderate new build)

### 5. Genre/nationality guide pages — *Acquisition, SEO*
Static "Best [Genre] mixes" landing pages generated from data already in League of Mixes,
targeting search terms the site can already answer.

1. Query: top-N mixes per genre by ranking — pure function + tests, reusing the League of Mixes
   data layer.
2. Static page template reusing the existing genre page layout, internal-linking into mix pages.

### 6. Weekly mix email — *Retention, Acquisition*
A weekly digest of new mixes matching a user's followed DJs/genres — the site's first outbound
channel.

1. **Infra (Mise en Place):** pick and wire an email provider — no email package currently in
   `package.json`.
2. Digest content query — new mixes matching follows — pure function + tests.
3. HTML email template.
4. Scheduled job (Vercel cron) assembling and sending the digest weekly.
5. Unsubscribe/preference handling.

## Later (bigger bets — new infra)

### 7. User mix submissions — *Engagement, Retention*
Let users submit a mix link for review/inclusion, moderated before going live.

1. Migration/data store: a `submissions` table or content collection with a status
   (`pending`/`approved`/`rejected`).
2. Submission form + API route, writes as `pending`.
3. Admin moderation UI — list pending submissions, approve/reject.
4. Approved submissions flow into the existing mix listing pages.

---
*DJ Mix of the Week — product roadmap, 2 September 2026*
