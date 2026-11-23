#!/usr/bin/env bash
# backup_before_edit.sh — timestamped backup helper enforcing the "back up
# before every edit" rule. Same-named files get a prefix to avoid overwriting
# each other inside the same backup folder.
#
# USAGE:
#   bash scripts/backup_before_edit.sh <description> <file> [file ...]
#   bash scripts/backup_before_edit.sh reward-ad-gate web-src/index.template.html config/gp.json
#
# Creates: backups/YYYY-MM-DD-HHMM-<description>/<basename>
# Run this from the project root.
set -eu
if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <description> <file> [file ...]" >&2
  exit 1
fi

desc="$1"; shift
stamp="$(date '+%Y-%m-%d-%H%M')"
dest="backups/${stamp}-${desc}"
mkdir -p "$dest"
for f in "$@"; do
  if [ ! -f "$f" ]; then echo "MISSING: $f" >&2; continue; fi
  base="$(basename "$f")"
  cp "$f" "$dest/$base"
  echo "backed up: $f -> $dest/$base"
done
echo "backup directory: $dest"
