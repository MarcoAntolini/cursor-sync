#!/usr/bin/env bash
set -uo pipefail

SYNC="$HOME/cursor-sync"
STATUS="$SYNC/.skills-check-status.json"
LOCK="$SYNC/.skills-check.lock"

exec 9>"$LOCK"
flock -n 9 || exit 0

OUTPUT=$(timeout 90 npx -y skills check -g 2>&1) || true

# Heuristic: count lines that look like an update notice.
# Adjust the regex once you've seen real output from the CLI.
PENDING=$(printf '%s\n' "$OUTPUT" \
  | grep -ciE 'update available|outdated|needs? update' || true)
SKILLS=$(printf '%s\n' "$OUTPUT" \
  | grep -iE 'update available|outdated|needs? update' \
  | awk '{print $1}' | paste -sd "," -)

cat > "$STATUS" <<EOF
{
  "checkedAt": $(date +%s),
  "pending": ${PENDING:-0},
  "summary": "${SKILLS:-}"
}
EOF