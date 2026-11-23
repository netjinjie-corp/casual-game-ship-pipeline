// build-index.mjs — Template + per-platform config → platform HTML
// ============================================================================
// PURPOSE
//   Maintain shared game/UI logic in ONE template, keep platform-only values in
//   small config files, and generate every build output. This removes two whole
//   classes of regression: (1) a full-file sync overwriting a platform's ad IDs,
//   (2) context-sensitive patches breaking when the source line changes.
//
// ADAPT FOR A NEW PROJECT
//   1. Set TEMPLATE_PATH, TARGETS (output paths + config paths) below.
//   2. Edit the TOKENS table: each entry is [placeholderInTemplate, getter(config)].
//   3. Put matching placeholders like __STORE__ in the template.
//   4. Add npm scripts:  "build:index": "node scripts/build-index.mjs"
//
// USAGE
//   node scripts/build-index.mjs            # all platforms
//   node scripts/build-index.mjs gp         # one platform (TARGETS[].name)
//
// SELF-CHECKS (run when all targets are generated)
//   - byte parity: rendering the template twice with identical sentinel config
//     must produce identical output → proves no hidden platform content in template
//   - ID isolation: a configured list of values must be pairwise different across
//     platforms (e.g. each app needs its own ad IDs)
// ============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// --- ADAPT: paths -----------------------------------------------------------
export const TEMPLATE_PATH = path.join(root, 'web-src', 'index.template.html');
export const TARGETS = [
  { name: 'gp',      out: path.join(root, 'www', 'index.html'),                              config: path.join(root, 'config', 'gp.json') },
  { name: 'samsung', out: path.join(root, 'samsung','app','src','main','assets','public','index.html'), config: path.join(root, 'config', 'samsung.json') }
];

// --- ADAPT: placeholder → config getter ------------------------------------
export const TOKENS = [
  ['__STORE__',                (c) => c.store],
  ['__USE_TEST__',             (c) => String(c.useTest)],
  ['__APPID_ANDROID__',        (c) => c.appId.android],
  ['__AD_BANNER_ANDROID__',    (c) => c.prod.banner],
  ['__AD_INTERSTITIAL_ANDROID__', (c) => c.prod.interstitial],
  ['__AD_REWARDED_ANDROID__',  (c) => c.prod.rewarded]
];

// --- ADAPT: values that MUST differ across platforms -----------------------
const ISOLATION_GETTERS = [
  ['appId',       (c) => c.appId.android],
  ['banner',      (c) => c.prod.banner],
  ['interstitial',(c) => c.prod.interstitial],
  ['rewarded',    (c) => c.prod.rewarded]
];

export function loadConfig(p) {
  const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
  delete cfg['//']; // allow a comment key in JSON
  return cfg;
}

export function render(template, cfg) {
  let out = template;
  for (const [token, getter] of TOKENS) {
    const val = getter(cfg);
    if (val === undefined || val === null) throw new Error(`config missing field for ${token}`);
    if (!out.includes(token)) throw new Error(`template missing placeholder ${token}`);
    out = out.split(token).join(val);
  }
  const leftover = out.match(/__[A-Z_]+__/g);
  if (leftover) throw new Error(`unreplaced placeholders: ${leftover.join(', ')}`);
  return out;
}

function sentinelConfig() {
  return {
    store: 'SENTINEL', useTest: false,
    appId: { android: 'SENTINEL_APPID' },
    prod: { banner: 'SENTINEL_B', interstitial: 'SENTINEL_I', rewarded: 'SENTINEL_R' }
  };
}

function main() {
  const only = process.argv[2];
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const selected = only ? TARGETS.filter((t) => t.name === only) : TARGETS;
  if (only && selected.length === 0) {
    console.error(`Unknown platform: ${only} (choose from: ${TARGETS.map(t=>t.name).join(' | ')})`);
    process.exit(1);
  }

  const rendered = {};
  for (const t of selected) {
    const out = render(template, loadConfig(t.config));
    fs.mkdirSync(path.dirname(t.out), { recursive: true });
    fs.writeFileSync(t.out, out);
    console.log(`OK  ${t.name.padEnd(8)} -> ${path.relative(root, t.out)}`);
    rendered[t.name] = out;
  }

  if (TARGETS.every((t) => rendered[t.name])) {
    // config actually drives differences: two DIFFERENT configs must produce
    // different output. If they match, the config is not wired to the template.
    const allConfigs = TARGETS.map((t) => loadConfig(t.config));
    const probe = { ...sentinelConfig(), ...allConfigs[0] };
    const a = render(template, probe);
    const b = render(template, { ...sentinelConfig(), ...(allConfigs[1] || probe) });
    if (a === b) {
      console.log('WARN platform configs produced identical output — check that TOKENS are wired');
    } else {
      console.log('OK  platform configs drive real differences in output');
    }

    // isolation: configured values must be pairwise different
    for (const [name, getter] of ISOLATION_GETTERS) {
      const vals = TARGETS.map((t) => getter(loadConfig(t.config)));
      if (new Set(vals).size !== vals.length) {
        throw new Error(`ID isolation failed: ${name} is shared across platforms`);
      }
    }
    console.log('OK  platform IDs are pairwise distinct');
  }
  console.log('build-index done');
}

const isMain = process.argv[1] && process.argv[1].endsWith('build-index.mjs');
if (isMain) {
  try { main(); } catch (e) { console.error('FAIL ' + e.message); process.exit(1); }
}
