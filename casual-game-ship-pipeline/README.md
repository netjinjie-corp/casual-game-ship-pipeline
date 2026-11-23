# casual-game-ship-pipeline

> A field-tested playbook for shipping a casual HTML5 game — from first prototype to Google Play, App Store, Galaxy Store and HTML5 portals.

[![version](https://img.shields.io/badge/version-1.0.0-7c3aed)](https://github.com/netjinjie-corp/casual-game-ship-pipeline) [![format](https://img.shields.io/badge/format-Agent%20Skills-00a3ff)](#installation) [![license](https://img.shields.io/badge/license-see%20LICENSE-orange)](#license)

[中文说明](./README.zh-CN.md)

You built a browser game that works. Now you have to wrap it for three app stores, wire up ads and IAP, keep five copies of the web build from drifting apart, fill in privacy forms you have never seen, and not break the signing key on the way out. Most hobby games die in that gap — not from bad code, but from losing the source of truth or shipping ads that silently never fill.

This skill is the pipeline I used to cross that gap with a real, released neon block puzzle game. It is not a tutorial and not a template repo: it is a set of decisions, hard rules, and executable guards that keep a one-person game project shippable.

## What is inside

| Resource | What it gives you |
|---|---|
| `SKILL.md` | Trigger conditions, a "make me a game" decision tree, the 10-stage pipeline, and 6 non-negotiable rules. The entry point for any agent using the skill. |
| `references/` (7 docs) | Stage-by-stage actions, production discipline, game-design numbers with rationale, monetization and privacy, a launch checklist, promotion assets, and 20 ranked failure lessons. Loaded on demand. |
| `scripts/` (4 guards) | Template + config generator with drift and ID-isolation assertions, prelaunch scanner, cross-copy MD5 parity check, timestamped backup helper. All smoke-tested. |
| `assets/` (2 templates) | A per-platform config starter and a placeholder-token HTML example. |

The numbers in the design doc (powerup supply, obstacle HP, level counts) come from one reference project and carry their simulation rationale. They are examples of *how to tune*, not values to copy blindly.

## The 10-stage pipeline

| # | Stage | Exit gate |
|---|-------|-----------|
| 1 | Concept & differentiation | Fun hypothesis written, pillars listed, art direction chosen by comparison |
| 2 | Engine (DOM-free core) | Pure logic module, node unit tests green, logic separated from rendering |
| 3 | Renderer & UI | Canvas + DOM HUD, dirty-flag idle skip, pre-rendered sprites, old-WebView checked |
| 4 | Content & economy | Data-driven levels / obstacles / powerups, supply validated by simulation |
| 5 | Quality gates | Unit tests + i18n key alignment + syntax check + headless smoke test green |
| 6 | Package with Capacitor | Native shell reads the *same* web build, bridges guarded by `if (window.Capacitor)` |
| 7 | Multi-platform structure | Different app IDs / ad sets live in different directories, not branches |
| 8 | Monetization & privacy | Ad IDs isolated per app ID, privacy labels match what SDKs actually collect |
| 9 | Prelaunch self-check | Automated checker green on placeholders, ID collisions, source drift |
| 10 | Launch & promotion | Localized listings, real gameplay screenshots, neutral wiki or no wiki |

## Six iron rules

1. **Back up before every edit** — `backups/YYYY-MM-DD-HHMM-<description>/`.
2. **One source of truth; generated outputs are never hand-edited** — template + per-platform config + a drift assertion.
3. **Verify with the real artifact** — `node --check`, compile inline scripts, compare MD5, read installed SDK interfaces.
4. **Real input walks a core loop before delivery** — load, check console and non-blank frame, then start → core action → score/fail.
5. **Different app IDs need different ad IDs** — enforced by assertion; a no-fill is usually a backend ID problem.
6. **Never rewrite a working visual to chase a native-engine match** — wrap the build that already looks right.

## Installation

**WorkBuddy (user scope, all projects):** copy the whole `casual-game-ship-pipeline/` directory to `~/.workbuddy/skills/casual-game-ship-pipeline/`, restart, then mention a game/build task in conversation or invoke it explicitly.

**WorkBuddy (project scope, share with a team):** put it under `<project>/.workbuddy/skills/casual-game-ship-pipeline/`.

**Claude Code and other Agent Skills–compatible agents:** drop the directory into the agent's skills folder (e.g. `.claude/skills/`). `agent_created: true` in the frontmatter is a WorkBuddy-only hint and is ignored elsewhere.

**Zip:** download `casual-game-ship-pipeline.zip` from Releases and unzip into any of the above locations.

## Verify it works (do not trust syntax checks alone)

```bash
python3 <skill-creator>/scripts/quick_validate.py ./casual-game-ship-pipeline
node --check scripts/build-index.mjs && node --check scripts/check-prerelease.mjs
bash -n scripts/verify_parity.sh && bash -n scripts/backup_before_edit.sh
```

At v1.0.0 the structure validator returned `valid`, all four scripts passed syntax checks, and the generator was smoke-tested on a minimal project: two platform outputs rendered, placeholders fully replaced, config-driven differences confirmed, ad-ID isolation passed, and the prelaunch checker returned 11/11 green.

## Honest scope

Not for: pure game-design theory with no build target, Unity/Unreal native-only projects, or games with a server backend. If the game is an exact clone of an existing HTML5 demo, rule 6 applies — wrap it, do not port it.

## License

See [LICENSE](./LICENSE). If you fork this for teaching, keep the source note.

---

*Extracted from a real released game project. Every rule here cost something to learn.*
