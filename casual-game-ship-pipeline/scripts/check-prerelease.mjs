#!/usr/bin/env node
// check-prerelease.mjs — scan built outputs for leftover placeholders, test
// values, and source-of-truth drift. Prints a red/green checklist.
// ============================================================================
// ADAPT FOR A NEW PROJECT
//   Edit the CHECKS array below. Each check is { name, ok, detail }.
//   Import render/loadConfig/TEMPLATE_PATH/TARGETS from build-index.mjs to add
//   a source-of-truth drift assertion (recommended — see the last check).
// USAGE: node scripts/check-prerelease.mjs
// EXIT:  always 0 by default; a CI can turn fail>0 into exit 1 if desired.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, loadConfig, TEMPLATE_PATH, TARGETS } from './build-index.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => {
  const f = resolve(root, p);
  return existsSync(f) ? readFileSync(f, 'utf8') : '';
};
const checks = [];
const add = (name, ok, detail) => checks.push({ name, ok, detail: ok ? '' : (detail || '') });

// --- ADAPT: your known placeholder / test markers --------------------------
const TEST_AD_ID = 'ca-app-pub-3940256099942544~3347511713';
const html = read('www/index.html');

add('useTest = false', /\buseTest:\s*false/.test(html), 'test ads are still enabled');
add('no ad unit placeholders', !/<YOUR_/.test(html), 'found <YOUR_...> placeholder');
add('no test ad App ID', !html.includes(TEST_AD_ID), 'official test App ID still present');
add('no IAP key placeholder', !/<RC_/.test(html), 'found <RC_...> placeholder');
add('store URL configured', !/STORE_URL\s*=\s*['"]https?:\/\/example\.com/.test(html), 'store URL is example.com');
add('privacy URL public', !/PRIVACY_PUBLIC_URL\s*=\s*['"]https?:\/\/example\.com/.test(html), 'privacy URL is example.com');

// --- ADAPT: per-platform ad ID isolation -----------------------------------
{
  const gp = loadConfig(resolve(root, 'config', 'gp.json'));
  const sam = loadConfig(resolve(root, 'config', 'samsung.json'));
  const pairs = [
    ['appId', gp.appId?.android, sam.appId?.android],
    ['banner', gp.prod?.banner, sam.prod?.banner],
    ['interstitial', gp.prod?.interstitial, sam.prod?.interstitial],
    ['rewarded', gp.prod?.rewarded, sam.prod?.rewarded]
  ];
  for (const [name, a, b] of pairs) {
    add(`${name} ID differs across apps`, !!(a && b && a !== b), `gp=${a || '?'} / samsung=${b || '?'}`);
  }
}

// --- source-of-truth drift: regenerate and byte-compare --------------------
{
  const template = readFileSync(TEMPLATE_PATH, 'utf8');
  let ok = true; const details = [];
  for (const t of TARGETS) {
    const expected = render(template, loadConfig(t.config));
    const actual = read(relative(root, t.out));
    if (expected !== actual) {
      ok = false;
      details.push(`${t.name}: committed output differs from template+config (hand-edited generated file?)`);
    } else details.push(`${t.name}: consistent`);
  }
  add('all outputs equal template+config generation (no drift)', ok, details.join(' | '));
}

const pass = checks.filter((c) => c.ok).length;
const fail = checks.length - pass;
console.log('\n=== Prelaunch check ===\n');
for (const c of checks) console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? '  -> ' + c.detail : ''}`);
console.log(`\nResult: ${pass}/${checks.length} passed, ${fail} pending.`);
