# Pull cursor-sync in the background when the shell starts (no commit/push).
# Dot-source once from $PROFILE:
#   . "$env:USERPROFILE\cursor-sync\scripts\pull-on-start.ps1"

$repo = if ($env:CURSOR_SYNC) { $env:CURSOR_SYNC } else { Split-Path $PSScriptRoot -Parent }
$repo = $repo.TrimEnd('\', '/')

Start-Job -ScriptBlock {
  param($Repo)
  Set-Location $Repo
  git pull --rebase --quiet 2>$null
} -ArgumentList $repo | Out-Null
