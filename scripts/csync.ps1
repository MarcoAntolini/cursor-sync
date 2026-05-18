# Sync cursor-sync: stage, commit if needed, pull --rebase, push.
# Dot-source from your profile:  . "$env:USERPROFILE\cursor-sync\scripts\csync.ps1"
# Or run once:                 pwsh -File ./scripts/csync.ps1 "optional message"

function global:csync {
  param([string]$msg = "sync $(Get-Date -Format o)")

  $repo = if ($env:CURSOR_SYNC) { $env:CURSOR_SYNC } else { Split-Path $PSScriptRoot -Parent }
  $repo = $repo.TrimEnd('\', '/')

  Push-Location $repo
  try {
    git add -A
    git diff --cached --quiet
    if ($LASTEXITCODE -ne 0) {
      git commit -m $msg | Out-Null
    }
    git pull --rebase --autostash --quiet
    git push --quiet
  } finally {
    Pop-Location
  }
}

if ($MyInvocation.InvocationName -ne '.') {
  csync @args
}
