# casual-game-ship-pipeline / 休闲游戏交付流水线

> 一套从零原型到多商店上架的休闲 HTML5 游戏实战流水线——提炼自一款真实上架的霓虹方块游戏。

[![version](https://img.shields.io/badge/version-1.0.0-7c3aed)](https://github.com/netjinjie-corp/casual-game-ship-pipeline) [![format](https://img.shields.io/badge/format-Agent%20Skills-00a3ff)](#安装) [![license](https://img.shields.io/badge/license-见%20LICENSE-orange)](#许可)

[English](./README.md)

你在浏览器里做了一个能玩的游戏。接下来要把它包进三个应用商店、接广告和内购、防止五份 web 副本互相漂移、填一堆没见过的隐私表单、还不能把签名钥匙搞丢。多数个人游戏不是死在代码上，是死在这段"最后一公里"——丢了单一真源，或者广告静默地一单都没填充。

这个 SKILL 就是我带一款真实上架的霓虹方块游戏跨过这段路的全套流水线。它不是教程，也不是模板仓库：是一组决策、硬规则和可执行守卫，让一个人的游戏项目始终保持"可交付"状态。

## 包里有什么

| 资源 | 给你什么 |
|---|---|
| `SKILL.md` | 触发场景、"帮我做个游戏"决策树、10 阶段流水线、6 条铁律。任何 agent 用这个 skill 的入口。 |
| `references/`（7 篇） | 逐阶段动作、生产纪律、带 rationale 的游戏设计数值、变现与隐私、上线清单、推广物料、20 条按代价排序的血泪教训。按需加载。 |
| `scripts/`（4 个守卫） | 模板+配置生成器（带漂移与广告 ID 隔离断言）、上线前扫描器、跨副本 MD5 校验、改前时间戳备份助手。全部实跑过。 |
| `assets/`（2 个模板） | 平台配置样例、占位符令牌 HTML 示例。 |

设计文档里的数值（道具补给、障碍血量、关卡数）来自一个参考项目、附模拟依据，是"怎么调"的范例，不是照抄的真理。

## 10 阶段流水线

| # | 阶段 | 出口门槛 |
|---|------|---------|
| 1 | 概念与差异化 | 写下 fun hypothesis、列支柱、靠对比选美术方向 |
| 2 | 引擎（DOM 无关核心） | 纯逻辑模块、node 单测绿、逻辑与渲染分离 |
| 3 | 渲染与 UI | Canvas + DOM HUD、脏标记跳过静止帧、预渲染精灵、旧 WebView 验过 |
| 4 | 内容与经济 | 关卡/障碍/道具数据化、补给量靠模拟验证 |
| 5 | 质量闸门 | 单测 + i18n key 对齐 + 语法检查 + 无头冒烟全绿 |
| 6 | Capacitor 打包 | 原生壳读**同一份** web 产物、桥接有 `if (window.Capacitor)` 守卫 |
| 7 | 多平台结构 | 不同 app ID / 广告套系放不同目录，不放分支 |
| 8 | 变现与隐私 | 广告 ID 按 app ID 隔离、隐私标签与 SDK 真实采集一致 |
| 9 | 上线前自检 | 占位符 / ID 冲突 / 真源漂移自动检查全绿 |
| 10 | 上线与推广 | 本地化 listing、真实游戏截图、维基中立写或不写 |

## 六条铁律

1. **每次改动前备份** — `backups/YYYY-MM-DD-HHMM-<描述>/`。
2. **单一真源；生成产物永不手改** — 模板 + 平台配置 + 漂移断言。
3. **用真实产物验证** — `node --check`、编译内联脚本、比对 MD5、读已安装 SDK 的接口文件。
4. **交付前用真实输入走通一条核心循环** — 加载、看 console 与非空画面，然后开始→核心操作→得分/失败。
5. **不同 app ID 必须配不同广告 ID** — 用断言强制；无填充通常是后台 ID 问题。
6. **绝不为了对齐原生引擎而重写已经对的视觉** — 包裹那份本来就好看的构建产物。

## 安装

**WorkBuddy（用户级，所有项目可用）：** 把整个 `casual-game-ship-pipeline/` 目录复制到 `~/.workbuddy/skills/casual-game-ship-pipeline/`，重启后在对话里提游戏/打包任务即可触发，也可显式调用。

**WorkBuddy（项目级，团队共享）：** 放到 `<项目>/.workbuddy/skills/casual-game-ship-pipeline/`。

**Claude Code 等兼容 Agent Skills 的 agent：** 把目录放进对应 skills 目录（如 `.claude/skills/`）。frontmatter 里的 `agent_created: true` 是 WorkBuddy 专属提示，其他 agent 会忽略。

**用 zip：** 从 Releases 下载 `casual-game-ship-pipeline.zip`，解压到上述任一位置。

## 验证它真能用（别只信语法检查）

```bash
python3 <skill-creator>/scripts/quick_validate.py ./casual-game-ship-pipeline
node --check scripts/build-index.mjs && node --check scripts/check-prerelease.mjs
bash -n scripts/verify_parity.sh && bash -n scripts/backup_before_edit.sh
```

v1.0.0 时结构校验返回 `valid`，四个脚本语法全过，生成器在最小项目上完成实跑：两平台产物生成、占位符全替换、配置驱动差异确认、广告 ID 隔离通过、上线检查器 11/11 全绿。

## 诚实的适用边界

不适合：没有构建目标的纯游戏设计理论、Unity/Unreal 纯原生项目、带服务端后端的游戏。如果游戏是对现有 HTML5 demo 的 1:1 复刻，铁律 6 适用——包裹它，别移植它。

## 许可

见 [LICENSE](./LICENSE)。用于教学或 fork 时请保留出处说明。

---

*提炼自一款真实上架的游戏项目。这里每一条规则都是花代价学来的。*
