# Stage Workflow — 10 Stages Expanded

Each stage has actions, the command or artifact that proves completion, and the classic failure. Work in order.

## Stage 1 — Concept & Differentiation

**Actions**
- Write the fun hypothesis in one sentence. If the game has no hook beyond "it is like X", decide explicitly whether to clone a proven loop or add a differentiator.
- If differentiating, produce 2–3 concepts, each with one fun hypothesis and one tradeoff. Get a decision before building.
- Art direction: build a visual comparison page with several numbered variants and let the decision maker pick. Do not guess "neon" or "cute" from a single prompt.

**Gate**: hypothesis written, pillars listed, art variant chosen.

**Failure**: a differentiator mechanic that looks clever on paper but produces no interesting player decision (e.g. a "fever meter" that fills and does nothing). Delete features that fail the pillar test.

## Stage 2 — Engine (DOM-free core)

**Actions**
- Implement rules as a pure module with zero DOM dependencies. It must be loadable in node for unit tests.
- Separate what the game *is* from how it *looks*: state, transitions, scoring, level generation go in the engine; drawing goes in a renderer that reads state.
- Write unit tests as behaviors are added, not at the end. Cover: placement, line clear, combo scoring, level generation determinism, powerup effects, win/lose.

**Gate**: `node --check engine.js` passes; unit suite green; engine imports with no `document`/`window` references.

**Failure**: logic entangled with canvas code, so every visual tweak risks breaking rules and no headless test is possible.

## Stage 3 — Renderer & UI

**Actions**
- Canvas2D for the board/pieces; a thin DOM layer for HUD, menus, overlays (easier to localize and to keep accessible).
- Performance from frame one: pre-render blocks and board background to offscreen canvases; use a dirty flag so idle frames skip redraw entirely; set `shadowBlur = 0` in the idle path.
- Bump a texture cache version whenever a sprite changes and clear the cache; otherwise old blocks persist across builds.
- Test on the oldest WebView you must support. For Chromium 83-era kernels avoid `inset: 0` shorthand, `dvh`, and `gap` in flex — use long-form properties and duplicate `100vh; 100dvh`.

**Gate**: a non-blank first frame; idle CPU negligible; renders on an old WebView.

**Failure**: "works on my browser" but a blank or unusable board on the target device's old kernel.

## Stage 4 — Content & Economy

**Actions**
- Put levels, obstacles, and powerups in data tables, not scattered conditionals.
- Obstacles with hit points (ice=1, wood=2, stone=3) and explicit first-appearance levels so difficulty ramps.
- Design deterministic modes: Daily seeded by date, Weekly seeded by week plus modifiers. Adventure uses handcrafted early levels then seeded generation.
- Validate powerup supply with a Monte Carlo simulation over strong and weak player models. Check "how many per session" for both ends. A supply that only rewards good players is punishing; one that showers weak players removes the challenge.

**Gate**: data tables readable; simulation numbers recorded with the rationale; shape pool count documented.

**Failure**: powerup economy tuned by intuition, producing either a flood (no tension) or a drought (churn). See `03-game-design.md`.

## Stage 5 — Quality Gates

**Actions**
- Assemble a repeatable gate set and run all of it after every significant change:
  - `node --check` on every script; compile inline scripts by extracting them.
  - unit tests (target: stable and green, not growing unchecked).
  - i18n checker: every locale has every key and placeholder.
  - level checker: level table structure valid.
  - headless smoke test: page loads, console has no errors, canvas is non-blank.

**Gate**: all green. Red becomes a blocking bug, not a note.

**Failure**: "I will check before release" — which never happens, and a broken string key ships in 11 languages.

## Stage 6 — Package with Capacitor

**Actions**
- `npm install @capacitor/core @capacitor/cli`, `npx cap add android ios`. Keep the web build as the single source the native shell loads.
- Bridge every platform capability behind a guard: `if (window.Capacitor) { ... } else { browser stub }`. The browser demo must still work.
- Persist settings through a storage abstraction that maps to native Preferences but falls back to `localStorage`; this avoids touching dozens of call sites.
- Generate icons/splash from one script with a deterministic tool (a pure-JS image library avoids native image dependency failures).

**Gate**: the packaged app renders identically to the browser build; bridges do not throw in the browser.

**Failure**: porting the game to a native engine to "make it real", burning weeks to reproduce a Canvas look, and losing the tested logic.

## Stage 7 — Multi-platform Structure

**Actions**
- Give each distinct product its own directory and app ID. Do not use git branches for platform variants; you cannot open them simultaneously and merges become hell.
- Different app IDs require different ad accounts. A Galaxy Store build is a separate app: its own package, its own ad IDs, and often no IAP at all if the store's IAP path is unavailable.
- Keep a dedicated sync script per target. Never run a generic sync on a sibling project that would overwrite its namespace/app ID.

**Gate**: each product builds independently; app IDs and ad IDs are pair-wise distinct.

**Failure**: one ad set copied to two packages → no fill on one; a generic sync corrupts the sibling's namespace.

## Stage 8 — Monetization & Privacy

**Actions**
- Decide the model from evidence, not habit. For a casual block puzzle, IAA-heavy with a single remove-ads IAP is the proven shape; verify with current market data.
- AdMob: banner (persistent), interstitial (between rounds), rewarded (opt-in continue). Do not add app-open ads unless requested.
- Rewarded flow: never trust a `show()` promise as "user finished". Use native reward events plus a hard timeout, and lock the UI behind a loading gate so users cannot tap away during the load (that silently kills conversions).
- IAP: non-consumable lifetime entitlement; hide the entry entirely while the key is unconfigured.
- Privacy: fill store data-collection forms from what the SDK actually collects, not from a copied SDK checklist. Self-declared store links and your own site are not third-party sources.

**Gate**: IDs isolated; reward path verified on a device; privacy form matches the SDK's documented data categories.

**Failure**: ads that never fill, a reward that never grants, or a privacy form that contradicts the privacy policy and gets rejected.

## Stage 9 — Prelaunch Self-check

**Actions**
- Run the automated checker. It must test: no placeholder/test values left; per-app ad IDs distinct; generated outputs byte-equal to a fresh regeneration (no hand edits).
- Reconcile native-side IDs too (Android strings, iOS plist) — the web build being clean is not enough.

**Gate**: checker fully green, or every red item is a consciously deferred external dependency (e.g. a real API key to be inserted at release).

**Failure**: shipping `ca-app-pub-...` test IDs or a placeholder store URL.

## Stage 10 — Launch & Promotion

**Actions**
- Localize listings per market: title, short description (byte-limited!), full description, keyword field (byte-limited). Cyrillic and CJK consume ~2 bytes per character; count bytes, not characters.
- Capture real gameplay screenshots with a scripted browser at the target device resolution. Never use AI-generated images of a game board as store screenshots.
- Promo GIF: extract the exciting segment, cap dimensions and fps to fit platform size limits.
- Landing page: self-contained, mobile-first, real playable embed; guard ad scripts so they degrade gracefully off-app.
- Wiki: only with independent reliable sources and a declared conflict of interest. Otherwise it is promotional and will be rejected. Say so plainly.

**Gate**: assets are real, byte limits respected, promotion claims are truthful.

**Failure**: AI mockup screenshots, invented ratings presented as fact, or a wiki article written as an advertisement.
