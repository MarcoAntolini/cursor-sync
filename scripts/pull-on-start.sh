#!/usr/bin/env bash
# Pull cursor-sync in the background when the shell starts (no commit/push).
# Source once from ~/.bashrc or ~/.zshrc:
#   source ~/cursor-sync/scripts/pull-on-start.sh

_cursor_sync_repo() {
  if [[ -n "${CURSOR_SYNC:-}" ]]; then
    printf '%s' "$CURSOR_SYNC"
  else
    cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd
  fi
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  echo "Source this file from your shell profile, do not execute it directly." >&2
  exit 1
fi

repo="$(_cursor_sync_repo)" || return 0
(cd "$repo" && git pull --rebase --quiet 2>/dev/null) &
