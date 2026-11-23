#!/usr/bin/env bash
# verify_parity.sh — MD5 comparison of one shared file across all its copies.
# Catches "changed one copy, forgot the others" drift.
#
# USAGE:
#   bash scripts/verify_parity.sh <relative-path-to-source> <copy1> <copy2> ...
#   bash scripts/verify_parity.sh chroma-chain/game.js www/game.js android/.../game.js ios/.../game.js
#
# EXITS 0 if every MD5 matches, 1 otherwise.
set -u
if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <source> <copy> [copy ...]" >&2
  exit 1
fi

src="$1"; shift
hash_of() { md5 -q "$1" 2>/dev/null || md5sum "$1" 2>/dev/null | awk '{print $1}'; }

if [ ! -f "$src" ]; then echo "MISSING source: $src" >&2; exit 1; fi
expected="$(hash_of "$src")"
echo "source  $expected  $src"
fail=0
for f in "$@"; do
  if [ ! -f "$f" ]; then echo "MISSING copy: $f" >&2; fail=1; continue; fi
  got="$(hash_of "$f")"
  if [ "$got" = "$expected" ]; then
    echo "OK      $got  $f"
  else
    echo "DRIFT   $got  $f  (expected $expected)" >&2
    fail=1
  fi
done
if [ "$fail" -eq 0 ]; then echo "All copies match."; else echo "Drift detected." >&2; fi
exit "$fail"
