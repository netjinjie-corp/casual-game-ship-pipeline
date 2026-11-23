# Pitfalls — Ranked "If I Did It Again" Lessons

Ranked by cost. Each entry states the trap and the rule that prevents it.

1. **Do not port a working visual to another engine to chase 1:1 fidelity.** A Canvas2D neon look (shadow blur, alpha compositing) could not be reproduced in a native scene system after a dozen texture tuning rounds. Wrap the working build instead of rewriting it. Rule 6.

2. **Back up before every edit, with a descriptive timestamped folder.** A "small fix" overwrote a week of fixes that existed only in one platform copy. Prefix same-named files or they overwrite each other inside one backup folder.

3. **Find the real source of truth before editing.** The friendliest-named directory was stale; the shipping build read a different copy. Editing the stale one silently did nothing. Mark source vs generated copies explicitly.

4. **Never hand-edit a generated file.** Any fix applied to a derived copy is erased on the next sync. Fix the template/config, regenerate, verify byte parity with a drift checker.

5. **Delete fragile patch files once a template exists.** A patch keyed to specific lines broke every time the source lines changed. Template plus config removes the whole class of failure.

6. **Different app IDs need different ad IDs — enforce it.** Copying one ad set to a second package produced no fill. Assert pairwise distinct App ID and all unit IDs on both web and native sides.

7. **Never hack a signed framework to work around a toolchain limit.** Editing a `.swiftinterface` inside a signed AdMob framework broke code signing and produced "No such module" errors. The real fix was upgrading Xcode or keeping a dev build without ads and restoring ads only for release on a modern machine.

8. **Keep the keystore safe and verify with the right tool.** A "lost keystore" was a directory-listing error on a non-ASCII path; the key was present. Confirm with `keytool`/`apksigner` directly on the file. Keep multiple offline backups — a lost key means the app can never be updated. The signing certificate used for the listing must be the one used for all later updates.

9. **Do not reload a banner right after a full-screen ad.** A failed reload could destroy the banner permanently. Use "if already visible, do nothing; if missing, rebuild".

10. **A rewarded-ad `show()` promise does not mean the reward was earned.** Some SDKs resolve on show or only on reward, leaving failures pending forever. Drive from native reward events plus a hard timeout; lock the UI with a gate during load; close the gate on every path.

11. **Cumulative-time gates checked on every call can make an interstitial never fire.** Check the first-play condition once with a persisted flag; separate "has fired before" from "is currently eligible".

12. **Old Android WebViews are ancient (Chromium 83-era).** `inset: 0` shorthand, `dvh`, and flex `gap` failed and made the game unplayable. Use long-form properties and dual `100vh; 100dvh`.

13. **Audit ad revenue leaks proactively.** Classic restart and adventure replay of old levels did not trigger interstitial ads — real lost revenue. Centralize round-end events and apply one governance gate.

14. **Verify store IAP support in the installed plugin, not from marketing docs.** The Capacitor RevenueCat wrapper did not expose Galaxy Store IAP although the native SDK supported it. Verify the exact version's capabilities before promising a feature on a store.

15. **Rewarded-ad UI feedback is a conversion feature, not cosmetic.** A tap with no immediate feedback made users close the dialog and leave. Add an instant full-screen loading gate (spinner + localized text) above all overlays, with a safety timeout so no one is ever trapped.

16. **Simulate an economy before shipping it.** A combo-gated powerup experiment cut strong-player supply ~4.6x and nearly removed it for weak players; it was reverted based on measured data. Keep the reverted experiment in a dated backup.

17. **Keep test entrances behind switches and turn them off for release.** A "free practice" test entry survived into a release candidate and had to be removed from every copy.

18. **Measure pixels when cleaning AI-image watermarks.** A vision model reported a watermark still present because of a cached earlier view; pixel measurement proved it was gone. Trust the measurement.

19. **Wiki is not a promotion channel.** A developer-written promotional article with no independent sources will be rejected; a "no conflict of interest" declaration by the developer is false. Get coverage first, declare the conflict, write neutral prose.

20. **Reconcile docs after a rule change.** When a rule is revised, re-read every settled doc and remove the old wording. Two conflicting doctrines cause the next agent to follow the stale one.
