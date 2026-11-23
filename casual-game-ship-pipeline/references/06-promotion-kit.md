# Promotion Kit — Listings, Visuals, Landing Page, Wiki

## Store Listings (per language)

Prepare four fields per locale. Count **bytes**, not characters: Cyrillic and CJK consume roughly 2 bytes per character, so a 30-character Cyrillic title is often over a 60-byte limit.

| Field | Typical limit | Notes |
|-------|---------------|-------|
| App name | 30 chars / 60 bytes | keep the English brand token for search weight; localize the descriptive part |
| Short description | 80 chars | the one-line hook shown above the fold |
| Full description | longer | features, modes, no time pressure, offline play |
| Keywords | 60 bytes | comma-separated, no spaces after commas, no duplicates of the title |

Localization pattern that worked: brand name stays recognizable in Latin script (`Neon Block …`) while the trailing noun is translated per language; the keyword set is translated into the same 10+ languages so ASO works in each market. Keep a bilingual table with the ISO language tag (es-ES, pt-BR, etc.) so the store manager can paste directly.

## Market Priority

Do not spread equally. Tier by installed base and IAA eCPM, then localize top markets first. A practical tier-1 set: US/UK, Brazil, Mexico, Germany, France, Japan, Indonesia, India (Hindi), Russia, Turkey. Hindi and Bengali matter for India; Vietnamese is often forgotten but worth adding.

## Promotional Video / GIF

- Pick the exciting segment (a chain clear or combo), not the first seconds. Locate the timestamp by scanning frames.
- Use a two-pass palette workflow (palettegen then paletteuse) for GIFs. Cap width (~270 px), fps (~10), and seconds so the file stays under the platform cap (X allows about 5 MB for non-verified accounts).
- If the first render exceeds the cap, reduce width before reducing fps; verify file size at each step.
- Export a real gameplay clip from the built game at a fixed device resolution for store videos.

## Promo Images

- A 1024×500 banner: brand block on the left (title, rating, 3 bullets, CTA), a real gameplay screenshot inside a neon phone frame on the right, gradient background with decorative shapes kept out of the text area.
- Keep decorative elements away from the rating row and the CTA; a "looks fine" render often still has a square overlapping a button. Do a visual QA pass and list remaining issues explicitly.
- All text in a promo image must be in the target language; do not mix Chinese bullets into an English banner.
- If AI-generated art is used and a watermark must be removed, verify removal by measuring pixels, not by asking a vision model that may cache an earlier view. Blur-based background fill beats a crude stamp for semi-transparent gray text.

## Download / Landing Page

- Build a self-contained page: pure HTML/CSS, mobile-first, no external framework.
- Sections that convert: sticky nav, hero with rating and download count, playable embed of the real game, screenshot gallery, description, rating distribution, reviews, download CTA.
- Fictional data for a demo landing page is acceptable only if it is obviously a mockup; never present invented ratings as real in a public launch.
- Ad scripts must be guarded (for example `if (window.Capacitor)`) so the page works on a plain website without throwing.
- A missing video source breaks the player — use a poster image placeholder until the real video exists.
- Package name / deep link in the CTA must match the actual store listing.

## Wiki Promotion — the honest answer

Wikipedia is an encyclopedia, not a promotion channel. AFC (Articles for Creation) review checks two things: **notability** (independent, reliable third-party coverage) and **neutral tone**.

- Store pages, the developer's own website, self-hosted landing pages, and press releases are *primary* sources. They prove the game exists; they do not establish notability.
- An article written like an advertisement is rejected. Use neutral encyclopedic prose: what the game is, its modes, its release, with inline citations.
- Conflict of interest: if the author is the developer, declare it in the submission. Submitting a "I have no conflict of interest" declaration as a developer is a false statement. Do not do it.
- Keep infobox, gameplay, modes, development, references, external links. Put the store URL and official site in infobox/refs/external links, not as marketing copy.
- Byte-limited fields and translated keywords still apply to the store, not to wiki.

What actually drives downloads: ASO, localized screenshots, short-form video, creator reviews, and earning independent press coverage — which conveniently also creates the reliable sources a wiki article would need. Sequence: get coverage first, then consider the wiki article.

## Review Copy & Social Posts

- Short TikTok intro: one hook line, one "what you do" line, one call to action. Produce several variants and pick by tone, not length.
- X/TikTok GIF: vertical, loopable, within size cap.
- Facebook India: Hindi, English, Bengali; localize the hook, not just the words.
- Game reviews: if writing sample reviews for a mockup, label them as samples. Do not publish fabricated user reviews as genuine.
