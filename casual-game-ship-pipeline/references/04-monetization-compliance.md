# Monetization & Compliance

## Choose the Model From Evidence

For a casual block puzzle, verify the current market shape before deciding. The reference project researched a leading title: overwhelmingly IAA (banner roughly 55%, interstitial 35%, rewarded 10%), with IAP contributing almost nothing — so the decision was to clone that IAA-heavy shape with a single remove-ads purchase. Re-check the data for your release date; do not cargo-cult a year-old ratio.

## AdMob

- Three placements: banner (persistent at bottom), interstitial (between rounds, with a first-play and recent-rewarded cooldown), rewarded (opt-in continue). App-open ads were deliberately excluded.
- **One ad account per app ID.** Different package names must have different App IDs and different unit IDs. Enforce with an automated assertion on both web config and native files (Android `strings.xml`, iOS `Info.plist`).
- A new package with no fill is usually a backend ID/config problem, not a code bug. Capture the real error code (for example `Ad failed to load : 3`) before changing code.
- Test IDs are for development only. A test-ad badge is the SDK protecting you; it disappears on a real device with a real unit ID.
- Governance: one central ad gate config that can disable all ads at once (for an ad-free review build or a portal variant). Do not scatter enable flags.

### Rewarded ads — three rules learned the hard way

1. **A `show()` promise is not "the user finished watching."** Some SDKs resolve on show, or only on reward, leaving error paths permanently pending. Drive from native reward/dismiss events plus a hard timeout.
2. **Lock the UI during loading.** The moment the user taps "watch ad to continue", put up a full-screen gate (spinner + "loading, please wait") above all overlays. Close it on reward, on ad shown, or on every failure path. Give it its own safety timeout so no path can trap the user. Decouple "close the gate" from "grant the reward" — an early ad close should release the UI without granting.
3. **No skip button.** A skip button is exactly the "tap and run" hole the gate is meant to close.

### Interstitial & banner edge cases

- Interstitial `show()` may resolve before dismissal; listen to the dismissed event to resume the game.
- Never call banner `load()`/`reload()` immediately after a full-screen ad — a failed reload can `destroy()` the banner permanently. Use an "ensure visible" check: if a banner is already showing, do nothing; only rebuild when it is actually missing.
- Aggressive interstitial tuning needs a "first interstitial shown" flag checked only once; checking a cumulative play-time threshold on every call can make the first ad effectively never fire.

## In-App Purchase (RevenueCat)

- Decide lifetime vs subscription explicitly. Reference project flipped from subscriptions to a single non-consumable lifetime remove-ads purchase (entitlement `removeads`, product `lifetime`, single sku `remove_ads`).
- Hide the purchase entry entirely until the API key is configured (`entryEnabled = false`), so a test build never shows a broken buy button.
- Verify entitlement, restore purchases, and handle pending states.
- **Store capability must be verified, not assumed.** The Capacitor RevenueCat plugin did not support Galaxy Store IAP at the time of the reference project (a known open issue); the native Android SDK did, but the wrapper did not expose it. Verify the exact installed version's supported stores before promising IAP on a third-party store. The pragmatic fallback there was a pure-IAA Galaxy build with no remove-ads entry.

## Privacy & Data Collection Forms

Fill a store's data-collection declaration from what the installed SDK actually collects — neither a copied competitor checklist nor an over-broad "select everything".

Reference mapping for AdMob / Google Mobile Ads SDK on Android:

| Category | Declare | Do not declare |
|----------|---------|----------------|
| Identifiers | advertising ID (AAID; maps to OAID where the form has no AAID option) | IMEI, IMSI, MAC, SSID/BSSID, serial, ID card |
| Basic info | age band, gender, country, language, interests | name, birthday, account, avatar |
| User content | none | any user-generated content |
| App info | app version, usage, ad interactions | installed app list, app settings |
| Device info | model, brand, OS version, system language, network info | sensors, battery, precise storage |
| Other data | IP address, approximate location (IP-derived), crash logs, diagnostics | precise GPS |

Purpose: advertising plus analytics; cross-border transfer if data leaves the country; keep the published privacy policy consistent with the form — reviewers compare them. If the store form has no AAID option, using OAID to represent "advertising identifier" is common practice; note it explicitly. Do not copy a first-party SDK's much larger collection list (WLAN, sensors, location) into an AdMob declaration.

## iOS / Xcode Hard Constraint

- Capacitor 8 + AdMob locks the Google Mobile Ads SDK to a version that requires a modern Xcode (Xcode 16+, and Apple's upload requirement moved to Xcode 26+ in 2026).
- If the local Xcode is too old, do not hack a signed framework's `.swiftinterface` — that breaks code signing and produces "No such module" errors. Do not fight it.
- pragmatic split: a `remove:admob` script for local development builds (game runs, no ads) and a `restore:admob` script for release on a modern Xcode machine or cloud Mac.
- Submitting to App Store Connect: add the privacy manifest (`PrivacyInfo.xcprivacy`) to the project, declare encryption exemption if applicable, use a release name that satisfies the store's title rules, and confirm the bundle ID everywhere (Capacitor config, Xcode project, Info.plist).

## Per-Store Notes

- **Google Play**: AAB with Play App Signing; Data Safety form; `AD_ID` permission; target SDK current; app-ads.txt hosted at the developer site.
- **App Store**: categories, age rating, export compliance, W-8BEN-E for non-US developers, localized metadata, excluded markets where required.
- **Galaxy Store**: seller + DUNS, 80/20 revenue share, 16 KB page alignment for newer devices, distinct package and ad IDs.
- **Amazon**: separate listing assets, pad/tablet previews, promo video.
- **HTML5 portals (Poki / CrazyGames / GameDistribution)**: each needs its own build variant with its own SDK adapters; no AdMob IDs; pass their SDK compliance checks (mute, no-fill, loading).
- **Telegram Mini Apps**: Adsgram ads, Stars purchase, cache-busting query on every build.

## Data Analytics Decision

A valid choice is to integrate no third-party analytics SDK and keep `track()` as a local console call. If that is the decision, document it and make sure the privacy form says so. Do not silently add a telemetry SDK later; it invalidates the form.
