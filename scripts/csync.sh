#!/usr/bin/env bash
# Sync cursor-sync: stage, commit if needed, pull --rebase, push.
# Source from ~/.bashrc or ~/.zshrc:  source ~/cursor-sync/scripts/csync.sh
# Or run once:                        ~/cursor-sync/scripts/csync.sh "optional message"

_cursor_sync_repo() {
  if [[ -n "${CURSOR_SYNC:-}" ]]; then
    printf '%s' "$CURSOR_SYNC"
  else
    cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd
  fi
}

csync() {
  local msg="${1:-sync $(date -u +"%Y-%m-%dT%H:%M:%SZ")}"
  local repo
  repo="$(_cursor_sync_repo)" || return 1

  (
    cd "$repo" || exit 1
    git add -A
    if ! git diff --cached --quiet; then
      git commit -m "$msg"
    fi
    git pull --rebase --autostash --quiet
    git push --quiet
  )
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  csync "$@"
fi
