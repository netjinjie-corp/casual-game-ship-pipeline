# Prelaunch Checklist

Copy this into the project tracker. Each item needs a pass criterion and an owner. Items that are intentionally deferred (for example a release-time API key) must be marked as such, not silently skipped.

## Code & Build

- [ ] All scripts pass `node --check`; inline scripts compile.
- [ ] Unit tests green; test count recorded and stable.
- [ ] i18n checker green: every locale has every key, placeholders match.
- [ ] Level checker green and its expected count matches the current design.
- [ ] Every shared file's MD5 matches across all distributed copies; platform-unique files are confirmed different.
- [ ] Source-of-truth checker green: regenerating template plus config reproduces every committed build byte-for-byte.
- [ ] Headless load: no console errors, canvas non-blank, a real input reaches score or fail.
- [ ] Oldest supported WebView tested (no `inset`, no bare `dvh`, flex gap fallback).

## Ads & IAP

- [ ] `useTest = false`; no official test App ID remains anywhere.
- [ ] No `<YOUR_...>` or placeholder ad unit IDs.
- [ ] Per-app ad IDs pairwise distinct (App ID + banner + interstitial + rewarded) across web config and native files.
- [ ] Rewarded path: reward granted once, UI gate opens instantly and closes on every exit path, hard timeout verified.
- [ ] Interstitial: first-play/cooldown gate correct; replay of old levels still triggers the intended event.
- [ ] Banner survives full-screen ads; "already visible" is not destroyed.
- [ ] Ad-free review build available via one governance switch.
- [ ] IAP entry hidden until API key configured; entitlement, purchase, and restore verified.
- [ ] Store capability for IAP verified against the installed plugin version (not assumed).

## Store Metadata

- [ ] App ID identical everywhere: Capacitor config, Android namespace/applicationId, Xcode bundle ID, Info.plist.
- [ ] Store listing name satisfies that store's title rules (some reject a name used on another store).
- [ ] Privacy policy hosted on a public URL and linked in-app and in the store form.
- [ ] Privacy data-collection form matches what the SDKs collect; cross-border and purpose declared.
- [ ] app-ads.txt hosted with the real publisher ID.
- [ ] Data Safety / privacy nutrition labels filled.
- [ ] Age rating, categories, export compliance (iOS), target SDK (Android).
- [ ] Screenshots are real gameplay at the required resolutions; no AI-generated boards.
- [ ] Localized titles/descriptions count bytes, not characters; Cyrillic/CJK roughly 2 bytes each.
- [ ] Keyword field within byte limit.

## Signing & Release

- [ ] Release keystore located and its certificate fingerprint recorded; multiple offline backups exist.
- [ ] Keystore used for the listing is the same one that will sign all future updates.
- [ ] Galaxy/Play namespace not corrupted by a sibling-project sync.
- [ ] 16 KB page alignment checked where required.
- [ ] Version code / build number incremented and cache-busting token bumped.

## Promotion

- [ ] Landing page self-contained; ad scripts guarded so they degrade gracefully off-app.
- [ ] Promo GIF within platform size limit; exciting segment extracted, not the first seconds.
- [ ] Promo images free of watermarks; verify at pixel level if generated art was cleaned.
- [ ] Claims in promo copy are truthful; invented ratings are not presented as fact.
- [ ] Wiki article (if any) is neutral, has independent reliable sources, and declares conflict of interest.

## Documentation & Handoff

- [ ] Dated work log notes what changed, files touched, verification result, and deliberate deviations.
- [ ] Long-term project note updated with decisions that must survive across sessions.
- [ ] RESTORE instructions present next to the golden snapshot.
- [ ] Stale doctrine removed after any rule change.

## Sign-off Line

Record: checker result (for example 10/12 with two deferred external keys), which platform builds were produced, and which were only prepared. Never report "shipped" for a build that was not actually submitted.
