# Production Discipline — Backups, Sync, Verification, Rollback

These rules exist because each one was learned from a loss. Apply them to every project, not just the reference one.

## 1. Backup Before Every Edit

- Destination: `backups/YYYY-MM-DD-HHMM-<short-description>/`.
- Copy the exact files being changed *before* touching them. A one-line edit gets a backup too.
- Same-named files going into one backup directory must carry a prefix (`gp-index.html`, `sam-index.html`), or the later copy silently overwrites the earlier.
- Keep two special snapshots:
  - a **golden** backup (last known fully-good state) with a `RESTORE.md` explaining how to roll back;
  - a dated **stable snapshot** at major milestones.
- When a physical snapshot is large, record its path in the memory/log so it can be found later.

Why: a "minor" change to the wrong file once overwrote a build containing a week of fixes that existed only in one platform's copy.

## 2. Identify the Source of Truth Before Editing

- Ask: which file is actually loaded by the shipping build? The file with the friendliest name is often stale.
- Mark the source explicitly: "X is the only source; Y/Z/W are generated copies."
- Any fix applied to a generated copy will be erased on the next sync. Apply it to the source, then regenerate.

## 3. One Source of Truth via Template + Config

The strongest form of Rule 2 separates "must be identical" from "must differ":

```
web-src/index.template.html     ← all shared game/UI logic (ONE copy)
config/gp.json                  ← platform-only values
config/samsung.json
scripts/build-index.mjs         ← renders template + config → each platform's index.html
```

Rules:
- Platform differences must be expressible as a small, explicit token list (store type, test flag, ad IDs). If a difference cannot be tokenized, that is a design smell — reconsider whether the two products should share the template at all.
- The build script must self-check: render the template twice with identical sentinel config and require byte equality (proves no hidden platform content in the template); require platform ad IDs to be pairwise different.
- A separate prelaunch check regenerates from template + config and byte-compares against the committed output. Any mismatch means someone hand-edited a generated file.
- Delete fragile patch files once a template exists. Patches tied to line context break whenever the source line changes.

Script template: `scripts/build-index.mjs` in this skill. Adapt its token table.

## 4. Sync Discipline

- One dedicated script per target. Never a blind recursive sync across sibling projects.
- After any source change, sync all targets in one pass, then verify MD5 equality for every shared file.
- Verify both directions: shared files must match; platform-unique files must NOT match.
- Record the canonical MD5 of stable files in the log so drift is visible even without a checker.

## 5. Syntax & Static Checks

- `node --check file.mjs` for every JS/Node script.
- For inline scripts in HTML, extract all non-`src` `<script>` blocks to a temp file and run `node --check` on the concatenation.
- `bash -n` for shell scripts.
- i18n checker: every locale defines every key used by `t()`, and placeholders match.
- level checker: verify level data shape, obstacle values, and expected level count. Update the checker when the design intentionally changes level count — a stale expected value is a false red.

## 6. Test Flags as Release Switches

Centralize switches in one config object: test mode, dev panel, IAP entry enable, ad governance. Browser demo paths should use test IDs; production builds must assert those test values are gone. A single place to flip means fewer "forgot to disable the test entrance" incidents.

## 7. Runtime Verification With Real Input

- Load the actual build (not a mock) in a browser or device.
- Confirm: no console errors; canvas non-blank; overlay state as expected.
- Drive a core loop with genuine clicks/drags: start → place → score or fail. Wait past any splash/guide overlays instead of force-clicking through them blindly.
- A green syntax check plus a DOM assertion is not verification of gameplay. Say explicitly which parts were and were not exercised.

## 8. Diagnose From Real Source

- Read the installed SDK's `.swiftinterface`/`.java` implementation to learn what an API actually does; do not infer from its name.
- A `show()` promise may resolve on "ad shown", not "reward earned"; an interstitial promise may resolve before dismissal; a banner reload after a full-screen ad may permanently destroy the banner. These are found by reading source and device logs, not by guessing.
- Use measured geometry (`getBoundingClientRect`) when debugging layout; do not estimate.
- For "no fill", capture the actual error code before blaming code.

## 9. Rollback

- Revert from the most recent good backup, not by manually undoing edits.
- After a rollback, re-run the full gate set; a partial rollback that leaves one generated copy on the new version is worse than no rollback.
- When an experiment is discarded, keep it in a dated backup and note the reason and the measured data. Reversible decisions encourage honest experimentation.

## 10. Log What Matters

Append a short note to the project's dated work log after substantive work: what changed, which files, verification result, and any deliberate deviation from the settled rules. Do not log transient tool errors or search results. Distill old logs into the long-term project note periodically and delete the oldest once they are summarized.
