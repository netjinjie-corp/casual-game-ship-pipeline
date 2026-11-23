# Game Design — Modes, Economy, Levels, Feedback

Design decisions below come from a real block-puzzle project. Numbers are recorded with rationale or marked as needing validation; never copy them as universal truth.

## Fun Hypothesis First

"This game is fun because completing a line in a neon burst feels crisp and chainable." That sentence drove every pillar: instant tactile feedback, no time pressure, deep but readable combos. Any feature that did not serve those pillars was removed (a fever meter filled and did nothing, so it was deleted).

## Core Loop (three layers)

- **Moment to moment (0–30s)**: drag a piece onto a grid → see it snap with glow/sound → a line clears → score pops. The judgment is spatial: where does this piece go?
- **Session (5–30 min)**: a run with a score target and dwindling board space → tension rises → loss or a new high score. The judgment is risk management.
- **Long term (hours–weeks)**: levels, collection album, daily/weekly seeds, leaderboard of personal bests. The judgment is return motivation.

## Modes

| Mode | Seed | Purpose |
|------|------|---------|
| Classic | none | endless, the pure loop and the main IAA surface |
| Adventure | handcrafted early levels, procedural later | guided learning + progression + obstacle introduction |
| Daily | date | a shared reason to return once per day |
| Weekly | week + modifiers | variety without new content every day |

Verified patterns: obstacles introduced at explicit levels (wood at L9, stone at L17) so players learn one at a time. Handcrafted count should match the level checker's expected value; when the design intentionally changes it, update the checker in the same change.

## Obstacles

- ice: 1 hit; wood: 2 hits; stone: 3 hits.
- Show remaining hit points as a badge on the cell and pulse when damaged — invisible state is a feedback-channel bug, not a design choice.
- Obstacles must be clearable by adjacent line clears; otherwise they become dead cells that silently shrink the board.

## Powerup Economy (sources / sinks)

**Source**: every N lines cleared grants bomb+1 and hammer+1, no cap. Reference value: N=6.

**Sink**: bomb clears a 3x3 area; hammer clears one cell. Initial inventory: one each.

**Why this shape**: Monte Carlo over 2000 games with two player models showed weak players clear very few lines per session (about 97% of their games stayed under 5 lines) so they received almost no supply; strong players received a steady trickle and stockpiled. A combo-gated experiment (combo >= 3, single grant, soft caps) tightened supply about 4.6x for strong players but nearly eliminated it for weak players, and was reverted to avoid punishing the audience most likely to watch a rewarded ad. A combo >= 2 variant measured essentially unchanged from the baseline, so it was rejected too.

**Method to reuse**: write two player models (weak/strong), simulate a few thousand runs, report "grants per session" and "inventory at end" for each. Pick the knob that changes strong-player supply without starving weak players. The safest knob is usually the lines-per-grant threshold. Label any untested value as placeholder with a validation path.

## Shape Pool

- Reference pool: 33 shapes — a base set plus fixed-orientation variants. Pieces do not rotate; orientation variety comes from extra shapes.
- Keep a stable prefix of the pool for special modes (e.g. "small pieces" challenges use indices 0–11). Appending variants must not renumber existing entries, or seeded modes change meaning across versions.

## Scoring & Combo

- Reference scheme: +1 per placed cell; clear = cells cleared × 10 × combo multiplier; multi-line bonus +20.
- A combo should be visible and audible the instant it triggers. If a meter or multiplier exists but does not change a decision, delete it.

## Feedback Channel Diagnosis

When something "feels wrong", check the feedback channel before the mechanic:

| Symptom | Usual cause | Fix |
|---------|-------------|-----|
| Player thinks a button did nothing | no immediate visual change | instant full-screen loading gate with text and spinner |
| Player cannot see a game state | state stored but not rendered | badge/pulse for hit points, combo, cooldowns |
| Rewarded ad conversions leak | user taps away during ad load | lock UI until ad shows, with a hard timeout fallback |
| Board looks wrong on device | pre-multiplied alpha / gamma mismatch | work in the renderer the art was designed for; do not port |
| Idle battery/CPU high | redrawing static frames with shadowBlur | dirty flag + pre-rendered sprites |

## Level & Progression Design

- Keep level definitions declarative and data-driven; generation uses a seeded queue so a given level is reproducible.
- Tutorial flags on the first levels drive a hint banner and a highlight ring; remove them when the player demonstrates the mechanic.
- Progression reward: a collectible mosaic revealed over levels, plus a quote. Give long-term goals something tangible to accumulate.
- Replay of old levels must still count toward any ad-gated event; otherwise replay is a monetization leak.

## Tuning Discipline

- Every cost / reward / duration / cooldown gets a one-line rationale. Untested numbers are marked placeholder with an assumption and a validation path.
- Reverted experiments stay in a dated backup with their measured data. Do not silently delete them — the next designer will re-run the same experiment.
- When a design doc changes, re-read the settled rules and remove stale statements. Two live doctrines are worse than one imperfect one.
