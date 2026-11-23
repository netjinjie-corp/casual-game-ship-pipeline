---
name: casual-game-ship-pipeline
description: Build and ship a casual HTML5 block or puzzle game from zero prototype to multi-store release. Use when asked to create a casual game, wrap a browser game into Android, iOS, or third-party stores with Capacitor, set up AdMob and in-app purchase, localize store listings, or avoid regressions while maintaining multiple platform builds of one web game. Encodes a ten-stage pipeline, hard anti-regression discipline, and reusable scripts for single-source-of-truth builds and prelaunch checks.
agent_created: true
---

# Casual Game Ship Pipeline

## Overview

This skill turns "make me a casual game" into a shippable, multi-platform product. It captures a complete, real-world pipeline: a DOM-free game engine and Canvas renderer, Capacitor wrapping, ad and IAP monetization, multi-store compliance, localization, and promotional assets. Follow it to avoid the expensive mistakes that sink hobby games — losing the source of truth, corrupting a signed keystore, or shipping a build whose ads silently never fill.

Use imperative, verb-first instructions. When a fact below conflicts with a specific user decision, the user decision wins; record it explicitly as a deliberate deviation.

## When to Use

- Building a new casual game (block puzzle, match, arcade, idle) that must run on web and in app stores.
- Wrapping an existing HTML5 game into Android, iOS, Galaxy Store, or HTML5 portals.
- Adding or debugging ads (AdMob), IAP (RevenueCat), or store privacy forms.
- Maintaining several platform builds of one web game without them drifting apart.
- Producing launch materials: localized listings, screenshots, promo images, landing pages.

Not for: pure game-design theory with no build target; native-only engines (Unity/Unreal); non-casual genres with server backends.

## The Fun Hypothesis Gate

Before writing any code, write one sentence: "This game is fun because ____." If it cannot be written, stop and ask. Then derive 3–5 design pillars and use them to reject features later. Every mechanic must answer: what decision is the player making right now, and why is it interesting? See `references/03-game-design.md` for the numeric economy method (sources/sinks, Monte Carlo tuning) used on the reference project.

## Workflow Decision Tree

```
New "make me a game" request
├─ Missing genre / platform / target user / session length?  → ASK first (do not stack assumptions)
├─ Need a differentiator vs an existing hit?
│  ├─ Yes → 2–3 concepts, each with a one-line fun hypothesis + tradeoff; get a pick
│  └─ No  → clone a proven core loop; copy mechanics, never branding
├─ Rendering target?
│  ├─ Must match an existing HTML5 demo pixel-for-pixel → WRAP with Capacitor (do NOT port to a native engine)
│  └─ Greenfield with no reference → Canvas2D + DOM UI is fastest; native engine only with a hard reason
└─ Go to Stage 1
```

## The 10-Stage Pipeline

Work stages in order; do not skip the exit gates.

| # | Stage | Exit gate |
|---|-------|-----------|
| 1 | Concept & differentiation | Fun hypothesis written; pillars listed; art direction chosen from visual comparison, not guessed |
| 2 | Engine (DOM-free core) | Rules are a pure module with no DOM; node unit tests green; visual and logic separated |
| 3 | Renderer & UI | Canvas + DOM HUD; idle frames skip redraw (dirty flag); pre-rendered sprites; verified on an old WebView |
| 4 | Content & economy | Levels, obstacles, powerups live in data tables; powerup supply validated by simulation, not vibes |
| 5 | Quality gates | Unit tests + i18n key alignment + node syntax check + headless smoke test all green |
| 6 | Package with Capacitor | Native shell reads the SAME web build; platform bridges guarded by `if (window.Capacitor)` |
| 7 | Multi-platform structure | Distinct products (different app IDs / ad sets) live in distinct directories, not branches |
| 8 | Monetization & privacy | Ad IDs isolated per app ID; IAP sku and entitlement decided; privacy labels match what SDKs actually collect |
| 9 | Prelaunch self-check | Automated checker green on placeholders, ID collisions, and source-of-truth drift |
| 10 | Launch & promotion | Store listings localized; assets are real gameplay, not AI mockups; wiki written neutral or not at all |

Each stage's concrete actions, commands, and failure modes live in `references/01-stage-workflow.md`. Read it when executing a stage.

## The Six Iron Rules

Non-negotiable. These come from real losses, not style preferences.

1. **Back up before every edit.** Copy to `backups/YYYY-MM-DD-HHMM-<description>/`. Keep a golden snapshot and a dated stable snapshot with a RESTORE note. Same-named files in one backup dir must carry a prefix or they overwrite each other.
2. **One source of truth; generated outputs are never hand-edited.** Put shared logic in a template, platform differences in per-platform config, and generate all build outputs. Add a drift assertion that regenerates and byte-compares. Never patch a generated copy.
3. **Verify with the real artifact.** Run `node --check`; compile inline scripts; compare MD5 across copies; read the installed SDK's own interface files instead of guessing an API; use real gameplay screenshots, not illustrations.
4. **Real input walks a core loop before delivery.** Load the build, confirm no console errors and a non-blank frame, then drive start → core action → score/fail with genuine input. Syntax checks and mocked events do not count.
5. **Different app IDs need different ad IDs.** Enforce with an automated assertion. One ad account per package name; a no-fill on a new package is usually a backend ID problem, not code.
6. **Never rewrite a working visual to chase a native-engine match.** If a look depends on Canvas2D shadow blur or alpha compositing, porting to another engine can take a dozen tuning rounds and still fail. Wrap the working build.

Full discipline set and anti-patterns: `references/02-production-discipline.md`.

## Reusable Resources

**references/** (load on demand)
- `01-stage-workflow.md` — the 10 stages expanded: actions, commands, gates, what breaks.
- `02-production-discipline.md` — backup/sync/verify discipline, test flags, rollback.
- `03-game-design.md` — modes, obstacles, powerup economy with Monte Carlo rationale, shape pool, level design, feedback-channel diagnosis.
- `04-monetization-compliance.md` — AdMob, IAP, privacy data categories, iOS/Xcode constraints, per-store specifics.
- `05-launch-checklist.md` — copyable prelaunch checklist with pass criteria.
- `06-promotion-kit.md` — localized listing fields, GIF/promo image/landing page, and the honest truth about wiki promotion.
- `07-pitfalls.md` — ranked list of battle-tested "if I did it again" lessons.

**scripts/** (executable, deterministic)
- `build-index.mjs` — template plus per-platform config to platform HTML, with byte-parity and ID-isolation assertions. Adapt the token table for any project.
- `check-prerelease.mjs` — scans for placeholder IDs, test values, and source-of-truth drift; prints a red/green list.
- `verify_parity.sh` — MD5 comparison across all distributed copies of a shared file.
- `backup_before_edit.sh` — timestamped backup helper enforcing Rule 1.

Read each script's header comment before running; paths are project-relative and must point at the real project root.

**assets/**
- `config.template.json` — starter per-platform config (store, useTest, ad IDs).
- `index.template.example.html` — minimal example of the placeholder tokens the build script replaces.

## Iteration Discipline

When tuning a number (powerup rate, ad frequency, difficulty), never invent a value. State the assumption, run a simulation or playtest, and label untested values as placeholder with a validation path. When an experiment is reverted, keep the reverted code in a dated backup so the decision is reversible and documented. After editing any doc or config, re-read the settled rules and delete stale wording so two conflicting doctrines never coexist.
