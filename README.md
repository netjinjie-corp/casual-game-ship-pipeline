# casual-game-ship-pipeline

A field-tested 10-stage pipeline for shipping casual HTML5 games to multiple stores. Packaged as an Agent Skill, installable in WorkBuddy, Claude Code and other compatible agents.

The skill itself lives in [casual-game-ship-pipeline/](casual-game-ship-pipeline/) - look for `SKILL.md` there.

## What it covers

Prototype to launch: engine/UI split, level and economy design, single-source-of-truth web resources, multi-platform builds (Google Play / App Store / Samsung), AdMob and RevenueCat monetization, privacy compliance, launch checklist, and promotion assets.

## Install

WorkBuddy:

    cp -R casual-game-ship-pipeline ~/.workbuddy/skills/

Claude Code:

    cp -R casual-game-ship-pipeline ~/.claude/skills/

Restart the agent, then ask for a casual game shipping pipeline.

## Package contents

- `SKILL.md` - decision tree, 10 stages, 6 iron rules
- `references/` - 7 topic guides (workflow, discipline, design, monetization, checklist, promotion, pitfalls)
- `scripts/` - 4 battle-tested tools (template plus config generator, pre-release checker, parity check, backup helper)
- `assets/` - platform config and placeholder HTML templates

## Verify

    node --check scripts/build-index.mjs
    node scripts/check-prerelease.mjs

## Docs

[中文说明](casual-game-ship-pipeline/README.zh-CN.md) - [Skill 目录](casual-game-ship-pipeline/SKILL.md)

## License

MIT - see [LICENSE](casual-game-ship-pipeline/LICENSE).
