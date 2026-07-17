#!/usr/bin/env bash
# Hierarchy-aware wrapper for the Skills CLI (skills-tree).
# Source from ~/.bashrc or ~/.zshrc: source ~/cursor-sync/scripts/skills.sh
# Or run once:                       ~/cursor-sync/scripts/skills.sh check

# Resolve once at source/run time (bash + zsh). Capturing the path here matters:
# re-resolving via BASH_SOURCE inside the function breaks under zsh.
if [ -n "${BASH_SOURCE[0]:-}" ]; then
  _SKILLS_WRAPPER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
elif [ -n "${ZSH_VERSION:-}" ]; then
  # zsh: %x is the current script path when sourced or executed
  _SKILLS_WRAPPER_DIR="$(cd "$(dirname "${(%):-%x}")" && pwd)"
else
  _SKILLS_WRAPPER_DIR="$(cd "$(dirname "$0")" && pwd)"
fi

_SKILLS_TREE_BIN="$_SKILLS_WRAPPER_DIR/skills-cli/bin/skills-tree.mjs"

skills() {
  if [ ! -f "$_SKILLS_TREE_BIN" ]; then
    printf 'skills: entrypoint not found: %s\n' "$_SKILLS_TREE_BIN" >&2
    return 1
  fi
  node "$_SKILLS_TREE_BIN" "$@"
}

# Run immediately when executed as a script (not when sourced).
_skills_sourced=0
if [ -n "${BASH_SOURCE[0]:-}" ]; then
  [[ "${BASH_SOURCE[0]}" != "${0}" ]] && _skills_sourced=1
elif [ -n "${ZSH_VERSION:-}" ]; then
  [[ "$ZSH_EVAL_CONTEXT" == *:file:* ]] && _skills_sourced=1
fi

if [ "$_skills_sourced" -eq 0 ]; then
  skills "$@"
fi
